---
lang: en
page_id: telegram_ollama_bot
permalink: /posts/telegram-ollama-bot-raspberry-pi
title: Run a Local LLM on Raspberry Pi with a Ruby Telegram Bot
date: 2026-01-31
categories: [Ruby, Telegram, Ollama, Raspberry Pi, LLM]
tags: [Tutorial, Ruby, Telegram, Ollama, Raspberry Pi]
author: Angel
description: How to run a local LLM on a Raspberry Pi and chat with it via a Ruby Telegram bot
image: /assets/img/chatbot.jpg
---

## Run a Local LLM on Raspberry Pi with a Ruby Telegram Bot

This guide walks you through setting up a Raspberry Pi with a local LLM (via Ollama) and a Ruby-based Telegram bot so you can chat with your model from your phone. All processing stays on your Pi.

## Table of contents

- [Preparation](#preparation)
- [Operating system](#operating-system)
- [Remote access](#remote-access)
- [Security](#security)
- [Create your Telegram bot](#step-1-create-your-telegram-bot)
- [Install Ollama](#install-ollama)
- [Install Ruby and the Telegram bot library](#step-2-install-ruby-and-the-telegram-bot-library)
- [Create the Telegram bot script](#step-3-create-the-telegram-bot-script)
- [Get your Telegram user ID](#step-4-get-your-telegram-user-id)
- [Configure the bot](#step-5-configure-the-bot)
- [Make executable and test](#step-6-make-executable-and-test)
- [Ollama and bot on startup](#step-7-and-8-ollama-and-bot-on-startup)
- [Test everything](#step-9-test-everything)
- [Managing the bot](#managing-the-bot)
- [Security features](#security-features)

---

## Preparation

Get your hardware and credentials ready before you start.

### Raspberry Pi & hardware

This guide uses a **Raspberry Pi 4** (4+ GB RAM). It also works on other Debian-based machines (cloud VMs, etc.) using the same commands.

**You need:**

- **Raspberry Pi 4**, 4+ GB RAM
- **Official Raspberry Pi power adapter** (other adapters often cause instability)
- **External storage**: 1+ TB USB3; SSD recommended (we boot from this, not a microSD card)

**Optional:**

- Raspberry Pi case (cooling and protection)
- USB thumb drive or microSD for backups

### Write down your passwords

Use unique, strong passwords (at least 12 characters). Avoid uncommon special characters, spaces, or quotes (`'` or `"`).

- **[ A ]** Master user password (for the Pi user, e.g. `admin`)
- **[ B ]** (Optional) Any other service passwords you plan to use

Store them somewhere safe (e.g. KeePassXC or your existing password manager).

### Secure your home network

Before exposing any device, harden your home network and devices. Follow parts 1 and 2 of a guide like [How to Secure Your Home Network Against Threats](https://www.privacyguides.org/en/advanced/network-overview/) and apply what fits your router and devices.

---

## Step 1: Create your Telegram bot

Do this early so you have the token ready.

1. Open **Telegram** (phone or computer).
2. Search for **@BotFather**.
3. Send **/newbot**.
4. Choose a name (e.g. "My Ollama Bot").
5. Choose a username that ends in `bot` (e.g. `myollama_bot`).
6. **Save the API token** BotFather gives you (e.g. `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`).

You’ll paste this token into the bot script later.

---

## Operating system

We’ll install Raspberry Pi OS (64-bit Lite) and boot from the external drive.

### Which OS to use

Use **Raspberry Pi OS (Legacy) 64-bit Lite** (no desktop). It’s based on Debian 12 Bookworm and works on Pi and other Debian systems.

### Get Raspberry Pi OS

1. Use **Raspberry Pi Imager** (v1.8+).
2. **Choose device** → “No filtering”.
3. **Choose OS** → “Raspberry Pi OS (other)” → **“Raspberry Pi OS (Legacy, 64 bit) Lite”**.
4. **Choose storage** → your external drive (connected to your computer).
5. Click **NEXT**.
6. On **“Use OS customisation”** → **EDIT SETTINGS**.

### Configure before first boot

**General tab:**

- **Hostname**: e.g. `raspibolt` (or any name).
- **Username and password**: enable and set username `admin` and password **[ A ]**.
- **Wi‑Fi** (if used): set SSID, password, and Wi‑Fi country (e.g. US).
- **Locale**: set timezone and keyboard.

**Services tab:**

- **Enable SSH** → “Use password authentication”.

(Optional) In **Options**, disable telemetry if you prefer.

Click **SAVE**, then **YES** on the customisation banner.

### Write OS to the external drive

Confirm you selected the correct drive, then click **YES**. Wait until the imager shows **Success**, then safely eject the drive.

### Start your Pi

1. Connect the external drive to the Pi.
2. If you didn’t set Wi‑Fi, connect Ethernet.
3. Power the Pi with the official USB‑C adapter.

**Booting:** The red LED = power. The green LED should flicker (activity). If the green LED is solid and it doesn’t boot, you may need to enable USB boot once using a microSD and the Imager’s **Misc utility images** → **Bootloader** → **USB Boot**, then remove the microSD and boot again from the external drive.

---

## Remote access

Connect to the Pi over your network.

### Find your Pi

Give the Pi a few minutes to boot and get an IP address.

On your computer, open a terminal and ping the hostname you set (e.g. `raspibolt`):

```bash
ping raspibolt.local
```

Press Ctrl‑C to stop. If that fails, find the Pi’s IP (e.g. via your router or the [Raspberry Pi documentation](https://www.raspberrypi.com/documentation/computers/remote-access.html)).

### Access with SSH

- **Windows:** Use [PuTTY](https://www.putty.org/).
- **macOS / Linux:** In a terminal:

```bash
ssh admin@raspibolt.local
# or
ssh admin@192.168.0.20
```

Use password **[ A ]** when prompted (host: `raspibolt.local` or your Pi IP, port: 22, user: `admin`).

### Command line basics

- Commands are shown after a `$`; system output after `>`.
- **Tab** = autocomplete; **↑ / ↓** = command history.
- Use `sudo` for commands that change system config (e.g. `sudo nano /etc/hostname`).
- **Nano:** Save = Ctrl‑O, Enter; Exit = Ctrl‑X.

---

## Security

Harden the Pi before installing services.

### Login with SSH keys

Use SSH keys instead of passwords for SSH.

**On macOS or Linux (on your computer):**

```bash
ls -la ~/.ssh/*.pub
```

If you have no `.pub` file, create a key:

```bash
ssh-keygen -t rsa -b 4096
```

Copy your public key to the Pi (one-time password **[ A ]**):

```bash
ssh-copy-id admin@raspibolt.local
```

**On Windows:** Use [Configure “No Password SSH Keys Authentication” with PuTTY](https://www.ssh.com/academy/ssh/putty/windows/puttygen) and then add the public key to `~/.ssh/authorized_keys` on the Pi with permissions `700` on `~/.ssh`.

### Disable password login

SSH into the Pi with your key (no password). Then:

```bash
sudo nano /etc/ssh/sshd_config
```

Set:

```text
PasswordAuthentication no
KbdInteractiveAuthentication no
```

Save and exit. Restart SSH and log out:

```bash
sudo systemctl restart sshd
exit
```

Log in again as `admin` with your key. **Back up your SSH keys**; without them you’ll need keyboard and screen attached to the Pi to recover access.

### Enable firewall (UFW)

Only SSH (and later what you choose) should be open:

```bash
sudo apt install ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw logging off
sudo ufw enable
sudo systemctl enable ufw
```

Check: `sudo ufw status`

### fail2ban

Protect SSH from brute force:

```bash
sudo apt install fail2ban
```

Default config protects SSH (e.g. 5 failed attempts → 10‑minute ban).

### Increase open files limit

Useful if you run many connections (e.g. bot + Ollama):

```bash
sudo nano /etc/security/limits.d/90-limits.conf
```

Add:

```text
*    soft nofile 128000
*    hard nofile 128000
root soft nofile 128000
root hard nofile 128000
```

Then add to both files, before the final comment:

```bash
sudo nano /etc/pam.d/common-session
sudo nano /etc/pam.d/common-session-noninteractive
```

Add this line in each:

```text
session required                        pam_limits.so
```

### Disable wireless (optional)

If the Pi is on Ethernet only, you can disable Wi‑Fi and Bluetooth:

```bash
sudo nano /boot/firmware/config.txt
```

Add:

```text
dtoverlay=disable-bt
dtoverlay=disable-wifi
```

Save and exit. Changes apply after reboot.

---

## Install Ollama

On the Pi (over SSH), install Ollama so you can run a local LLM:

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Pull a small model (adjust for your Pi’s RAM; 4 GB is tight, 8 GB is more comfortable):

```bash
ollama pull tinyllama
# Or: ollama pull qwen2.5:0.5b  # or gemma2:2b, llama3.2:3b
```

Check that Ollama is running:

```bash
sudo systemctl status ollama
```

We’ll enable it at boot and use it from the Telegram bot next.

---

## Step 2: Install Ruby and the Telegram bot library

Install Ruby (e.g. with rbenv) and the Telegram gem. Example with rbenv:

```bash
# Install rbenv and ruby-build (if not already)
sudo apt update
sudo apt install -y git curl libssl-dev libreadline-dev zlib1g-dev build-essential
curl -fsSL https://github.com/rbenv/rbenv-installer/raw/HEAD/bin/rbenv-installer | bash
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
source ~/.bashrc

# Install Ruby
rbenv install 3.2.0
rbenv global 3.2.0

# Install the Telegram bot gem
gem install telegram-bot-ruby
```

Use your rbenv Ruby:

```bash
gem install telegram-bot-ruby
```

---

## Step 3: Create the Telegram bot script

Create the bot file:

```bash
nano ~/telegram_ollama_bot.rb
```

Paste this script (replace placeholders in the next steps):

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

Save (Ctrl‑O, Enter) and exit (Ctrl‑X).

---

## Step 4: Get your Telegram user ID

1. Open Telegram and search for **@userinfobot**.
2. Send **/start**.
3. The bot replies with your **user ID** (e.g. `987654321`). Save it.

---

## Step 5: Configure the bot

Edit the configuration at the top of the script:

```bash
nano ~/telegram_ollama_bot.rb
```

Set:

```ruby
TELEGRAM_TOKEN = '1234567890:ABCdefGHIjklMNOpqrsTUVwxyz'  # From BotFather
ALLOWED_USER_IDS = [
  987654321  # Your user ID from @userinfobot
]
MODEL_NAME = 'tinyllama'  # or your preferred model
```

Save and exit.

---

## Step 6: Make executable and test

```bash
chmod +x ~/telegram_ollama_bot.rb
ruby ~/telegram_ollama_bot.rb
```

You should see something like:

```text
🤖 Telegram Ollama Bot Started!
📱 Model: tinyllama
👥 Allowed users: 987654321
📝 Logs: /home/admin/telegram_bot.log

⏳ Connecting to Telegram...
✅ Connected! Waiting for messages...
```

In Telegram, find your bot by username and send **/start**. Stop the bot with Ctrl‑C when done testing.

---

## Step 7 and 8: Ollama and bot on startup

**Ollama** is usually enabled by default. Check:

```bash
sudo systemctl is-enabled ollama
# If "disabled":
sudo systemctl enable ollama
sudo systemctl start ollama
```

**Telegram bot as a systemd service** (replace `admin` with your Pi username if different):

```bash
sudo nano /etc/systemd/system/telegram-ollama-bot.service
```

Paste (adjust paths and `admin` if needed):

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

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable telegram-ollama-bot.service
sudo systemctl start telegram-ollama-bot.service
sudo systemctl status telegram-ollama-bot.service
```

View logs: `sudo journalctl -u telegram-ollama-bot.service -f`

---

## Step 9: Test everything

Reboot the Pi:

```bash
sudo reboot
```

After reboot, SSH back in and check:

```bash
sudo systemctl status ollama
sudo systemctl status telegram-ollama-bot.service
tail -f ~/telegram_bot.log
```

In Telegram:

- Send **/start** to your bot.
- Send **/status** to confirm Ollama.
- Send a question like “What is Ruby?” and wait for the LLM reply.

---

## Managing the bot

| Task | Command |
| ------ | ------ |
| Live logs | `sudo journalctl -u telegram-ollama-bot.service -f` or `tail -f ~/telegram_bot.log` |
| Restart bot | `sudo systemctl restart telegram-ollama-bot.service` |
| Stop bot | `sudo systemctl stop telegram-ollama-bot.service` |
| Ollama status | `sudo systemctl status ollama` |

---

## Security features

- **Whitelist:** Only Telegram user IDs in `ALLOWED_USER_IDS` can use the bot.
- **Local processing:** Messages go to Ollama on your Pi; no third‑party LLM APIs.
- **No storage:** The script doesn’t persist conversations.
- **Logging:** Interactions are logged to `~/telegram_bot.log` for audit.
- **Error handling:** The script recovers from transient failures and restarts under systemd.

---

This setup gives you a local LLM on a Raspberry Pi and a private Telegram interface to it. You can switch models with `ollama pull <model>` and set `MODEL_NAME` in the script to match.
