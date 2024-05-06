import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import Input from '../Input/Input';

export const FirstPromptField = ({ disabled }) => {
  const formik = useFormikContext();
  const { t } = useTranslation();
  return (
    <Input
      name={`settings.first_prompt`}
      value={formik.values.settings.first_prompt}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      label={t('ApiKey')}
      disabled={disabled}
      error={
        formik.touched?.settings?.first_prompt
          ? formik.errors?.settings?.first_prompt
          : ''
      }
      required
    />
  );
};

export default FirstPromptField;
