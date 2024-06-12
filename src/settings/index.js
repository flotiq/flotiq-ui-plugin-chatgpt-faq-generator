import ReactDOM from 'react-dom/client';
import { Form, Formik } from 'formik';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../components/Button/Button';
import ApiKeyField from '../components/ApiKeyField/ApiKeyField';
import ModelField from '../components/ModelField/ModelField';
import FirstPromptField from '../components/FirstPromptField/FirstPromptField';
import SecondPromptField from '../components/SecondPromptField/SecondPromptField';
import * as yup from 'yup';
import defaults from '../defaults';
import {
  addElementToCache,
  getCachedElement,
  removeRoot,
} from '../common/plugin-helpers';
import i18n from '../i18n';

const ManageContent = ({ plugin, reload, modalInstance, client, toast }) => {
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);
  const formId = plugin.name;

  const onSubmit = useCallback(
    async (values) => {
      setIsSaving(true);

      try {
        const { body, status } = await client['_plugin_settings'].patch(
          plugin.id,
          { settings: JSON.stringify(values.settings) },
        );

        if (status < 200 || status >= 300) {
          throw new Error(body);
        }

        toast.success(t('Saved'));
        reload();
        modalInstance.resolve();
      } catch (e) {
        toast.error(t('SavingError'));
      }

      setIsSaving(false);
    },
    [client, modalInstance, plugin.id, reload, toast, t],
  );

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        settings: yup.object().shape({
          api_key: yup.string().required(t('FieldRequired')),
        }),
      }),
    [t],
  );
  return (
    <Formik
      initialValues={{
        settings: {
          api_key: defaults.api_key,
          first_prompt: defaults.first_prompt,
          second_prompt: defaults.second_prompt,
          model: defaults.model,
          ...JSON.parse(plugin.settings || '[]'),
        },
      }}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      validateOnChange
      validateOnBlur
    >
      <Form className="plugin-chatgpt-faq" id={formId} noValidate>
        <ApiKeyField disabled={isSaving} />
        <FirstPromptField disabled={isSaving} />
        <SecondPromptField disabled={isSaving} />
        <ModelField disabled={isSaving} />
        <div className="buttons">
          <Button color="blue" type="submit" form={formId} disabled={isSaving}>
            {t('SaveChanges')}
          </Button>
        </div>
      </Form>
    </Formik>
  );
};

const updateManageModal = (root, data, client, toast) => {
  root.render(<ManageContent {...data} client={client} toast={toast} />);
};

const initManageModal = (div, data, client, toast) => {
  const root = ReactDOM.createRoot(div);
  updateManageModal(root, data, client, toast);
  return root;
};

export const handleSettings = (data, pluginInfo, client, toast) => {
  if (data.plugin?.id !== pluginInfo.id) return null;

  if (data.language !== i18n.language) {
    i18n.changeLanguage(data.language);
  }

  const key = pluginInfo.id;
  const cachedApp = getCachedElement(key);
  if (cachedApp) {
    updateManageModal(cachedApp.root, data, client, toast);
    return cachedApp.element;
  }

  const div = document.createElement('div');
  addElementToCache(div, initManageModal(div, data, client, toast), key);

  data.modalInstance.promise.then(() => removeRoot(key));
  return div;
};
