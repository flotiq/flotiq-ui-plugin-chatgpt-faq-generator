const Button = ({ children, color, onClick, disabled, ...props }) => {
  return (
    <button onClick={onClick} className={color} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

export default Button;
