<p>## Telegram Ollama Bot with Rails on a Raspberry Pi

This post will guide you through creating a Telegram bot that uses Ollama for AI processing and runs it on a Raspberry Pi. We'll use Ruby on Rails as the backend framework to handle HTTP requests from Telegram.

### Prerequisites
- **Raspberry Pi**: Any version (preferably running Raspbian).
- **Telegram Bot API Key**: You can create one by registering your bot on <a href="https://t.me/botfather">BotFather</a>.
- **Ollama AI Server**: Download and run the Ollama server on your Raspberry Pi.

### Steps to Build the Bot
1. **Setup Rails Application**:
   bash
gem install rails -v 7.0.4
rails new telegram_ollama_bot --api


2. **Configure Ollama API in Rails**:
   Add the following lines to `config/application.rb` to set up Ollama's URL:
   ruby
config.application.routes.default_scope = :api


3. **Create a Telegram Bot Controller**:
   Generate a new controller for handling bot interactions:
   bash
generates controller Api::V1::TelegramBotController


4. **Implement Bot Logic**:
   In `app/controllers/api/v1/telegram_bot_controller.rb`, add logic to handle incoming Telegram messages.

5. **Run the Application**:
   Start your Rails application and configure it to listen for incoming HTTP requests from Telegram:
   bash
gunicorn -k eventlet -b 0.0.0.0:8080 config.ru --env production


6. **Set Up Ollama on Raspberry Pi**:
   Follow the instructions in the <a href="https://ollama.ai/docs/install">Ollama documentation</a> to download and run it.

### Running the Bot on Raspberry Pi
1. Connect your Raspberry Pi to the internet and ensure it's running Raspbian.
2. Install and configure Ollama as described above.
3. Start the Rails application on your Raspberry Pi.
4. Use <a href="https://t.me/botfather">BotFather</a> to get a new bot token.
5. Set up the bot's webhook with your Raspberry Pi's IP address and port (e.g., `http://your_raspberry_pi_ip:8080/api/v1/telegram_bot`).

### Conclusion
This guide provides a step-by-step process to build a Telegram bot using Ollama for AI processing on a Raspberry Pi. By following these instructions, you'll have a functional chatbot that can perform various tasks and interact with users through the Telegram platform.</p>