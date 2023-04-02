const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
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
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildMembers,
  ],
});

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  // Definir os comandos para o bot
  const commands = [
    {
      name: 'ping',
      description: 'Pong!',
    },
    {
      name: 'chat',
      description: 'Diga algo',
      options: [
        {
          name: 'question',
          description: 'A pergunta que você quer fazer',
          type: 3,
          required: true,
        },
      ],
    },
  ];

  // Registrar os comandos com o Discord
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_SECRET);

  try {
    await rest.put(Routes.applicationCommands(client.user.id), { body: commands });

    console.log('Successfully registered application commands.');
  } catch (error) {
    console.error(error);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand() || interaction.commandName !== 'chat') return;

  await interaction.reply('Um segundo docinho estou verificando...');
  try {
    const question = interaction.options.getString('question');

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: question,
      max_tokens: 500,
      n: 1,
    });

    const answer = response.data.choices[0].text.trim();
    console.log(answer);
    await interaction.followUp(answer.toString() || 'FUDEO');
  } catch (error) {
    console.error('Ocorreu um erro:', JSON.stringify(error));
    await interaction.followUp('Vixi docinho, tive alguns probleminhas e não consegui encontrar...');
  }
});

client.on('messageCreate', async (msg) => {
  if (msg.author.username.toLowerCase() !== 'syndra') {
    if (msg.content.includes('chat')) {
      try {
        console.log(msg.content);
        if (msg.content.toLowerCase() === 'chat qual seu nome?') {
          await msg.reply('Meu nome é Syndra!');
          return;
        }
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
