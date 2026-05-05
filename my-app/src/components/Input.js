import React from 'react';
import './components.css';

const Input = ({ label, type = 'text', placeholder, value, onChange, className = '', ...props }) => {
  return (
    <div className={`input-group ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <input
        type={type}
        className="input-field"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  );
};

export default Input;
