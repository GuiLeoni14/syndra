import { openai } from '../../lib/openai.js';

export const chat = async (question) => {
  console.log(question);
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: question,
    max_tokens: 500,
    n: 1,
  });

  const answer = response.data.choices[0].text.trim();
  console.log('cheguei aqui', answer);
  return answer;
};
