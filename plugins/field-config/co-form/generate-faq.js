import OpenAI from "openai";
import { validFields } from "../../../common/valid-fields";
import i18n from "../../../i18n";

const model = "gpt-3.5-turbo";
const firstPrompt =
  "Read the blog post below and suggest 3 questions that a reader will have that are not answered in the article.";
const secondPrompt =
  "Now answer the questions. Avoid bullet-points." +
  "Print responses with questions in Q&A format with each question and answer in a separate line.";

const getFaqForContent = async (content, api_key) => {
  const openai = new OpenAI({
    apiKey: api_key,
    dangerouslyAllowBrowser: true,
  });

  const context = [
    { role: "system", content: "You are a helpful assistant." },
    {
      role: "user",
      content: firstPrompt,
    },
    {
      role: "user",
      content,
    },
  ];

  const faqQuestionsCompletion = await openai.chat.completions.create({
    messages: context,
    model,
  });

  context.push(
    ...[
      faqQuestionsCompletion.choices[0].message,
      {
        role: "user",
        content: secondPrompt,
      },
    ],
  );

  const faqAnswersCompletion = await openai.chat.completions.create({
    messages: context,
    model,
  });

  const faqAnswersResponse = faqAnswersCompletion.choices[0].message;

  const faqQuestions = faqAnswersResponse.content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "")
    .filter((line) => line.startsWith("Q:"));

  const faqAnswers = faqAnswersResponse.content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "")
    .filter((line) => line.startsWith("A:"));

  return faqQuestions.map((q, idx) => ({
    question: q.replace(/^Q:\s+/, ""),
    answer: faqAnswers[idx].replace(/^A:\s+/, ""),
  }));
};

const getFieldData = (fieldName, contentType) => {
  const config = contentType.metaDefinition?.propertiesConfig?.[fieldName];
  const schema =
    contentType.schemaDefinition?.allOf?.[1]?.properties?.[fieldName];

  return [config?.inputType, config, schema];
};

export const generateFAQ = async ({
  apiKey,
  settings,
  formik,
  contentType,
  toast,
}) => {
  const { source, target } = settings;

  const [sourceInputType, sourceConfig, sourceSchema] = getFieldData(
    source,
    contentType,
  );
  const [targetInputType, targetConfig, targetSchema] = getFieldData(
    target,
    contentType,
  );

  const isSourceValid = validFields[sourceInputType]?.isValid(
    true,
    sourceConfig,
    sourceSchema,
  );
  const isTargetValid = validFields[targetInputType]?.isValid(
    false,
    targetConfig,
    targetSchema,
  );

  if (!isSourceValid)
    throw new Error(i18n.t("WrongSource") + i18n.t("AllowedSources"));
  if (!isTargetValid)
    throw new Error(i18n.t("WrongTarget") + i18n.t("AllowedTargets"));

  const content = validFields[sourceInputType].getContent(
    formik.values[source],
  );

  const faqResponse = await getFaqForContent(content, apiKey);

  const faq = validFields[targetInputType].getTargetValue(faqResponse);

  toast.success(i18n.t("Generated"));
  formik.setFieldValue(target, faq);
  formik.setFieldTouched(target, faq);
};
