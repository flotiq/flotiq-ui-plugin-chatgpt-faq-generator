import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import Input from '../Input/Input';

export const ApiKeyField = ({ disabled }) => {
  const formik = useFormikContext();
  const { t } = useTranslation();
  return (
    <Input
      name={`settings.api_key`}
      value={formik.values.settings.api_key}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      label={t('ApiKey')}
      placeholder={'sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'}
      disabled={disabled}
      error={
        formik.touched?.settings?.api_key
          ? formik.errors?.settings?.api_key
          : ''
      }
      required
    />
  );
};

export default ApiKeyField;
