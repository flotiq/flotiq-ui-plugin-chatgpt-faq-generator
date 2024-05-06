const Input = ({
  name,
  value,
  type,
  required,
  onChange,
  onBlur,
  label,
  error,
  disabled,
  placeholder,
}) => (
  <div className='input-container'>
    {label && (
      <label>
        {label}
        {required && <span>*</span>}
      </label>
    )}
    <div>
      <input
        className={error ? 'error' : ''}
        value={value}
        type={type}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
      />
    </div>
    {error && <div className='error-text'>{error}</div>}
  </div>
);

export default Input;
