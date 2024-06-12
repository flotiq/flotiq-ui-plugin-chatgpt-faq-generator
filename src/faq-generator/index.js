import ReactDOM from 'react-dom/client';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../components/Button/Button';
import { addElementToCache, getCachedElement } from '../common/plugin-helpers';
import getFaqForContent from './get-faq-for-content';

const GenerateFaq = ({ pluginSettings, formik, toast }) => {
  const { t } = useTranslation();

  const onClick = useCallback(async () => {
    const content = formik.values.content.blocks
      .map((b) => `<p>${b.data.text}</p>`)
      .join('\n');
    const {
      first_prompt,
      second_prompt,
      model: [model],
      api_key,
    } = pluginSettings;

    const faq = await getFaqForContent({
      content,
      first_prompt,
      second_prompt,
      model,
      api_key,
    });

    toast.success(t('Generated'));
    formik.setFieldValue('faq', faq);
    formik.setFieldTouched('faq', faq);
  }, [formik, pluginSettings, t, toast]);

  if (!pluginSettings) {
    return <div>{t('ConfigurePlugin')}</div>;
  }

  return (
    <div className="plugin-chatgpt-faq">
      <Button type={'button'} onClick={() => onClick()}>
        {t('GenerateFaq')}
      </Button>
    </div>
  );
};

const updateGenerateButton = (root, data) => {
  root.render(<GenerateFaq {...data} />);
};

const initGenerateButton = (div, data) => {
  const root = ReactDOM.createRoot(div);
  updateGenerateButton(root, data);
  return root;
};

export const handlePlugin = (data, pluginInfo, client, toast) => {
  const { contentType, userPlugins, formik } = data;
  let pluginSettings;

  try {
    pluginSettings = JSON.parse(
      userPlugins?.find(({ id }) => id === pluginInfo.id)?.settings,
    );
  } catch (e) {}

  if (
    !['flotiq_blog_post', 'flotiqBlogPost'].includes(contentType?.name) ||
    !formik
  ) {
    return;
  }

  const cacheKey = `${pluginInfo.id}-${contentType.id}-switch`;

  const cachedApp = getCachedElement(cacheKey);

  const buttonData = {
    pluginSettings,
    formik,
    toast,
  };

  if (cachedApp) {
    updateGenerateButton(cachedApp.root, buttonData);
    return cachedApp.element;
  }

  const div = document.createElement('div');

  addElementToCache(div, initGenerateButton(div, buttonData), cacheKey);

  return div;
};
