import { chat } from './chat/index.js';
import { conga } from './voice/index.js';

export const allCommands = async (msg) => {
  const command = msg.content.split(' ')[0].split('$')[1];
  const question = msg.content.split(' ').slice(1).join(' ');

  const commands = {
    chat: async () => msg.reply(await chat(question)),
    conga: () => conga(msg),
  };

  const execute = commands[command] || null;

  return execute
    ? execute()
    : msg.reply('Nenhum comando encontrado docinho, tente falar mais baixinho no meu ouvido...');
};
