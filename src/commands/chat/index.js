import { chat } from './commands.js';

export const commands = {
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
};

export const chatCommands = (command, question) => {
  try {
    switch (command) {
      case 'chat':
        return chat(question);
      default:
        return 'Nenhum comando encontrado';
    }
  } catch (error) {
    console.log(error);
    return 'Vixi docinho tive alguns probleminhas...';
  }
};
