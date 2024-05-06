import { handlePlugin } from './faq-generator';
import { handleSettings } from './settings';
import { registerFn } from './common/plugin-element-cache';
import pluginInfo from './plugin-manifest.json';

/* eslint import/no-webpack-loader-syntax: off */
import cssString from '!!raw-loader!./styles/index.css';
import cssPanelString from '!!raw-loader!./styles/panel.css';
import cssButtonString from '!!raw-loader!./styles/button.css';
import cssModalString from '!!raw-loader!./styles/modalContent.css';
import cssInputString from '!!raw-loader!./styles/input.css';
import cssDropdownString from '!!raw-loader!./styles/dropdown.css';

const loadStyles = () => {
  if (!document.getElementById(`${pluginInfo.id}-styles`)) {
    const style = document.createElement('style');
    style.id = `${pluginInfo.id}-styles`;
    style.textContent =
      cssString +
      cssButtonString +
      cssPanelString +
      cssModalString +
      cssInputString +
      cssDropdownString;
    document.head.appendChild(style);
  }
};

registerFn(pluginInfo, (handler, _client, { toast }) => {
  loadStyles();
  handler.on('flotiq.form::add', (data) =>
    handlePlugin(data, pluginInfo, _client, toast),
  );
  handler.on('flotiq.plugins.manage::render', (data) =>
    handleSettings(data, pluginInfo, _client, toast),
  );
});
