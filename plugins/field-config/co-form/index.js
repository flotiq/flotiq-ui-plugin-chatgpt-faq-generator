import {
  addElementToCache,
  getCachedElement,
} from "../../../common/plugin-element-cache";
import pluginInfo from "../../../plugin-manifest.json";
import { generateFAQ } from "./generate-faq";

export const handleCoFormConfig = (
  { contentType, name, config, form },
  apiKey,
  settings,
  toast,
) => {
  const targetSettings = settings.find(({ target }) => target === name);

  if (targetSettings) {
    const cacheKey = `${pluginInfo.id}-${contentType.name}-${name}`;
    const cacheEntry = getCachedElement(cacheKey);

    let button = cacheEntry?.element;

    const buttonData = {
      apiKey,
      settings: targetSettings,
      form,
      toast,
      contentType,
    };

    if (!button) {
      button = document.createElement("button");
      button.setAttribute("class", "plugin-chatgpt-faq__button");
      button.type = "button";

      button.onclick = () => {
        const loadingClass = "plugin-chatgpt-faq__button--loading";
        button.classList.add(loadingClass);
        button.disabled = true;

        generateFAQ(buttonData)
          .catch((error) => {
            toast.error(error.message, { duration: 5000 });
          })
          .finally(() => {
            button.classList.remove(loadingClass);
            button.disabled = false;
          });
      };
    }

    addElementToCache(button, cacheKey, buttonData);

    config.additionalElements = [button];
  }
};
