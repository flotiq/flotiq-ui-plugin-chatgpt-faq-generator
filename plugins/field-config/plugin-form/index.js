import { getCachedElement } from "../../../common/plugin-element-cache";
import { validFieldsCacheKey } from "../../../common/valid-fields";

export const handlePluginFormConfig = ({ name, config, formik }) => {
  const { index, type } =
    name.match(/buttons\[(?<index>\d+)\].(?<type>\w+)/)?.groups || {};

  if (index == null || !type) return;

  if (type === "content_type") {
    config.onChange = (_, value) => {
      if (value == null) formik.setFieldValue(name, "");
      else formik.setFieldValue(name, value);

      formik.setFieldValue(`buttons[${index}].source`, "");
      formik.setFieldValue(`buttons[${index}].target`, "");
    };
  } else {
    const { sourceFields, targetFields } =
      getCachedElement(validFieldsCacheKey);

    const ctd = formik.values.buttons[index].content_type;

    config.options =
      type === "source" ? sourceFields?.[ctd] || [] : targetFields?.[ctd] || [];
    config.additionalHelpTextClasses = "break-normal";
  }
};
