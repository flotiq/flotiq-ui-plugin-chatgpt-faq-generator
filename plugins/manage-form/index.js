import { getValidFields, validFieldsCacheKey } from "../../common/valid-fields";
import { getSchema, getValidator } from "./form-schema";
import pluginInfo from "../../plugin-manifest.json";
import {
  addObjectToCache,
  getCachedElement,
  removeRoot,
} from "../../common/plugin-element-cache";

export const handleSettingsSchema = ({ contentTypes, modalInstance }) => {
  const formSchemaCacheKey = `${pluginInfo.id}-form-schema`;
  let formSchema = getCachedElement(formSchemaCacheKey);

  if (!formSchema) {
    const validFields = getValidFields(contentTypes);
    addObjectToCache(validFieldsCacheKey, validFields);

    const ctds = contentTypes
      ?.filter(({ internal }) => !internal)
      .map(({ name, label }) => ({ value: name, label }));

    const { sourceFieldKeys, targetFieldKeys } = validFields;
    formSchema = {
      options: {
        disabledBuildInValidation: true,
        onValidate: getValidator(sourceFieldKeys, targetFieldKeys),
      },
      schema: getSchema(ctds),
    };
  }

  modalInstance.promise.then(() => removeRoot(formSchemaCacheKey));

  return formSchema;
};
