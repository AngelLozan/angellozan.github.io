---
lang: pt
page_id: self_host_pds
permalink: /posts/self_host_pds
title: Auto-hospedando um Servidor de Dados Pessoais (PDS) para BlueSky
date: 2025-03-13
categories: [Docker, Digital Ocean, BlueSky, PDS]
tags: [Tutorial, Self-Hosting, Docker, MacOS]
author: Angel
description: Auto-hospede um Servidor de Dados Pessoais (PDS) para sua Conta BlueSky
image: /assets/img/pds.jpeg
---

# Auto-hospedando um PDS Bluesky

Auto-hospedar um Servidor de Dados Pessoais (PDS) Bluesky permite executar sua própria instância que se federa com a rede ATProto mais ampla. Este guia cobre a configuração de um PDS em um droplet do Digital Ocean, configuração de DNS e manutenção do seu servidor.

## Índice
- [Preparação para Auto-hospedagem PDS](#preparação-para-auto-hospedagem-pds)
- [Abrindo Firewall na Nuvem para HTTP e HTTPS](#abrindo-firewall-na-nuvem-para-http-e-https)
- [Configurando DNS no Name.com](#configurando-dns-no-namecom)
- [Verificando DNS](#verificando-dns)
- [Instalando PDS no Ubuntu/Debian](#instalando-pds-no-ubuntudebian)
- [Verificando Status do PDS](#verificando-status-do-pds)
- [Criando uma Conta](#criando-uma-conta)
- [Usando o App Bluesky](#usando-o-app-bluesky)
- [Atualizando PDS](#atualizando-pds)
- [Configurando um Cron Job para Atualizações](#configurando-um-cron-job-para-atualizações)
- [Obtendo Ajuda](#obtendo-ajuda)

## Preparação para Auto-hospedagem PDS
Inicie um servidor em um provedor de nuvem como Digital Ocean ou Vultr. Certifique-se de ter acesso SSH e privilégios root.

### Requisitos do Servidor
- **Endereço IPv4 público**
- **Nome DNS público**
- **Acesso de entrada nas portas 80/tcp e 443/tcp**

### Especificações Recomendadas
| Sistema Operacional | Ubuntu 22.04 |
|-----------------|-------------|
| RAM            | 1 GB       |
| Núcleos CPU      | 1         |
| Armazenamento        | 20 GB SSD  |

Restrinja SSH (porta 22) ao seu IP usando `ifconfig.me` para encontrá-lo.

## Abrindo Firewall na Nuvem para HTTP e HTTPS
Certifique-se de que as seguintes portas estão abertas:
- **80/tcp** (Usado para verificação TLS)
- **443/tcp** (Usado para solicitações do app)

## Configurando DNS no Name.com
1. Faça login na sua conta [Name.com](https://www.name.com/).
2. Navegue até **Registros DNS**.
3. Adicione estes registros, substituindo `example.com` e `12.34.56.78` pelo seu domínio e IP:
   
   | Nome           | Tipo | Valor        | TTL  |
   |--------------|------|-------------|------|
   | example.com  | A    | 12.34.56.78 | 600  |
   | *.example.com | A    | 12.34.56.78 | 600  |

## Verificando DNS
Use [DNS Checker](https://www.whatsmydns.net/) para confirmar propagação. Execute:
```sh
dig A example.com
```
Saída esperada: IP do seu servidor.

## Instalando PDS no Ubuntu/Debian
Faça SSH no seu servidor e execute:
```sh
wget https://raw.githubusercontent.com/bluesky-social/pds/main/installer.sh
sudo bash installer.sh
```

## Verificando Status do PDS
Verifique se seu PDS está online:
```sh
curl https://example.com/xrpc/_health
```
Resposta esperada:
```json
{"version":"0.2.2-beta.2"}
```
Teste conectividade WebSocket:
```sh
wsdump "wss://example.com/xrpc/com.atproto.sync.subscribeRepos?cursor=0"
```

## Criando uma Conta
### Usando `pdsadmin`
```sh
sudo pdsadmin account create
```

### Usando um Código de Convite
```sh
sudo pdsadmin create-invite-code
```
Use este código ao se registrar via app Bluesky.

## Usando o App Bluesky
1. Baixe o app para [Web](https://bsky.app), [iPhone](https://apps.apple.com) ou [Android](https://play.google.com/store).
2. Insira sua URL PDS (por exemplo, `https://example.com/`).

## Atualizando PDS
Mantenha seu PDS atualizado:
```sh
sudo pdsadmin update
```

## Configurando um Cron Job para Atualizações
Para automatizar atualizações, edite os cron jobs:
```sh
crontab -e
```
Adicione a seguinte linha para executar atualizações às **1:30 da manhã no dia 1 e 15 de cada mês**:
```sh
30 1 1,15 * * psadmin update
```

## Obtendo Ajuda
Para solução de problemas:
```sh
docker logs caddy --tail=50 --follow
```
Verifique se o serviço está rodando:
```sh
curl https://example.com/xrpc/_health
```
Se os problemas persistirem, reinicie o serviço:
```sh
systemctl restart pds.service
```

Este guia garante um PDS Bluesky auto-hospedado confiável. Boa hospedagem!
