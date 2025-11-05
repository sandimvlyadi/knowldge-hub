import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import * as React from 'react';

export interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface FormSelectProps
    extends Omit<
        React.SelectHTMLAttributes<HTMLSelectElement>,
        'value' | 'onChange'
    > {
    options: SelectOption[];
    placeholder?: string;
    defaultValue?: string;
}

/**
 * Form-integrated Select Component
 *
 * Komponen ini otomatis terintegrasi dengan Inertia Form menggunakan name attribute.
 * Value akan otomatis terbaca oleh Form tanpa perlu manual state management.
 *
 * @example
 * <FormSelect
 *   name="status"
 *   options={[
 *     { value: 'active', label: 'Active' },
 *     { value: 'inactive', label: 'Inactive' },
 *   ]}
 *   placeholder="Select status"
 *   required
 * />
 */
export function FormSelect({
    options,
    placeholder = 'Select option...',
    className,
    defaultValue,
    name,
    required,
    disabled,
    ...rest
}: FormSelectProps) {
    const [value, setValue] = React.useState(defaultValue || '');
    const hiddenInputRef = React.useRef<HTMLInputElement>(null);

    const handleValueChange = (newValue: string) => {
        setValue(newValue);

        // Trigger native input change event untuk form
        if (hiddenInputRef.current) {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype,
                'value',
            )?.set;
            nativeInputValueSetter?.call(hiddenInputRef.current, newValue);

            const event = new Event('input', { bubbles: true });
            hiddenInputRef.current.dispatchEvent(event);
        }
    };

    return (
        <>
            {/* Hidden input untuk form submission */}
            <input
                ref={hiddenInputRef}
                type="hidden"
                name={name}
                value={value}
                required={required}
            />

            <Select
                value={value}
                onValueChange={handleValueChange}
                disabled={disabled}
            >
                <SelectTrigger
                    className={className}
                    aria-required={required}
                    aria-invalid={rest['aria-invalid']}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </>
    );
}
