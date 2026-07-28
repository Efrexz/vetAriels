import type { ComponentType, ChangeEvent } from 'react';

interface FormFieldOption {
  value: string;
  label: string;
}

interface FormFieldBaseProps {
  label: string;
  id: string;
  icon: ComponentType<React.SVGProps<SVGSVGElement>>;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  helperText?: string;
}

interface FormFieldInputProps extends FormFieldBaseProps {
  as?: 'input';
  type?: 'text' | 'email' | 'number' | 'tel' | 'date' | 'password';
}

interface FormFieldSelectProps extends FormFieldBaseProps {
  as: 'select';
  options: FormFieldOption[];
}

type FormFieldProps = FormFieldInputProps | FormFieldSelectProps;

function FormField(props: FormFieldProps) {
  const {
    label,
    id,
    icon: Icon,
    value,
    onChange,
    error,
    required,
    disabled,
    placeholder,
    helperText,
  } = props;

  const isSelect = props.as === 'select';
  const type = 'type' in props ? props.type : undefined;

  const borderColor = error ? 'border-danger' : 'border-slate-200';

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-ink mb-1.5"
      >
        {label}
        {required && <span className="text-danger ml-0.5">*</span>}
      </label>
      <div
        className={`flex items-center rounded-lg overflow-hidden border transition-colors bg-white ${
          disabled
            ? 'bg-slate-50 cursor-not-allowed border-slate-200'
            : `${borderColor} focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30`
        }`}
      >
        <div className="flex items-center justify-center px-3 bg-white">
          <Icon
            className={`w-5 h-5 ${
              disabled ? 'text-slate/40' : 'text-slate'
            }`}
          />
        </div>

        {isSelect ? (
          <select
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            className="w-full py-2 pr-3 focus:outline-none focus:ring-0 bg-white text-sm text-ink disabled:bg-slate-50 disabled:text-slate/60 disabled:cursor-not-allowed border-0"
          >
            {placeholder && (
              <option value="">{placeholder}</option>
            )}
            {(props as FormFieldSelectProps).options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={id}
            name={id}
            type={type || 'text'}
            value={value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            className="w-full py-2 pr-3 focus:outline-none focus:ring-0 bg-white text-sm text-ink placeholder:text-slate/60 disabled:bg-slate-50 disabled:text-slate/60 disabled:cursor-not-allowed border-0"
          />
        )}
      </div>

      {helperText && !error && (
        <p className="text-xs text-slate mt-1">{helperText}</p>
      )}

      {error && (
        <p className="text-danger text-xs mt-1">{error}</p>
      )}
    </div>
  );
}

export { FormField };
export type { FormFieldProps, FormFieldOption };
