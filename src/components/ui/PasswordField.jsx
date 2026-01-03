import { useState } from 'react';

export default function PasswordField({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  disabled,
  variant = 'dark',
}) {
  const [show, setShow] = useState(false);

  const inputClass =
    variant === 'light'
      ? 'w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200'
      : 'w-full bg-gray-700 text-white px-4 py-3 pr-12 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all';

  const buttonClass =
    variant === 'light'
      ? 'absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800'
      : 'absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white';

  return (
    <div>
      {label ? <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label> : null}
      <div className="relative">
        <input
          id={id}
          name={name}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className={inputClass}
        />

        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className={buttonClass}
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? (
            <span className="text-sm font-semibold">Hide</span>
          ) : (
            <span className="text-sm font-semibold">Show</span>
          )}
        </button>
      </div>
    </div>
  );
}
