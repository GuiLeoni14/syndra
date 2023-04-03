import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import { chat } from './src/commands/chat/commands.js';
import { chatCommands } from './src/commands/chat/index.js';
import { PREFIX } from './src/utils/prefix.js';

dotenv.config();

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
    console.log(interaction.options.getString('question'));
    const response = await chat(interaction.options.getString('question'));
    await interaction.followUp(response || 'FUDEO');
  } catch (error) {
    console.log(error);
    await interaction.followUp('Vixi docinho, tive alguns probleminhas e não consegui encontrar...');
  }
});

client.on('messageCreate', async (msg) => {
  if (msg.author.username.toLowerCase() === 'syndra' || !msg.content.includes('$')) return;

  const command = msg.content.split(' ')[0];
  const question = msg.content.split(' ').slice(1).join(' ');
  console.log(question);
  switch (command) {
    case `${PREFIX}chat`:
      await msg.reply(await chatCommands('chat', question));
      break;
    default:
      break;
  }
});

client.login(process.env.DISCORD_SECRET);
