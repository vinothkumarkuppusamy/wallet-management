import React from 'react';
import './components.css';

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn btn-${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
