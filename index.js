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
  if (msg.content.includes('chat')) {
    const response = await openai.createCompletion({
      model: 'davinci',
      prompt: msg.content, // define a mensagem recebida como entrada
      max_tokens: 100, // define o tamanho máximo da resposta gerada
      n: 1, // define quantas respostas gerar
    });

    // envia a resposta gerada de volta para o canal do Discord
    const answer = response.data.choices[0].text.trim();
    await msg.reply(answer || 'FUDEO');
  }
});

client.login(process.env.DISCORD_SECRET);
