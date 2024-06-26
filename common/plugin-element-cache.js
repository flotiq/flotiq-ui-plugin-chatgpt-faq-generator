const appRoots = {};

export const removeRoot = (key) => {
  delete appRoots[key];
};

export const addElementToCache = (element, key, data = {}) => {
  appRoots[key] = {
    element,
    data,
  };

  element.addEventListener("flotiq.detached", () => {
    setTimeout(() => {
      removeRoot(key);
    }, 50);
  });
};

export const getCachedElement = (key) => {
  return appRoots[key];
};

export const registerFn = (pluginInfo, callback) => {
  if (window.FlotiqPlugins?.add) {
    window.FlotiqPlugins.add(pluginInfo, callback);
    return;
  }
  if (!window.initFlotiqPlugins) window.initFlotiqPlugins = [];
  window.initFlotiqPlugins.push({ pluginInfo, callback });
};

export const addObjectToCache = (key, data = {}) => {
  appRoots[key] = data;
};
