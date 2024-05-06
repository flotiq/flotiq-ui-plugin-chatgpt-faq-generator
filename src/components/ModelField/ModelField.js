import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import Dropdown from '../Dropdown/Dropdown';
import defaults from '../../defaults';

export const ModelField = ({ disabled }) => {
  const formik = useFormikContext();
  const { t } = useTranslation();
  const options = defaults.models.map(value => ({ value }));

  return (
    <Dropdown
      name={`settings.model`}
      options={options}
      isLoading={false}
      value={formik.values.settings.model}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      label={t('Model')}
      disabled={disabled}
      error={
        formik.touched?.settings?.model ? formik.errors?.settings?.model : ''
      }
      required
    />
  );
};

export default ModelField;
