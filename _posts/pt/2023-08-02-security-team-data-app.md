---
lang: pt
page_id: secops-data
permalink: /posts/secops-data
title: Implantando Defesa SecOps com Capacidade de Banco de Dados IoC
date: 2023-08-02
categories: [Docker, AWS, Rails, Ruby, Secops]
tags: [Secops, AWS, Docker, Rails, Ruby, FullStack]
author: Angel
description: Implantando Defesa SecOps com Capacidade de Banco de Dados IoC. Coletar, triar, atacar e distribuir indicadores de comprometimento para proteger usuários.
image: /assets/img/scamhitlist.png
---

# Como Construir e Implantar um App Full Stack de Denúncia de Golpes com Rails

Este guia orienta você na configuração, execução e implantação de uma aplicação full stack de denúncia de golpes construída com Ruby on Rails. O app permite que usuários denunciem Indicadores de Comprometimento (IOCs), acompanhem o progresso, anexem evidências e colaborem em casos.

## Recursos
- Denunciar e rastrear IOCs com múltiplas integrações de API
- Mais eficiente que planilhas
- Permite que usuários não autorizados enviem IOCs
- Suporta anexo de evidências e rastreamento
- Permite que múltiplos usuários trabalhem no mesmo IOC

---

## 1. Importando Dados CSV no PostgreSQL
Para importar dados CSV no Postgres, certifique-se de que:
- Células vazias estão definidas como `null`
- Timestamps placeholder para `created_at` e `updated_at` existem se nenhum for fornecido
- A ordem das colunas corresponde à estrutura da tabela

### Passos:
1. Acesse PostgreSQL no Heroku:
   ```sh
   heroku pg:psql -a scam-hitlist
   ```
2. Execute o seguinte comando:
   ```sh
   \copy iocs(id,url,created_at,updated_at,removed_date,status,report_method_one,report_method_two,form,host,follow_up_date,follow_up_count,comments) FROM './lib/data.csv' WITH DELIMITER ',' NULL AS 'null' CSV HEADER;
   ```
3. Mensagem de sucesso: `copy 7000` (ou número similar)

---

## 2. Configuração
1. Instale dependências:
   ```sh
   bundle install
   ```
2. Configure o banco de dados:
   ```sh
   rails db:drop db:create db:migrate db:seed
   ```

---

## 3. Executando o App
1. Inicie o servidor e execute JavaScript:
   ```sh
   dev
   ```
2. Se recursos de front-end estiverem faltando, compile assets:
   ```sh
   rails assets:precompile
   ```

---

## 4. Configuração do Banco de Dados
Após semear o banco de dados, atualize manualmente o próximo ID:
```sh
highest_id = Ioc.maximum(:id)
next_available_id = highest_id + 1
ActiveRecord::Base.connection.execute("SELECT setval('iocs_id_seq', #{next_available_id}, false)")
```

Para redefinir a sequência do banco de dados:
```sh
heroku restart; heroku pg:reset DATABASE --confirm APP-NAME; heroku run rake db:migrate
```

---

## 5. Implantando no Heroku
### Adicionar Buildpacks Necessários
1. Chrome:
   ```sh
   heroku buildpacks:add heroku/google-chrome --index=1
   ```
2. Node.js:
   ```sh
   heroku buildpacks:add heroku/nodejs --index=2
   ```
3. Puppeteer (opcional):
   ```sh
   heroku buildpacks:add jontewks/puppeteer --index=3
   ```
4. Defina a variável de ambiente:
   ```sh
   heroku config:set PUPPETEER_SKIP_DOWNLOAD=true [--remote yourappname]
   ```

### Configurar Grover em `config/initializers/grover.rb`:
```ruby
Grover.configure do |config|
  config.options = {
    executable_path: "google-chrome"
  }
end
```

---

## 6. Recursos de Segurança
- Validação de arquivo: Limita o tamanho do arquivo a 5MB, permite apenas PDFs, .eml, JPEG, PNG e TXT
- Sanitização: Remove ataques XSS de entradas de formulário
- Parâmetros fortes
- Tags meta CSRF
- Algoritmo de hash forte para assinaturas de cookie (SHA-256)
- Sem métodos `open-uri`, `Marshal`, `html_safe` ou `raw`
- Omniauth restrito a duas contas Google Enterprise
- Limitação de rotas
- Verificações de segurança automatizadas:
  - `bundler-audit` para dependências
  - `brakeman` para revisão de código
  - `OSWAP dependency check`

---

## 7. Testes
- Use RSpec para testes de controlador
- Crie instâncias de modelo antes de testar
- Use `let` para definir variáveis em testes

---

## 8. Configuração Docker
1. Redefina o ID mais alto do IOC (veja seção Configuração do Banco de Dados)
2. Execute localmente:
   ```sh
   docker-compose build && docker-compose up
   ```
3. Compile e envie para Docker Hub:
   ```sh
   docker build -t yourusername/scam-hitlist:latest .
   docker push yourusername/scam-hitlist:latest
   ```
4. Acesse o console Rails dentro do container:
   ```sh
   docker container ps
   docker exec -it <container ID> bin/rails c
   ```

---

## 9. Implantando na AWS
### Passos:
1. **Implantar no Amazon ECR:**
   - Certifique-se de que o Docker está rodando
   - Marque e envie para o repositório AWS:
     ```sh
     docker tag <name> <aws_repo_name>
     docker push <aws_repo_name>
     ```
2. **Criar Cluster Kubernetes:**
   ```sh
     eksctl create cluster --region your-region --name root --managed
     ```
3. **Criar Banco de Dados RDS:**
   - Use Free Tier com porta `5432`
   - Atribua grupos de segurança para permitir acesso do container
4. **Definir Credenciais do Banco de Dados no Kubernetes:**
   ```sh
     echo -n "<username>" | base64
     echo -n "<password>" | base64
     ```
   - Armazene valores em um arquivo YAML e crie um segredo:
     ```sh
       kubectl create -f secrets.yaml
       ```
5. **Implantar o App no Kubernetes:**
   ```sh
     kubectl create -f deployment.yaml
     kubectl get pods
     ```

### Acessar Console no Kubernetes:
```sh
kubectl exec -it <pod ID> -- /bin/bash
```
Para Alpine:
```sh
kubectl exec -it <pod ID> -- /bin/sh
```

### Migrar e Semear o Banco de Dados:
```sh
bundle exec rake db:migrate
bundle exec rake db:seed
```

---

## Conclusão
Seguindo este guia, você pode configurar, executar e implantar com sucesso seu app Rails de denúncia de golpes no Heroku, Docker e AWS. Isso garante denúncia, rastreamento e gerenciamento eficientes de IOCs com uma infraestrutura escalável e segura.
