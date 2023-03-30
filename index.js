const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  organization: 'org-9Scd9V75SzzFVIW5zrwaXntt',
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});

client.on('messageCreate', async (msg) => {
  if (msg.author.username.toLowerCase() !== 'syndra') {
    if (msg.content.includes('chat')) {
      try {
        const response = await openai.createCompletion({
          model: 'text-davinci-003',
          prompt: msg.content,
          max_tokens: 2000,
          n: 1,
        });
        const answer = response.data.choices[0].text.trim();
        await msg.reply(answer || 'FUDEO');
      } catch (error) {
        console.error('Ocorreu um erro:', error);
        await msg.reply('Estou com erro bip bop');
      }
    }
  }
});
client.login(process.env.DISCORD_SECRET);
