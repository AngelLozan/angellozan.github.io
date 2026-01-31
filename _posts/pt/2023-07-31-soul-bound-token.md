---
lang: pt
page_id: sbt
permalink: /posts/sbt
title: Conceito e Implementação de Token Não Fungível Soul Bound
date: 2023-07-31
categories: [Solidity, NFTs, blockchain, EVM, Ethereum, Polygon]
tags: [Solidity, NFTs, blockchain, EVM, Ethereum, Polygon]
author: Angel
description: Criando uma implementação de Soul Bound Token (SBT) para demonstrar um possível caso de uso para usuários de um software de carteira.
image: /assets/img/sbt.png
---

# Como Implantar um NFT Soul Bound no Polygon

Este guia orienta você na configuração, implantação e criação de um Soul Bound Token (SBT) no Polygon, com opção de fazer bridge para Ethereum. Este projeto serve como uma exploração da viabilidade e custos associados à criação de SBTs.

## 1. Visão Geral do Projeto
- **Diretório de Contratos:** Contém o contrato NFT real.
- **Funcionalidade:** Usuários podem reivindicar e queimar NFTs, mas apenas o proprietário do contrato pode criar reivindicações.
- **Blockchain:** Implantado no Polygon, com bridge para Ethereum.
- **API:** Usa Alchemy para interações blockchain.

Código encontrado aqui: [https://github.com/AngelLozan/SBT](https://github.com/AngelLozan/SBT ) 
---

## 2. Pré-requisitos
Antes de prosseguir, certifique-se de ter:
- Node.js instalado
- Hardhat instalado (`npm install --save-dev hardhat`)
- Chave API Alchemy
- Conta Pinata para armazenamento de metadados
- MATIC para taxas de gas (MATIC Testnet para Mumbai)

---

## 3. Passos de Implantação

### Iniciar Blockchain Local
Execute um nó Hardhat local:
```sh
npx hardhat node
```

### Implantar Contrato
Em um terminal separado, implante o contrato na testnet Mumbai:
```sh
npx hardhat run scripts/deploy.js --network matic
```

### Criar NFT
Execute o seguinte comando para criar um NFT:
```sh
node scripts/mint-nft.js
```

---

## 4. Upload de Metadados e Imagem
Para criar NFTs adequadamente, siga estes passos:
1. **Faça upload de imagens para Pinata**
2. **Atribua metadados a cada imagem e faça upload da pasta de metadados para Pinata**

---

## 5. Testes
Execute o conjunto de testes Hardhat:
```sh
npx hardhat test
```
Para gerar um relatório de gas:
```sh
GAS_REPORT=true npx hardhat test
```

---

## 6. Estimando Custos
- Use o **rastreador de taxas Polygon** para estimar custos de implantação e criação.
- Inscreva-se no **Web3 Dog Food** para receber MATIC de teste e experimentar criação e bridge.

---

## 7. Comandos Adicionais do Hardhat
Use os seguintes comandos Hardhat para funcionalidade adicional:
```sh
npx hardhat help
npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```

---

## 8. Próximos Passos
- Complete a **implantação na testnet Mumbai**.
- Implemente o **bridge para Ethereum**.
- Escreva **mais funções para serem chamadas por proprietários**.

Seguindo este repo, você entenderá como implantar e experimentar NFTs Soul Bound no Polygon. Me avise o que você acha. 
