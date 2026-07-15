import React from 'react';

const FormField = ({
  label,
  error,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  options = [],
  required = false,
  disabled = false,
  rows = 3,
  className = ''
}) => {
  const inputBaseStyles = `w-full px-3.5 py-2.5 border rounded-xl text-xs font-semibold tracking-wide transition-all focus:outline-none focus:ring-4 focus:ring-farm-500/10 focus:border-farm-500 ${
    error ? 'border-rose-350 bg-rose-50/5 focus:ring-rose-500/15 focus:border-rose-500' : 'border-slate-200 focus:ring-farm-500/10 hover:border-slate-300'
  } ${disabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed border-slate-150' : 'bg-white text-slate-800'}`;

  const renderInput = () => {
    if (type === 'select') {
      return (
        <select
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`${inputBaseStyles} cursor-pointer`}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const lbl = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={val} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>
      );
    }

    if (type === 'textarea') {
      return (
        <textarea
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={rows}
          className={`${inputBaseStyles} resize-none custom-scrollbar`}
        />
      );
    }

    if (type === 'checkbox') {
      return (
        <div className="flex items-center space-x-2.5 py-1.5">
          <input
            type="checkbox"
            name={name}
            id={name}
            checked={!!value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            className="w-5 h-5 text-farm-600 border-slate-250 rounded-lg focus:ring-farm-500/20 focus:ring-3 accent-farm-600 cursor-pointer disabled:cursor-not-allowed"
          />
          {placeholder && (
            <label htmlFor={name} className="text-xs text-slate-650 font-bold cursor-pointer select-none">
              {placeholder}
            </label>
          )}
        </div>
      );
    }

    return (
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={inputBaseStyles}
      />
    );
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && type !== 'checkbox' && (
        <label htmlFor={name} className="text-xs font-extrabold text-slate-700 block uppercase tracking-wide">
          {label} {required && <span className="text-rose-500 font-bold">*</span>}
        </label>
      )}
      {renderInput()}
      {error && <span className="text-[10px] text-rose-500 font-bold block leading-none">{error}</span>}
    </div>
  );
};

export default FormField;
