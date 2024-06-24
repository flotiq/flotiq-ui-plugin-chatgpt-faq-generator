import i18n from "../../i18n";
import pluginInfo from "../../plugin-manifest.json";

export const getSchema = (contentTypes) => ({
  id: pluginInfo.id,
  name: pluginInfo.id,
  label: pluginInfo.name,
  internal: false,
  schemaDefinition: {
    type: "object",
    allOf: [
      {
        $ref: "#/components/schemas/AbstractContentTypeSchemaDefinition",
      },
      {
        type: "object",
        properties: {
          api_key: {
            type: "string",
            minLength: 1,
          },
          buttons: {
            type: "array",
            items: {
              type: "object",
              required: ["content_type", "target", "source"],
              properties: {
                source: {
                  type: "string",
                  minLength: 1,
                },
                target: {
                  type: "string",
                  minLength: 1,
                },
                content_type: {
                  type: "string",
                  minLength: 1,
                },
              },
            },
          },
        },
      },
    ],
    required: ["api_key"],
    additionalProperties: false,
  },
  metaDefinition: {
    order: ["api_key", "buttons"],
    propertiesConfig: {
      api_key: {
        label: i18n.t("ApiKey"),
        unique: false,
        helpText: "",
        inputType: "text",
      },
      buttons: {
        items: {
          order: ["content_type", "source", "target"],
          propertiesConfig: {
            source: {
              label: i18n.t("Source"),
              unique: false,
              helpText: i18n.t("SourceHelpText") + i18n.t("AllowedSources"),
              inputType: "select",
              options: [],
            },
            target: {
              label: i18n.t("Target"),
              unique: false,
              helpText: i18n.t("TargetHelpText") + i18n.t("AllowedTargets"),
              inputType: "select",
              options: [],
            },
            content_type: {
              label: i18n.t("ContentType"),
              unique: false,
              helpText: "",
              inputType: "select",
              optionsWithLabels: contentTypes,
              useOptionsWithLabels: true,
            },
          },
        },
        label: i18n.t("Configure"),
        unique: false,
        helpText: "",
        inputType: "object",
      },
    },
  },
});

const addToErrors = (errors, index, field, error) => {
  if (!errors.buttons) errors.buttons = [];
  if (!errors.buttons[index]) errors.buttons[index] = {};
  errors.buttons[index][field] = error;
};

export const getValidator = (sourceFieldKeys, targetFieldKeys) => {
  const onValidate = (values) => {
    const errors = {};

    if (!values.api_key) {
      errors.api_key = i18n.t("FieldRequired");
    }

    values.buttons?.forEach(({ content_type, source, target }, index) => {
      if (!content_type) {
        addToErrors(errors, index, "content_type", i18n.t("FieldRequired"));
      }

      if (!source) {
        addToErrors(errors, index, "source", i18n.t("FieldRequired"));
      } else if (!(sourceFieldKeys[content_type] || []).includes(source)) {
        addToErrors(errors, index, "source", i18n.t("WrongSource"));
      }

      if (!target) {
        addToErrors(errors, index, "target", i18n.t("FieldRequired"));
      } else if (!(targetFieldKeys[content_type] || []).includes(target)) {
        addToErrors(errors, index, "target", i18n.t("WrongTarget"));
      } else if (source === target) {
        addToErrors(errors, index, "target", i18n.t("Unique"));
      }
    });

    return errors;
  };

  return onValidate;
};
