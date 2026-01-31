---
lang: pt
page_id: camera-app
permalink: /posts/camera-app
title: App de Câmera React
date: 2023-08-02
categories: [Linux, React, JavaScript]
tags: [React, JavaScript, Linux, Netlify]
author: Angel
description: Criando um app de câmera para Linux! Primeira foto :) 👇
image: /assets/img/camapp.png
---

# Como Construí um App de Câmera Online no Linux

## Contexto
Após construir meu próprio computador e instalar Linux, enfrentei um desafio: encontrar um aplicativo confiável para testar minha entrada de câmera e microfone. A maioria das opções disponíveis carecia da simplicidade e flexibilidade que eu precisava. Então, decidi criar meu próprio app de câmera.


🚀 **[Demo ao Vivo Implantado no Netlify](https://videolinux.netlify.app/)**

Código encontrado aqui: [https://github.com/AngelLozan/cameraapp](https://github.com/AngelLozan/cameraapp)

---

## Desenvolvimento e Configuração
Este projeto é uma aplicação baseada em React que aproveita `getUserMedia()` para acessar a câmera. Inclui funcionalidade de gravação de vídeo e pode ser modificado para suportar fotos.

### Executando o Projeto

Certifique-se de ter [Node.js](https://nodejs.org/) instalado. Em seguida, clone o repositório e navegue até o diretório do projeto:

```sh
git clone https://github.com/AngelLozan/cameraApp.git
cd cameraApp
npm install
```

### Scripts Disponíveis

#### `npm start`
Executa o app em modo de desenvolvimento. Abra [https://localhost:3000](https://localhost:3000) no seu navegador.

**Importante:** Para usar a câmera em `localhost`, habilite conexões locais inseguras ajustando flags do navegador:
- Abra configurações Chrome/Brave: `chrome://flags/#allow-insecure-localhost`
- Habilite a flag e reinicie o navegador.

#### `npm test`
Executa testes em modo interativo de observação. Veja a [documentação Create React App](https://facebook.github.io/create-react-app/docs/running-tests) para mais detalhes.

#### `npm run build`
Compila o app para produção, minifica arquivos e otimiza o desempenho. A compilação final está localizada na pasta `build` e está pronta para implantação.

#### `npm run eject`
Remove as configurações padrão do Create React App, permitindo personalização completa. **Aviso:** Esta ação é irreversível.

---

## Configuração e Configuração da Câmera no Linux

### Verificar Resoluções de Vídeo Suportadas
Para determinar resoluções de vídeo suportadas, execute o seguinte comando:
```sh
lsusb -s 001:002 -v | egrep "Width|Height"
```
Isso listará resoluções de câmera disponíveis.

### Habilitar HTTPS para `getUserMedia()`
Navegadores modernos exigem HTTPS para acessar a câmera. Para habilitar HTTPS local:
- **Use um certificado autoassinado:** Siga [este guia](https://web.dev/how-to-use-local-https/) para gerar um certificado usando `mkcert`.
- **Habilite flags no Brave/Chrome:** Siga [este guia](https://stackoverflow.com/questions/7580508/getting-chrome-to-accept-self-signed-localhost-certificate).

### Modificando para Captura de Foto
O app está atualmente configurado para gravação de vídeo, mas o código para capturar fotos existe. Para habilitar modo de foto:
1. Renderize dois botões (um para vídeo e um para fotos).
2. Modifique o método `deletePhoto` para lidar com imagens separadamente.

---

## Conclusão
Este projeto nasceu da necessidade quando não consegui encontrar um app confiável de teste de câmera no Linux. É leve, flexível e pode ser expandido com recursos adicionais como captura de foto, filtros ou streaming em tempo real. Se você está procurando uma maneira simples de testar sua câmera e microfone no Linux, sinta-se à vontade para fazer fork e modificar o projeto!
