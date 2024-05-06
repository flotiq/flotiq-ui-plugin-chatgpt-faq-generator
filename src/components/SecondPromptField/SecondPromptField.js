import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import Input from '../Input/Input';

export const ApiKeyField = ({ disabled }) => {
  const formik = useFormikContext();
  const { t } = useTranslation();
  return (
    <Input
      name={`settings.second_prompt`}
      value={formik.values.settings.second_prompt}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      label={t('ApiKey')}
      disabled={disabled}
      error={
        formik.touched?.settings?.second_prompt
          ? formik.errors?.settings?.second_prompt
          : ''
      }
      required
    />
  );
};

export default ApiKeyField;
