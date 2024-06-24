import pluginInfo from "../plugin-manifest.json";

/** Rich text and markdown are currently not supported as target fields 
 * due to issues with Flotiq not updating the value of these fields.
 * The FAQ is generated fine, but without saving and refreshing the page the new values are not visible.
 * The getTargetValue function is here if there is support in refreshing their content */

export const validFields = {
  textarea: {
    isValid: () => true,
    getContent: (value) => value,
    getTargetValue: (faqResponse) =>
      Object.values(faqResponse)
        .map(
          (faqResponse, idx) =>
            `${idx + 1}. ${faqResponse.question}\n${faqResponse.answer}`,
        )
        .join("\n"),
  },
  richtext: {
    isValid: (isSource) => isSource,
    getContent: (value) => value,
    getTargetValue: (faqResponse) =>
      `<ol>${Object.values(faqResponse)
        .map(
          (faqResponse) =>
            `<li>${faqResponse.question} <br> ${faqResponse.answer}</li>`,
        )
        .join(" \n ")}</ol>`,
  },
  textMarkdown: {
    isValid: (isSource) => isSource,
    getContent: (value) => value,
    getTargetValue: (faqResponse) =>
      Object.values(faqResponse)
        .map(
          (faqResponse, idx) =>
            `${idx + 1}. ${faqResponse.question} \n ${faqResponse.answer}`,
        )
        .join(" \n "),
  },
  block: {
    isValid: (isSource) => isSource,
    getContent: (value) =>
      value.blocks?.map((b) => `<p>${b.data.text}</p>`).join("\n") || "",
  },
  object: {
    isValid: (isSource, config = {}) => {
      if (isSource) return false;

      const containsQuestion = Object.entries(
        config.items?.propertiesConfig || {},
      ).some(
        ([key, value]) =>
          key === "question" && ["text", "textarea"].includes(value.inputType),
      );

      const containsAnswer = Object.entries(
        config.items?.propertiesConfig || {},
      ).some(
        ([key, value]) =>
          key === "answer" && ["text", "textarea"].includes(value.inputType),
      );

      return containsQuestion && containsAnswer;
    },
    getTargetValue: (faqResponse) => faqResponse,
  },
};

export const getValidFields = (contentTypes) => {
  const sourceFields = {};
  const targetFields = {};

  const sourceFieldKeys = {};
  const targetFieldKeys = {};

  contentTypes
    ?.filter(({ internal }) => !internal)
    .map(({ name, label }) => ({ value: name, label }));

  (contentTypes || []).forEach(({ name, metaDefinition, schemaDefinition }) => {
    sourceFields[name] = [];
    targetFields[name] = [];
    sourceFieldKeys[name] = [];
    targetFieldKeys[name] = [];

    Object.entries(metaDefinition?.propertiesConfig || {}).forEach(
      ([key, value]) => {
        const inputType = value?.inputType;
        const fieldConfig = value;
        const fieldSchema = schemaDefinition?.allOf?.[1]?.properties?.[key];

        if (validFields[inputType]?.isValid(true, fieldConfig, fieldSchema)) {
          sourceFields[name].push({ value: key, label: fieldConfig.label });
          sourceFieldKeys[name].push(key);
        }
        if (validFields[inputType]?.isValid(false, fieldConfig, fieldSchema)) {
          targetFields[name].push({ value: key, label: fieldConfig.label });
          targetFieldKeys[name].push(key);
        }
      },
    );
  });

  return { sourceFields, sourceFieldKeys, targetFields, targetFieldKeys };
};

export const validFieldsCacheKey = `${pluginInfo.id}-form-valid-fields`;
