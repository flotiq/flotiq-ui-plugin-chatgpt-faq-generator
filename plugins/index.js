import i18n from "../i18n";
import { registerFn } from "../common/plugin-element-cache";
import pluginInfo from "../plugin-manifest.json";
import cssString from "inline:./styles/style.css";
import { handleFormFieldConfig } from "./field-config";
import { handleSettingsSchema } from "./manage-form";
import { handleFormFieldListenrsAdd } from "./field-listeners";

const loadStyles = () => {
  if (!document.getElementById(`${pluginInfo.id}-styles`)) {
    const style = document.createElement("style");
    style.id = `${pluginInfo.id}-styles`;
    style.textContent = cssString;
    document.head.appendChild(style);
  }
};

registerFn(
  pluginInfo,
  (handler, _, { toast, getPluginSettings, getLanguage }) => {
    loadStyles();

    const language = getLanguage();
    if (language !== i18n.language) {
      i18n.changeLanguage(language);
    }

    handler.on("flotiq.form.field::config", (data) =>
      handleFormFieldConfig(data, toast, getPluginSettings),
    );
    handler.on("flotiq.plugins.manage::form-schema", (data) =>
      handleSettingsSchema(data),
    );

    handler.on("flotiq.form.field.listeners::add", (data) =>
      handleFormFieldListenrsAdd(data),
    );

    handler.on("flotiq.language::changed", ({ language }) => {
      if (language !== i18n.language) {
        i18n.changeLanguage(language);
      }
    });
  },
);
