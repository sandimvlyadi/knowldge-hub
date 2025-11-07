import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

export interface ComboboxOption {
    value: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    disabled?: boolean;
}

export interface FormComboboxProps
    extends Omit<
        React.InputHTMLAttributes<HTMLInputElement>,
        'value' | 'onChange'
    > {
    options: ComboboxOption[];
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    defaultValue?: string;
    value?: string;
    onChange?: (value: string) => void;
    isLoading?: boolean;
}

/**
 * Form-integrated Combobox Component
 *
 * Komponen ini otomatis terintegrasi dengan Inertia Form menggunakan name attribute.
 * Value akan otomatis terbaca oleh Form tanpa perlu manual state management.
 *
 * @example
 * <FormCombobox
 *   name="ref_id"
 *   options={[
 *     { value: '1', label: 'Option 1' },
 *     { value: '2', label: 'Option 2' },
 *   ]}
 *   placeholder="Select an option"
 *   required
 * />
 */
export function FormCombobox({
    options,
    placeholder = 'Select option...',
    searchPlaceholder = 'Search option...',
    emptyText = 'No option found.',
    className,
    defaultValue,
    name,
    required,
    disabled,
    isLoading = false,
    value: controlledValue,
    onChange: controlledOnChange,
    ...rest
}: FormComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState(
        defaultValue || '',
    );

    // Gunakan controlled value jika ada (dari react-hook-form), jika tidak gunakan internal state
    const value =
        controlledValue !== undefined ? controlledValue : internalValue;

    const handleSelect = (selectedValue: string) => {
        const newValue = selectedValue === value ? '' : selectedValue;

        // Update internal state jika tidak controlled
        if (controlledValue === undefined) {
            setInternalValue(newValue);
        }

        setOpen(false);

        // Panggil onChange callback jika ada (dari react-hook-form)
        if (controlledOnChange) {
            controlledOnChange(newValue);
        }

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

    const hiddenInputRef = React.useRef<HTMLInputElement>(null);

    const selectedOption = options.find((option) => option.value === value);

    return (
        <>
            {/* Hidden input untuk form submission */}
            <input
                ref={hiddenInputRef}
                type="hidden"
                name={name}
                value={value}
                required={required}
                {...rest}
            />

            <Popover open={open} onOpenChange={setOpen} modal={true}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        aria-required={required}
                        aria-invalid={rest['aria-invalid']}
                        disabled={disabled}
                        className={cn(
                            'w-full justify-between',
                            !value && 'text-muted-foreground',
                            rest['aria-invalid'] &&
                                'border-destructive ring-destructive/20 dark:ring-destructive/40',
                            className,
                        )}
                    >
                        <span className="flex items-center gap-2">
                            {selectedOption?.icon && (
                                <selectedOption.icon className="size-4" />
                            )}
                            {selectedOption?.label || placeholder}
                        </span>
                        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command>
                        <CommandInput placeholder={searchPlaceholder} />
                        <CommandList>
                            <CommandEmpty>
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <Spinner className="me-1" /> Loading...
                                    </div>
                                ) : (
                                    emptyText
                                )}
                            </CommandEmpty>
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.label}
                                        keywords={[option.label, option.value]}
                                        disabled={option.disabled}
                                        onSelect={() =>
                                            handleSelect(option.value)
                                        }
                                        className="flex items-center gap-2"
                                    >
                                        {option.icon && (
                                            <option.icon className="size-4" />
                                        )}
                                        <span className="flex-1">
                                            {option.label}
                                        </span>
                                        <Check
                                            className={cn(
                                                'size-4',
                                                value === option.value
                                                    ? 'opacity-100'
                                                    : 'opacity-0',
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </>
    );
}
