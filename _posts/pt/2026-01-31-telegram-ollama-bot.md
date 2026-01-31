---
lang: pt
page_id: telegram_ollama_bot
permalink: /posts/telegram-ollama-bot-raspberry-pi
title: Executar um LLM Local no Raspberry Pi com um Bot Telegram em Ruby
date: 2026-01-31
categories: [Ruby, Telegram, Ollama, Raspberry Pi, LLM]
tags: [Tutorial, Ruby, Telegram, Ollama, Raspberry Pi]
author: Angel
description: Como executar um LLM local em um Raspberry Pi e conversar com ele via um bot Telegram em Ruby
image: /assets/img/chatbot.jpg
---

## Executar um LLM Local no Raspberry Pi com um Bot Telegram em Ruby

Este guia orienta você na configuração de um Raspberry Pi com um LLM local (via Ollama) e um bot Telegram baseado em Ruby para que você possa conversar com seu modelo pelo telefone. Todo o processamento permanece no seu Pi.

## Índice

- [Preparação](#preparação)
- [Sistema operacional](#sistema-operacional)
- [Acesso remoto](#acesso-remoto)
- [Segurança](#segurança)
- [Criar seu bot Telegram](#passo-1-criar-seu-bot-telegram)
- [Instalar Ollama](#instalar-ollama)
- [Instalar Ruby e a biblioteca do bot Telegram](#passo-2-instalar-ruby-e-a-biblioteca-do-bot-telegram)
- [Criar o script do bot Telegram](#passo-3-criar-o-script-do-bot-telegram)
- [Obter seu ID de usuário Telegram](#passo-4-obter-seu-id-de-usuário-telegram)
- [Configurar o bot](#passo-5-configurar-o-bot)
- [Tornar executável e testar](#passo-6-tornar-executável-e-testar)
- [Ollama e bot na inicialização](#passo-7-e-8-ollama-e-bot-na-inicialização)
- [Testar tudo](#passo-9-testar-tudo)
- [Gerenciando o bot](#gerenciando-o-bot)
- [Recursos de segurança](#recursos-de-segurança)

---

## Preparação

Prepare seu hardware e credenciais antes de começar.

### Raspberry Pi e hardware

Este guia usa um **Raspberry Pi 4** (4+ GB de RAM). Também funciona em outras máquinas baseadas em Debian (VMs na nuvem, etc.) usando os mesmos comandos.

**Você precisa:**

- **Raspberry Pi 4**, 4+ GB de RAM
- **Adaptador de energia oficial do Raspberry Pi** (outros adaptadores frequentemente causam instabilidade)
- **Armazenamento externo**: 1+ TB USB3; SSD recomendado (iniciamos a partir disso, não de um cartão microSD)

**Opcional:**

- Case do Raspberry Pi (refrigeração e proteção)
- Pendrive USB ou microSD para backups

### Anotar suas senhas

Use senhas únicas e fortes (pelo menos 12 caracteres). Evite caracteres especiais incomuns, espaços ou aspas (`'` ou `"`).

- **[ A ]** Senha mestra do usuário (para o usuário do Pi, por exemplo `admin`)
- **[ B ]** (Opcional) Qualquer outra senha de serviço que você planeja usar

Armazene-as em algum lugar seguro (por exemplo, KeePassXC ou seu gerenciador de senhas existente).

### Proteger sua rede doméstica

Antes de expor qualquer dispositivo, proteja sua rede doméstica e dispositivos. Siga as partes 1 e 2 de um guia como [Como Proteger Sua Rede Doméstica Contra Ameaças](https://www.privacyguides.org/en/advanced/network-overview/) e aplique o que se adequa ao seu roteador e dispositivos.

---

## Passo 1: Criar seu bot Telegram

Faça isso cedo para ter o token pronto.

1. Abra **Telegram** (telefone ou computador).
2. Procure por **@BotFather**.
3. Envie **/newbot**.
4. Escolha um nome (por exemplo, "Meu Bot Ollama").
5. Escolha um nome de usuário que termine em `bot` (por exemplo, `meuollama_bot`).
6. **Salve o token da API** que o BotFather fornece (por exemplo, `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`).

Você colará este token no script do bot mais tarde.

---

## Sistema operacional

Vamos instalar o Raspberry Pi OS (64-bit Lite) e iniciar a partir do disco externo.

### Qual SO usar

Use **Raspberry Pi OS (Legacy) 64-bit Lite** (sem desktop). É baseado no Debian 12 Bookworm e funciona no Pi e em outros sistemas Debian.

### Obter Raspberry Pi OS

1. Use **Raspberry Pi Imager** (v1.8+).
2. **Escolher dispositivo** → "Sem filtro".
3. **Escolher SO** → "Raspberry Pi OS (outro)" → **"Raspberry Pi OS (Legacy, 64 bit) Lite"**.
4. **Escolher armazenamento** → seu disco externo (conectado ao seu computador).
5. Clique em **PRÓXIMO**.
6. Em **"Usar personalização do SO"** → **EDITAR CONFIGURAÇÕES**.

### Configurar antes da primeira inicialização

**Aba Geral:**

- **Hostname**: por exemplo, `raspibolt` (ou qualquer nome).
- **Nome de usuário e senha**: ative e defina o nome de usuário `admin` e senha **[ A ]**.
- **Wi‑Fi** (se usado): defina SSID, senha e país Wi‑Fi (por exemplo, BR).
- **Localidade**: defina fuso horário e teclado.

**Aba Serviços:**

- **Habilitar SSH** → "Usar autenticação por senha".

(Opcional) Em **Opções**, desative a telemetria se preferir.

Clique em **SALVAR**, depois **SIM** no banner de personalização.

### Escrever SO no disco externo

Confirme que selecionou o disco correto, depois clique em **SIM**. Aguarde até o imager mostrar **Sucesso**, depois ejetar o disco com segurança.

### Iniciar seu Pi

1. Conecte o disco externo ao Pi.
2. Se você não configurou o Wi‑Fi, conecte o Ethernet.
3. Alimente o Pi com o adaptador USB‑C oficial.

**Inicialização:** O LED vermelho = energia. O LED verde deve piscar (atividade). Se o LED verde estiver constante e não inicializar, você pode precisar habilitar a inicialização USB uma vez usando um microSD e **Imagens de utilitários diversos** do Imager → **Bootloader** → **USB Boot**, depois remova o microSD e inicie novamente a partir do disco externo.

---

## Acesso remoto

Conecte-se ao Pi pela sua rede.

### Encontrar seu Pi

Dê alguns minutos para o Pi inicializar e obter um endereço IP.

No seu computador, abra um terminal e faça ping no hostname que você definiu (por exemplo, `raspibolt`):

```bash
ping raspibolt.local
```

Pressione Ctrl‑C para parar. Se isso falhar, encontre o IP do Pi (por exemplo, via seu roteador ou a [documentação do Raspberry Pi](https://www.raspberrypi.com/documentation/computers/remote-access.html)).

### Acessar com SSH

- **Windows:** Use [PuTTY](https://www.putty.org/).
- **macOS / Linux:** Em um terminal:

```bash
ssh admin@raspibolt.local
# ou
ssh admin@192.168.0.20
```

Use a senha **[ A ]** quando solicitado (host: `raspibolt.local` ou seu IP do Pi, porta: 22, usuário: `admin`).

### Noções básicas da linha de comando

- Comandos são mostrados após um `$`; saída do sistema após `>`.
- **Tab** = autocompletar; **↑ / ↓** = histórico de comandos.
- Use `sudo` para comandos que alteram a configuração do sistema (por exemplo, `sudo nano /etc/hostname`).
- **Nano:** Salvar = Ctrl‑O, Enter; Sair = Ctrl‑X.

---

## Segurança

Proteja o Pi antes de instalar serviços.

### Login com chaves SSH

Use chaves SSH em vez de senhas para SSH.

**No macOS ou Linux (no seu computador):**

```bash
ls -la ~/.ssh/*.pub
```

Se você não tiver um arquivo `.pub`, crie uma chave:

```bash
ssh-keygen -t rsa -b 4096
```

Copie sua chave pública para o Pi (senha única **[ A ]**):

```bash
ssh-copy-id admin@raspibolt.local
```

**No Windows:** Use [Configurar "Autenticação de Chaves SSH Sem Senha" com PuTTY](https://www.ssh.com/academy/ssh/putty/windows/puttygen) e depois adicione a chave pública a `~/.ssh/authorized_keys` no Pi com permissões `700` em `~/.ssh`.

### Desabilitar login por senha

Faça SSH no Pi com sua chave (sem senha). Depois:

```bash
sudo nano /etc/ssh/sshd_config
```

Defina:

```text
PasswordAuthentication no
KbdInteractiveAuthentication no
```

Salve e saia. Reinicie o SSH e saia:

```bash
sudo systemctl restart sshd
exit
```

Faça login novamente como `admin` com sua chave. **Faça backup das suas chaves SSH**; sem elas você precisará de teclado e tela conectados ao Pi para recuperar o acesso.

### Habilitar firewall (UFW)

Apenas SSH (e depois o que você escolher) deve estar aberto:

```bash
sudo apt install ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw logging off
sudo ufw enable
sudo systemctl enable ufw
```

Verifique: `sudo ufw status`

### fail2ban

Proteja o SSH contra força bruta:

```bash
sudo apt install fail2ban
```

A configuração padrão protege o SSH (por exemplo, 5 tentativas falhadas → banimento de 10 minutos).

### Aumentar limite de arquivos abertos

Útil se você executar muitas conexões (por exemplo, bot + Ollama):

```bash
sudo nano /etc/security/limits.d/90-limits.conf
```

Adicione:

```text
*    soft nofile 128000
*    hard nofile 128000
root soft nofile 128000
root hard nofile 128000
```

Depois adicione aos dois arquivos, antes do comentário final:

```bash
sudo nano /etc/pam.d/common-session
sudo nano /etc/pam.d/common-session-noninteractive
```

Adicione esta linha em cada um:

```text
session required                        pam_limits.so
```

### Desabilitar wireless (opcional)

Se o Pi estiver apenas em Ethernet, você pode desabilitar Wi‑Fi e Bluetooth:

```bash
sudo nano /boot/firmware/config.txt
```

Adicione:

```text
dtoverlay=disable-bt
dtoverlay=disable-wifi
```

Salve e saia. As alterações se aplicam após a reinicialização.

---

## Instalar Ollama

No Pi (via SSH), instale o Ollama para executar um LLM local:

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Baixe um modelo pequeno (ajuste para a RAM do seu Pi; 4 GB é apertado, 8 GB é mais confortável):

```bash
ollama pull tinyllama
# Ou: ollama pull qwen2.5:0.5b  # ou gemma2:2b, llama3.2:3b
```

Verifique se o Ollama está rodando:

```bash
sudo systemctl status ollama
```

Vamos habilitá-lo na inicialização e usá-lo do bot Telegram em seguida.

---

## Passo 2: Instalar Ruby e a biblioteca do bot Telegram

Instale Ruby (por exemplo, com rbenv) e a gem do Telegram. Exemplo com rbenv:

```bash
# Instalar rbenv e ruby-build (se ainda não estiver)
sudo apt update
sudo apt install -y git curl libssl-dev libreadline-dev zlib1g-dev build-essential
curl -fsSL https://github.com/rbenv/rbenv-installer/raw/HEAD/bin/rbenv-installer | bash
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
source ~/.bashrc

# Instalar Ruby
rbenv install 3.2.0
rbenv global 3.2.0

# Instalar a gem do bot Telegram
gem install telegram-bot-ruby
```

Use seu Ruby rbenv:

```bash
gem install telegram-bot-ruby
```

---

## Passo 3: Criar o script do bot Telegram

Crie o arquivo do bot:

```bash
nano ~/telegram_ollama_bot.rb
```

Cole este script (substitua os placeholders nos próximos passos):

```ruby
#!/usr/bin/env ruby

require 'telegram/bot'
require 'net/http'
require 'json'
require 'uri'
require 'logger'

# Configuration
TELEGRAM_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN'  # Get from BotFather
ALLOWED_USER_IDS = [
  123456789  # Your Telegram user ID (get from @userinfobot)
]
MODEL_NAME = 'tinyllama'  # or qwen2.5:0.5b, gemma2:2b, llama3.2:3b
OLLAMA_URL = 'http://localhost:11434/api/chat'
LOG_FILE = File.expand_path('~/telegram_bot.log')

# Set up logging
logger = Logger.new(LOG_FILE)
logger.level = Logger::INFO

def chat_with_ollama(message, logger)
  uri = URI.parse(OLLAMA_URL)

  request = Net::HTTP::Post.new(uri)
  request.content_type = 'application/json'
  request.body = {
    model: MODEL_NAME,
    messages: [
      {
        role: 'user',
        content: message
      }
    ],
    stream: false
  }.to_json

  response = Net::HTTP.start(uri.hostname, uri.port, read_timeout: 120) do |http|
    http.request(request)
  end

  if response.code == '200'
    result = JSON.parse(response.body)
    result['message']['content']
  else
    logger.error("Ollama error: #{response.code} - #{response.body}")
    "Sorry, I encountered an error processing your request."
  end
rescue Errno::ECONNREFUSED
  logger.error("Cannot connect to Ollama - is it running?")
  "❌ Cannot connect to Ollama. Is it running?\nCheck: sudo systemctl status ollama"
rescue Timeout::Error
  logger.error("Ollama request timed out")
  "⏱️ Request timed out. The model might be too slow or busy."
rescue => e
  logger.error("Error calling Ollama: #{e.message}")
  logger.error(e.backtrace.join("\n"))
  "Sorry, I encountered an unexpected error: #{e.message}"
end

def is_allowed?(user_id, allowed_ids)
  allowed_ids.include?(user_id)
end

def send_long_message(bot, chat_id, text)
  max_length = 4000

  if text.length > max_length
    chunks = text.scan(/.{1,#{max_length}}/m)
    chunks.each do |chunk|
      bot.api.send_message(chat_id: chat_id, text: chunk)
      sleep 0.5
    end
  else
    bot.api.send_message(chat_id: chat_id, text: text)
  end
end

def run_bot(token, allowed_user_ids, logger)
  logger.info("Starting Telegram bot with Ollama")
  logger.info("Model: #{MODEL_NAME}")
  logger.info("Allowed user IDs: #{allowed_user_ids.join(', ')}")

  puts "🤖 Telegram Ollama Bot Started!"
  puts "📱 Model: #{MODEL_NAME}"
  puts "👥 Allowed users: #{allowed_user_ids.join(', ')}"
  puts "📝 Logs: #{LOG_FILE}"
  puts "\n⏳ Connecting to Telegram..."

  Telegram::Bot::Client.run(token) do |bot|
    puts "✅ Connected! Waiting for messages...\n"

    bot.listen do |message|
      begin
        case message
        when Telegram::Bot::Types::Message
          user_id = message.from.id
          username = message.from.username || message.from.first_name
          chat_id = message.chat.id
          text = message.text

          unless is_allowed?(user_id, allowed_user_ids)
            logger.warn("Rejected message from unauthorized user: #{user_id} (@#{username})")
            bot.api.send_message(
              chat_id: chat_id,
              text: "⛔ Unauthorized. Your user ID: #{user_id}"
            )
            next
          end

          next unless text

          case text
          when '/start'
            welcome_msg = "👋 Hello! I'm your personal Ollama bot.\n\n" \
                         "🤖 Current model: #{MODEL_NAME}\n" \
                         "💬 Just send me any message and I'll respond!\n\n" \
                         "Commands:\n" \
                         "/start - Show this message\n" \
                         "/status - Check Ollama status\n" \
                         "/models - List available models\n" \
                         "/help - Show help"
            bot.api.send_message(chat_id: chat_id, text: welcome_msg)
            logger.info("Sent welcome message to #{username} (#{user_id})")

          when '/status'
            begin
              uri = URI.parse('http://localhost:11434/api/tags')
              response = Net::HTTP.get_response(uri)
              if response.code == '200'
                status_msg = "✅ Ollama is running\n🤖 Current model: #{MODEL_NAME}"
              else
                status_msg = "⚠️ Ollama responded but with error: #{response.code}"
              end
            rescue Errno::ECONNREFUSED
              status_msg = "❌ Ollama is not running\nStart it: sudo systemctl start ollama"
            end
            bot.api.send_message(chat_id: chat_id, text: status_msg)

          when '/models'
            begin
              uri = URI.parse('http://localhost:11434/api/tags')
              response = Net::HTTP.get(uri)
              data = JSON.parse(response)
              models = data['models'].map { |m| "• #{m['name']}" }.join("\n")
              models_msg = "📦 Available models:\n\n#{models}\n\n🎯 Currently using: #{MODEL_NAME}"
            rescue => e
              models_msg = "❌ Error fetching models: #{e.message}"
            end
            bot.api.send_message(chat_id: chat_id, text: models_msg)

          when '/help'
            help_msg = "🆘 Help\n\n" \
                      "Just send me any question or message!\n\n" \
                      "Examples:\n" \
                      "• What is Ruby?\n" \
                      "• Write a haiku about programming\n" \
                      "• Explain quantum physics simply\n\n" \
                      "Commands:\n" \
                      "/start - Welcome message\n" \
                      "/status - Check Ollama status\n" \
                      "/models - List models\n" \
                      "/help - This message"
            bot.api.send_message(chat_id: chat_id, text: help_msg)

          else
            logger.info("Message from #{username} (#{user_id}): #{text}")
            puts "[#{Time.now}] 📨 #{username}: #{text}"

            bot.api.send_chat_action(chat_id: chat_id, action: 'typing')
            reply = chat_with_ollama(text, logger)
            send_long_message(bot, chat_id, reply)

            truncated = reply.length > 100 ? "#{reply[0..100]}..." : reply
            logger.info("Replied to #{username}: #{truncated}")
            puts "[#{Time.now}] 💬 Replied: #{truncated}\n"
          end

        end
      rescue => e
        logger.error("Error processing message: #{e.message}")
        logger.error(e.backtrace.join("\n"))
        puts "❌ Error: #{e.message}"
        begin
          bot.api.send_message(
            chat_id: message.chat.id,
            text: "❌ An error occurred. Check the logs."
          ) if message
        rescue
        end
      end
    end
  end
rescue Interrupt
  logger.info("Bot shutting down gracefully")
  puts "\n👋 Shutting down bot gracefully..."
  exit 0
rescue => e
  logger.fatal("Fatal error: #{e.message}")
  logger.fatal(e.backtrace.join("\n"))
  puts "💀 Fatal error: #{e.message}"
  sleep 5
  retry
end

# Main execution
if __FILE__ == $0
  if TELEGRAM_TOKEN == 'YOUR_TELEGRAM_BOT_TOKEN'
    puts "❌ ERROR: Please edit the script and set TELEGRAM_TOKEN"
    puts "Get it from @BotFather on Telegram"
    exit 1
  end

  if ALLOWED_USER_IDS.include?(123456789)
    puts "❌ ERROR: Please edit the script and set your Telegram user ID"
    puts "Get your user ID from @userinfobot on Telegram"
    exit 1
  end

  begin
    uri = URI.parse('http://localhost:11434/api/tags')
    Net::HTTP.get_response(uri)
    puts "✅ Ollama is running"
  rescue Errno::ECONNREFUSED
    puts "⚠️  WARNING: Ollama is not running"
    puts "Start it with: sudo systemctl start ollama"
    puts "\nContinuing anyway (bot will show errors to users)..."
  end

  run_bot(TELEGRAM_TOKEN, ALLOWED_USER_IDS, Logger.new(LOG_FILE))
end
```

Salve (Ctrl‑O, Enter) e saia (Ctrl‑X).

---

## Passo 4: Obter seu ID de usuário Telegram

1. Abra o Telegram e procure por **@userinfobot**.
2. Envie **/start**.
3. O bot responde com seu **ID de usuário** (por exemplo, `987654321`). Salve-o.

---

## Passo 5: Configurar o bot

Edite a configuração no topo do script:

```bash
nano ~/telegram_ollama_bot.rb
```

Defina:

```ruby
TELEGRAM_TOKEN = '1234567890:ABCdefGHIjklMNOpqrsTUVwxyz'  # Do BotFather
ALLOWED_USER_IDS = [
  987654321  # Seu ID de usuário do @userinfobot
]
MODEL_NAME = 'tinyllama'  # ou seu modelo preferido
```

Salve e saia.

---

## Passo 6: Tornar executável e testar

```bash
chmod +x ~/telegram_ollama_bot.rb
ruby ~/telegram_ollama_bot.rb
```

Você deve ver algo como:

```text
🤖 Telegram Ollama Bot Started!
📱 Model: tinyllama
👥 Allowed users: 987654321
📝 Logs: /home/admin/telegram_bot.log

⏳ Connecting to Telegram...
✅ Connected! Waiting for messages...
```

No Telegram, encontre seu bot pelo nome de usuário e envie **/start**. Pare o bot com Ctrl‑C quando terminar o teste.

---

## Passo 7 e 8: Ollama e bot na inicialização

**Ollama** geralmente está habilitado por padrão. Verifique:

```bash
sudo systemctl is-enabled ollama
# Se "disabled":
sudo systemctl enable ollama
sudo systemctl start ollama
```

**Bot Telegram como serviço systemd** (substitua `admin` pelo seu nome de usuário do Pi se diferente):

```bash
sudo nano /etc/systemd/system/telegram-ollama-bot.service
```

Cole (ajuste os caminhos e `admin` se necessário):

```ini
[Unit]
Description=Telegram Ollama Bot
After=network.target ollama.service
Wants=ollama.service

[Service]
Type=simple
User=admin
WorkingDirectory=/home/admin
ExecStart=/home/admin/.rbenv/shims/ruby /home/admin/telegram_ollama_bot.rb
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

Environment="PATH=/home/admin/.rbenv/shims:/home/admin/.rbenv/bin:/usr/local/bin:/usr/bin:/bin"
Environment="RBENV_ROOT=/home/admin/.rbenv"

[Install]
WantedBy=multi-user.target
```

Habilite e inicie:

```bash
sudo systemctl daemon-reload
sudo systemctl enable telegram-ollama-bot.service
sudo systemctl start telegram-ollama-bot.service
sudo systemctl status telegram-ollama-bot.service
```

Ver logs: `sudo journalctl -u telegram-ollama-bot.service -f`

---

## Passo 9: Testar tudo

Reinicie o Pi:

```bash
sudo reboot
```

Após a reinicialização, faça SSH novamente e verifique:

```bash
sudo systemctl status ollama
sudo systemctl status telegram-ollama-bot.service
tail -f ~/telegram_bot.log
```

No Telegram:

- Envie **/start** para seu bot.
- Envie **/status** para confirmar o Ollama.
- Envie uma pergunta como "O que é Ruby?" e aguarde a resposta do LLM.

---

## Gerenciando o bot

| Tarefa | Comando |
| ------ | ------ |
| Logs ao vivo | `sudo journalctl -u telegram-ollama-bot.service -f` ou `tail -f ~/telegram_bot.log` |
| Reiniciar bot | `sudo systemctl restart telegram-ollama-bot.service` |
| Parar bot | `sudo systemctl stop telegram-ollama-bot.service` |
| Status Ollama | `sudo systemctl status ollama` |

---

## Recursos de segurança

- **Lista branca:** Apenas IDs de usuário Telegram em `ALLOWED_USER_IDS` podem usar o bot.
- **Processamento local:** Mensagens vão para o Ollama no seu Pi; sem APIs de LLM de terceiros.
- **Sem armazenamento:** O script não persiste conversas.
- **Registro:** Interações são registradas em `~/telegram_bot.log` para auditoria.
- **Tratamento de erros:** O script se recupera de falhas transitórias e reinicia sob systemd.

---

Esta configuração oferece um LLM local em um Raspberry Pi e uma interface Telegram privada para ele. Você pode trocar modelos com `ollama pull <model>` e definir `MODEL_NAME` no script para corresponder.
