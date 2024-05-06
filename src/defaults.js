const defaultConfig = {
  api_key: '',
  first_prompt: `Read the blog post below
and suggest 3 questions
that a reader will have
that are not answered in the article:`,
  second_prompt: `Now answer the questions. Avoid bullet-points.
Print responses with questions in Q&A format with each question and answer in a separate line.`,
  models: ['gpt-3.5-turbo', 'gpt-4'],
  model: ['gpt-3.5-turbo'],
};

export default defaultConfig;
