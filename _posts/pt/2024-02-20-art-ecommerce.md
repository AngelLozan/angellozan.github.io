---
lang: pt
page_id: ecommerce_app
permalink: /posts/ecommerce_app
title: Plataforma de E-commerce Auto-hospedada para Artistas
date: 2024-02-20
categories: [Rails, Ecommerce, Digital Ocean, Deployment]
tags: [Tutorial, Self-Hosting, Ruby on Rails, Printify, API, Ruby]
author: Angel
description: Uma aplicação de e-commerce auto-hospedada construída com Ruby on Rails para ajudar artistas a venderem seu trabalho sem marketplaces de terceiros.
image: /assets/img/aoj.jpeg
---

# Website e Aplicação de E-commerce

Esta é uma aplicação de e-commerce auto-hospedada projetada para mostrar o trabalho de um artista e eliminar a dependência de plataformas de terceiros para vendas.

🔗 **App ao Vivo:** [The Art of Jaleh](https://theartofjaleh.com/)


Código encontrado aqui: [https://github.com/AngelLozan/aoj](https://github.com/AngelLozan/aoj)

---

## 🎨 Recursos

- **Usuário Admin Único:** Restrito a um usuário para gerenciar conteúdo.
- **Exibição e Vendas de Obras de Arte:** Visitantes podem navegar e comprar arte diretamente.
- **Integração Printify:** Automatiza pedidos de impressão sob demanda.
- **Pagamentos Seguros:** Integrado com PayPal sandbox para testes.
- **Auto-hospedagem no Digital Ocean:** Controle total sobre hospedagem e implantação.

---

## 🔑 Administração de Conta

- Este app é projetado para um **único usuário admin**.
- Credenciais de admin devem ser criadas via **console Rails**.
- O admin pode atualizar seu email e senha dentro da UI.

---

## ⚙️ Configuração e Implantação

### **1️⃣ Implantando no Digital Ocean**

#### **Criar um Droplet**
- Escolha um **App Marketplace Rails** ao configurar seu droplet.
- Faça SSH no droplet:

  ```sh
  ssh root@<droplet-ip>
  ```

- (Opcional) Configure um atalho SSH:

  ```sh
  Host <app-name>
    User root
    HostName <droplet-ip>
    IdentityFile ~/.ssh/<key-name>
  ```

  Agora você pode conectar usando:

  ```sh
  ssh <app-name>
  ```

#### **Atualizar Pacotes**
```sh
sudo apt-get update
```

#### **Modificar Configuração Nginx**
```sh
nano /etc/nginx/sites-available/rails
```
- Altere `root /home/rails/rails_app/public;` para:

  ```
  root /home/<app-name>/public;
  ```

- Atualize o nome do servidor:

  ```
  server_name <your-domain> www.<your-domain>;
  ```

- Adicione ao bloco `location /`:
  ```
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
  ```

#### **Alterar Diretório de Trabalho**
```sh
nano /etc/systemd/system/rails.service
```
- Atualize:

  ```
  WorkingDirectory=/home/<app-name>
  ExecStart= /bin/bash -lc 'bundle exec puma -e production'
  ```

#### **Configuração DNS (Digital Ocean)**
- Adicione **Registros A** para seu domínio:
  ```
  ns1.digitalocean.com
  ns2.digitalocean.com
  ns3.digitalocean.com
  ```

#### **Clonar e Configurar App**
```sh
git clone <repo-url>
sudo chmod 777 -R <app-name>
cd <app-name>
```

#### **Instalar Dependências**
```sh
bundle install
yarn install
```

#### **Configurar Variáveis ENV**
- Instale Figaro:
  ```sh
  bundle exec figaro install
  ```

- Mova valores `.env` para `config/application.yml`:
  ```yml
  EXAMPLE_ENV_VAR: value
  ```

#### **Configuração do Banco de Dados**
```sh
RAILS_ENV=production rails db:create
RAILS_ENV=production rails db:migrate
RAILS_ENV=production rails db:seed
```

#### **Pré-compilar Assets**
```sh
RAILS_ENV=production bundle exec rake assets:precompile
```

#### **Obter Certificado SSL**
```sh
sudo certbot --nginx -d <your-domain> -d www.<your-domain>
```

#### **Reiniciar Serviços**
```sh
sudo systemctl daemon-reload
sudo systemctl restart nginx
sudo systemctl restart rails.service
```

---

## 🔄 Atualizando e Solucionando Problemas

#### **Buscando Código Mais Recente**
```sh
git fetch
git pull
```

#### **Verificando Status do Serviço**
```sh
sudo systemctl status rails.service
sudo systemctl status nginx
```

#### **Visualizando Logs**
```sh
journalctl -u rails.service -b
cd <app-name>
tail -f log/production.log
```

---

## 🛍️ Integração API Printify

Com uma configuração de loja API personalizada, **o Printify não lida com publicação**. Use a API para buscar dados de produtos e criar listagens manualmente.

- Use [API Printify](https://developers.printify.com/#overview) para:
  - Recuperar dados de produtos
  - Definir status de publicação do produto
  - Desbloquear produtos travados

Para suporte: **apiteam[@]printify.com**

---

## 🛠️ Testes

### **Workflows GHA**
- Atualmente desabilitados devido a problemas de conexão Cloudinary.
- Para habilitar, mova workflows de `./test` para `./github/`.

### **Executando Testes**
```sh
rails db:test:purge
rails test
```

### **Testando PayPal Sandbox**
- Use uma data futura para expiração, por exemplo, **10/24**.

---

## 🎨 Obras de Arte

As obras de arte usadas neste projeto consistem em mockups originais fornecidos pelo artista para visualizar o design final do site.

---

## 🚀 Conclusão

Esta aplicação de e-commerce auto-hospedada fornece aos artistas uma **loja online totalmente controlada**, evitando taxas e restrições de terceiros. Com uma **configuração segura e auto-hospedada no Digital Ocean**, esta solução garante uma experiência de compra suave para clientes e capacidades completas de gerenciamento para o artista.

🔗 **App ao Vivo:** [The Art of Jaleh](https://theartofjaleh.com/)
