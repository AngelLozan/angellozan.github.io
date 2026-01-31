---
lang: pt
page_id: chrome extension
permalink: /posts/chrome-extension
title: Extensão Exploradora de Blockchain de Criptomoedas
date: 2023-02-18
categories: [crypto, chrome, extension, JavaScript, blockchain]
tags: [crypto, chrome, extension, JavaScript, blockchain]
author: Angel
description: Criando uma extensão Chrome com um toque crypto. Esta extensão foi criada para auxiliar usuários a explorar rapidamente transações e moedas através da agregação de recursos diversos.
image: /assets/img/Chromeext.jpeg
---

# CSE Hackathon Support Explorer

O primeiro hackathon do departamento de Suporte ao Cliente (CS), e o primeiro projeto de hackathon do departamento CS que envolve código. Este projeto mostra o departamento multitalentoso que é uma das importantes equipes voltadas ao cliente aqui na Exodus. Embora esta ferramenta seja interna, permite à equipe, como a liderança mencionou, `entregar valor aos nossos clientes mais rapidamente`.

Este projeto cria uma ferramenta interna: uma extensão exploradora de blocos projetada para atender às necessidades de uma equipe de mais de 100 pessoas e reduzir a latência de suporte. Pesquise uma transação ou endereço, e a ferramenta corresponderá esse endereço/TX com a cadeia correta entre 61 cadeias para pesquisar endereços e 31 cadeias para pesquisar transações. Mais podem/serão adicionadas.

Código encontrado aqui: [https://github.com/AngelLozan/support-explorer-scott](https://github.com/AngelLozan/support-explorer-scott)

## Instalação

Execute `npm install` ao clonar para o diretório local desejado.

Compile com `npm run build`.

*Com a versão atual, por favor não execute um audit force fix. Isso exige permissões diferentes para serem definidas a fim de cumprir o CSP.*

(Após compilar) Abra `chrome://extensions` ou `brave://extensions` e carregue a extensão não empacotada.

## Atualizando Array de Endereços Maliciosos

- Utilize esta planilha para obter novos endereços: [Google Spreadsheet](https://docs.google.com/spreadsheets/d/1aAAPyrZgfJcWelhLr3RgGU5qS5Epwa2HhBbGNXrfh74/edit#gid=0)
- Atualize o componente `checkMalicious.js` em `src` > `components` e atualize o dicionário encontrado lá.
- Atualize o array `maliciousArray` do `SourceInput.js` com o mesmo endereço, sem detalhes.

## Caso de Uso

Veja esta seção do Coda para referência: [Referência Coda](https://coda.io/d/Customer-Support-Hackathon_deARNEw7ms9/Browser-Extension-Support-Tool_suYtf#_luH-i)

## Recursos

### Explorador de Endereços e Transações

Abrindo a UI da extensão com Cmd+J (Ctrl+J no Windows), os CSEs podem pesquisar rapidamente endereços em 61 blockchains e transações em 31.

Se um endereço/transação válido foi inserido, uma nova aba será aberta com o explorador de blocos correto e informações de endereço/transação.

### Kit de Ferramentas KB

Injetado na barra lateral do editor de documentos Help Scout Docs, o Kit de Ferramentas KB faz scraping de documentos em busca de erros e fornece links de injeção rápida de elementos para membros da equipe.

Atualmente, membros da equipe KB precisam escrever HTML manualmente ou copiar-colar de outra fonte, arriscando erros de sintaxe e perda de tempo valioso em tarefas repetitivas.

Este kit oferece uma solução de 1 clique para injetar 26 dos elementos HTML mais comumente usados e limpar o documento de código HTML indesejado como `&nbsps` e classes não utilizadas.

### Help Scout SOS v2

Uma versão nova e melhorada da extensão Help Scout SOS.

Pode ser configurada na página de opções do Support Explorer e agora exibe uma contagem de tickets Pendentes da Caixa de Entrada Não Atribuídos abaixo do ícone da extensão.

## Autores

- Jamie M.
- Scott L.

## Cadeias e Ativos Pesquisáveis

### Ativos Pesquisáveis:
Todos suportados no Coinranking.

### Endereço EVM (DeBank) - 37 Cadeias

- Ethereum
- BNB Smart Chain
- Polygon
- Gnosis
- Fantom
- OKC
- HECO
- Avalanche
- Arbitrum
- Optimism
- Celo
- Moonriver
- Cronos
- Boba
- Metis
- BTTC
- Aurora
- Moonbeam
- smartBCH
- Harmony
- Fuse
- Astar
- Palm
- Shiden
- Klaytn
- RSK
- IoTeX
- KCC
- Wanchain
- Songbird
- Evmos
- DFK
- Telos
- Swimmer
- Arbitrum Nova
- Canto
- Dogechain

### Transações EVM (Blockscan) - 12 Cadeias

- Ethereum
- Beacon Chain
- BNB Smart Chain
- Fantom
- Optimism
- Polygon
- Arbitrum
- Moonbeam
- Moonriver
- Avalanche
- Cronos
- BTTC

### Endereços e Transações Layer 1 (Blockchair) - 17 Cadeias

- Bitcoin
- Litecoin
- Cardano
- XRP
- Polkadot
- Dogecoin
- Bitcoin Cash
- Stellar
- Monero
- EOS
- Kusama
- Bitcoin SV
- eCash
- Zcash
- Dash
- Mixin
- Groestlcoin

### Outras L1s Identificadas Através de Regex ou Interface Direta com Blockchain

**Endereços:**
- Algo
- Tezos
- Solana
- Tron
- Hedera
- Atom
- BNB Beacon

**Transações:**
- Algo
- Tezos
- Solana
- Tron
- Hedera
- Atom
- BNB Beacon

### Total em Execução

**Endereços:**
- 37 @ DeBank (EVMs)
- 17 @ Blockchair
- 7 Individuais
- **Total: 61**

**Transações:**
- 12 @ Blockscan (EVMs)
- 17 @ Blockchair
- 7 Individuais
- **Total: 36**
