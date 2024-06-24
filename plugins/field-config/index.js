import pluginInfo from "../../plugin-manifest.json";
import { handleCoFormConfig } from "./co-form";
import { handlePluginFormConfig } from "./plugin-form";

export const handleFormFieldConfig = (data, toast, getPluginSettings) => {
  if (
    data.contentType?.id === pluginInfo.id &&
    data.contentType?.nonCtdSchema &&
    data.name
  ) {
    return handlePluginFormConfig(data);
  }

  const pluginSettings = getPluginSettings();
  const parsedSettings = JSON.parse(pluginSettings || "{}");
  const apiKey = parsedSettings.api_key;

  const contentTypeSettings = parsedSettings?.buttons?.filter(
    ({ content_type }) => content_type === data?.contentType?.name,
  );

  if (!contentTypeSettings?.length) return;

  handleCoFormConfig(data, apiKey, contentTypeSettings, toast);
};
