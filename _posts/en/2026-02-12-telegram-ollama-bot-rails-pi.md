# Telegram Ollama Bot for Rails on Raspberry Pi

In this article, we will explore how to build and deploy a Telegram-based language model bot using the OpenAI API and Ruby on Rails running on a Raspberry Pi. This setup is ideal for small-scale projects or personal use cases.

## Prerequisites
- Raspberry Pi with a compatible OS (e.g., Raspbian)
- Internet connection
- Basic knowledge of Ruby on Rails and Git

## Setting Up the Environment
1. **Install Required Software**:
   bash
   sudo apt update
   sudo apt install -y git ruby-full build-essential libpq-dev nodejs npm
   

2. **Clone the Repository**:
   bash
   git clone https://github.com/scottech-software/angellozan.github.io.git
   cd angellozan.github.io
   

## Creating the Bot
1. **Initialize a new Rails application**:
   bash
   rails new telegram_ollama_bot
   cd telegram_ollama_bot
   

2. **Install necessary gems**:
   Add the following gems to your Gemfile and run `bundle install`:
   ruby
   gem 'telegram-bot-ruby', '~> 6.0'
   gem 'dotenv-rails', '~> 5.0'
   

3. **Set up environment variables**:
   Create a `.env` file in the root of your project and add the following lines to configure your bot token and OpenAI API key:
   plaintext
   TELEGRAM_BOT_TOKEN=your_bot_token
   OPENAI_API_KEY=your_openai_api_key
   

## Configuring the Bot
1. **Create a new file** named `config/telegram_bot.rb` and add the following code to configure your bot:
   ruby
   require 'dotenv'
   load_dotenv

   Telegram::Bot.configure do |config|
     config.token = ENV['TELEGRAM_BOT_TOKEN']
   end
   

2. **Create a new controller** named `TelegramController` and add the following code to handle incoming messages:
   ruby
   class TelegramController < ApplicationController
     def index
       bot.message.text do |m|
         response = OpenAI::Completion.new(model: 'text-davinci-003', prompt: m.text, max_tokens: 150).choices.first.text.strip
         bot.send_message(chat_id: m.chat.id, text: response)
       end
     end
   end
   

## Setting Up the Web Server
1. **Run the Rails server**:
   bash
   rails s -b 0.0.0.0
   

2. **Deploy to Raspberry Pi**:
   You can deploy your Rails application using a service like Heroku or AWS EC2, depending on your preference.

## Deploying the Application
1. **Create a new Heroku app**:
   bash
   heroku create telegram-ollama-bot-rails-pi
   

2. **Add the necessary buildpacks and link dependencies**:
   bash
   heroku buildpacks:add heroku/ruby
   heroku addons:create postgresql
   heroku config:set DATABASE_URL=$(heroku pg:credentials:url DATABASE_URL)
   git push heroku main
   

## Configuring the Bot on a Raspberry Pi
1. **Set up the bot token and OpenAI API key**:
   You can set these environment variables directly on your Raspberry Pi using `export TELEGRAM_BOT_TOKEN=your_bot_token` and `export OPENAI_API_KEY=your_openai_api_key`. Alternatively, you can configure them in a `.env` file as shown earlier.

## Testing the Bot
1. **Send a message to the bot**:
   Open your Telegram app and send a message to your bot's username. The bot will respond with a generated text based on the prompt provided.

## Conclusion
By following these steps, you can set up a Telegram-based language model bot using Rails on a Raspberry Pi. This setup is scalable and can be easily deployed and customized for different use cases.

## References
- [Telegram Bot Ruby](https://github.com/telegram-bot-ruby/telegram-bot-ruby)
- [OpenAI API](https://platform.openai.com/docs/api-reference/models)
