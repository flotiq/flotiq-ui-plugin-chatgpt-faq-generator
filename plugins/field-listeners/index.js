import pluginInfo from "../../plugin-manifest.json";

export const handleFormFieldListenersAdd = ({ contentType, form, name }) => {
  if (name && contentType?.id === pluginInfo.id && contentType?.nonCtdSchema) {
    const { index, type } =
      name.match(/buttons\[(?<index>\d+)\].(?<type>\w+)/)?.groups || {};

    if (index != null && type === "content_type") {
      return {
        onChange: () => {
          form.setFieldValue(`buttons[${index}].source`, "");
          form.setFieldValue(`buttons[${index}].target`, "");
        },
      };
    }
  }
};
