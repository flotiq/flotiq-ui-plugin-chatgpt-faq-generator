import OpenAI from 'openai';

export default async function getFaqForContent ({
  content,
  first_prompt,
  second_prompt,
  model,
  api_key,
}) {
  const openai = new OpenAI({
    apiKey: api_key,
    dangerouslyAllowBrowser: true,
  });

  const context = [
    { role: 'system', content: 'You are a helpful assistant.' },
    {
      role: 'user',
      content: first_prompt,
    },
    {
      role: 'user',
      content,
    },
  ];

  let completion;

  completion = await openai.chat.completions.create({
    messages: context,
    model,
  });

  const faqQuestionsResponse = completion.choices[0].message;

  context.push(
    ...[
      faqQuestionsResponse,
      {
        role: 'user',
        content: second_prompt,
      },
    ],
  );

  completion = await openai.chat.completions.create({
    messages: context,
    model: 'gpt-3.5-turbo',
  });

  const faqAnswersResponse = completion.choices[0].message;

  const faqQuestions = faqAnswersResponse.content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== '')
    .filter(line => /^Q:/.test(line));

  const faqAnswers = faqAnswersResponse.content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== '')
    .filter(line => /^A:/.test(line));

  return faqQuestions.map((q, idx) => ({
    question: q.replace(/^Q:\s+/, ''),
    answer: faqAnswers[idx].replace(/^A:\s+/, ''),
  }));
}
