import { Fragment, useCallback, useMemo, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import {
  CaretDownIcon,
  CloseIcon,
  CheckmarkIcon,
  LoaderIcon,
} from '../../images/shapes';
import { useTranslation } from 'react-i18next';
import Button from '../Button/Button';

const SelectedOptions = ({ selectedOptions, onRemove, disabled }) => {
  if (!selectedOptions.length) {
    return '';
  }

  return selectedOptions.map(selectedOption => {
    return (
      <div key={selectedOption.value} className='selected-option'>
        <span title={selectedOption.label ?? selectedOption.value}>
          {selectedOption.label ?? selectedOption.value}
        </span>
        {!disabled && (
          <button
            className='borderless'
            onClick={e => {
              e.stopPropagation();
              onRemove(selectedOption);
            }}
            type='button'
          >
            <CloseIcon />
          </button>
        )}
      </div>
    );
  });
};

const Dropdown = ({
  name,
  options,
  isLoading,
  value,
  onChange,
  onBlur,
  label,
  disabled,
  search = false,
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const handleChange = useCallback(
    value => {
      onChange({
        target: { value, name },
      });
      onBlur({ target: { name } });
    },
    [onChange, name, onBlur],
  );

  const filteredOptions = useMemo(
    () =>
      (options || []).filter(
        option =>
          query === '' ||
          (option.label ?? option.value)
            ?.toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [query, options],
  );

  const handleRemoveItem = useCallback(
    removed => {
      const newValue = value.filter(val => val !== removed.value);
      handleChange(newValue);
    },
    [handleChange, value],
  );

  const handleClear = useCallback(
    e => {
      e.stopPropagation();
      handleChange([]);
    },
    [handleChange],
  );

  const renderOptions = useMemo(() => {
    if (isLoading)
      return (
        <div className='loader'>
          <LoaderIcon />
        </div>
      );

    if (filteredOptions.length === 0) {
      return <div className='empty-options'>{t('EmptyOptions')}</div>;
    }
    return filteredOptions.map(option => (
      <Listbox.Option
        key={option.value}
        className={({ active }) => (active ? 'active' : '')}
        value={option.value}
      >
        {({ selected }) => (
          <div>
            <span className='label'>{option.label || option.value}</span>
            <span className='icon'>{selected && <CheckmarkIcon />}</span>
          </div>
        )}
      </Listbox.Option>
    ));
  }, [isLoading, filteredOptions, t]);

  return (
    <Listbox value={value} onChange={handleChange} disabled={disabled} multiple>
      {({ open }) => (
        <div className='dropdown-container'>
          {label && <label>{label}</label>}
          <div>
            <Listbox.Button
              as='div'
              role='button'
              className='dropdown-button'
              disabled={disabled}
            >
              <div>
                <SelectedOptions
                  selectedOptions={value.map(
                    val =>
                      options.find(option => option.value === val) || {
                        value: val,
                        label: val,
                      },
                  )}
                  onRemove={handleRemoveItem}
                  disabled={disabled}
                />
              </div>
              <CaretDownIcon className={open ? 'open' : ''} />
            </Listbox.Button>
            {value.length > 0 && (
              <span className='clear'>
                <Button
                  className='borderless'
                  onClick={e => {
                    e.preventDefault();
                    handleClear(e);
                  }}
                  type='button'
                >
                  <CloseIcon />
                </Button>
              </span>
            )}
          </div>
          <Transition as={Fragment} afterLeave={() => setQuery('')}>
            <Listbox.Options className='scrollbar-sm'>
              {!isLoading && search && (
                <div>
                  <input
                    type='search'
                    name='query'
                    value={query}
                    onChange={event => {
                      setQuery(event.target.value);
                    }}
                    onKeyDown={e => {
                      e.stopPropagation();
                    }}
                  />
                </div>
              )}
              {renderOptions}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
};

export default Dropdown;
