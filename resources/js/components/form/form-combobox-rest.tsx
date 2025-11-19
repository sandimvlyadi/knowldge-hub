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

export interface ComboboxRestOption {
    id: number;
    ref_id: string;
    name: string;
    [key: string]: any; // untuk field tambahan seperti key, color_name, dll
}

export interface ComboboxRestResponse {
    current_page: number;
    data: ComboboxRestOption[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        page: number | null;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface FormComboboxRestProps
    extends Omit<
        React.InputHTMLAttributes<HTMLInputElement>,
        'value' | 'onChange'
    > {
    apiUrl: string;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    defaultValue?: string;
    value?: string;
    onChange?: (value: string) => void;
    debounceDelay?: number;
    // Custom formatter untuk label jika tidak menggunakan 'name'
    labelFormatter?: (option: ComboboxRestOption) => string;
    // Custom formatter untuk value jika tidak menggunakan 'ref_id'
    valueFormatter?: (option: ComboboxRestOption) => string;
    // Icon renderer berdasarkan option
    iconRenderer?: (option: ComboboxRestOption) => React.ReactNode;
    // Query params tambahan
    additionalParams?: Record<string, string>;
}

/**
 * Form-integrated Combobox Component with REST API
 *
 * Komponen combobox yang otomatis load data dari REST API dengan debounce.
 * Terintegrasi dengan Inertia Form menggunakan name attribute.
 *
 * @example
 * <FormComboboxRest
 *   name="category_id"
 *   apiUrl="/master/statuses/categories"
 *   placeholder="Select category"
 *   searchPlaceholder="Search categories..."
 *   required
 * />
 *
 * @example Custom formatters
 * <FormComboboxRest
 *   name="status_id"
 *   apiUrl="/master/statuses"
 *   labelFormatter={(option) => `${option.name} (${option.key})`}
 *   valueFormatter={(option) => option.id.toString()}
 * />
 */
export function FormComboboxRest({
    apiUrl,
    placeholder = 'Select option...',
    searchPlaceholder = 'Search option...',
    emptyText = 'No option found.',
    className,
    defaultValue,
    name,
    required,
    disabled,
    value: controlledValue,
    onChange: controlledOnChange,
    debounceDelay = 300,
    labelFormatter,
    valueFormatter,
    iconRenderer,
    additionalParams = {},
    ...rest
}: FormComboboxRestProps) {
    const [open, setOpen] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState(
        defaultValue || '',
    );
    const [options, setOptions] = React.useState<ComboboxRestOption[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedOption, setSelectedOption] =
        React.useState<ComboboxRestOption | null>(null);

    // Gunakan controlled value jika ada, jika tidak gunakan internal state
    const value =
        controlledValue !== undefined ? controlledValue : internalValue;

    const hiddenInputRef = React.useRef<HTMLInputElement>(null);
    const abortControllerRef = React.useRef<AbortController | null>(null);
    const fetchSelectedRef = React.useRef<AbortController | null>(null);

    // Helper functions untuk get label dan value
    const getOptionLabel = React.useCallback(
        (option: ComboboxRestOption) => {
            return labelFormatter ? labelFormatter(option) : option.name;
        },
        [labelFormatter],
    );

    const getOptionValue = React.useCallback(
        (option: ComboboxRestOption) => {
            return valueFormatter ? valueFormatter(option) : option.ref_id;
        },
        [valueFormatter],
    );

    // Fungsi untuk fetch data dari API
    const fetchOptions = React.useCallback(
        async (query: string) => {
            // Cancel request sebelumnya jika ada
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            abortControllerRef.current = new AbortController();
            setIsLoading(true);

            try {
                const params = new URLSearchParams({
                    ...additionalParams,
                    ...(query && { search: query }),
                });

                const response = await fetch(`${apiUrl}?${params.toString()}`, {
                    signal: abortControllerRef.current.signal,
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch options');
                }

                const data: ComboboxRestResponse = await response.json();
                setOptions(data.data);
            } catch (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    console.error('Error fetching options:', error);
                    setOptions([]);
                }
            } finally {
                setIsLoading(false);
            }
        },
        [apiUrl, additionalParams],
    );

    // Fungsi untuk fetch selected option berdasarkan value
    const fetchSelectedOption = React.useCallback(
        async (searchValue: string) => {
            if (!searchValue) {
                setSelectedOption(null);
                return;
            }

            // Cancel request sebelumnya jika ada
            if (fetchSelectedRef.current) {
                fetchSelectedRef.current.abort();
            }

            fetchSelectedRef.current = new AbortController();

            try {
                // Cek dulu apakah ada di options yang sudah dimuat
                const existingOption = options.find(
                    (opt) => getOptionValue(opt) === searchValue,
                );

                if (existingOption) {
                    setSelectedOption(existingOption);
                    return;
                }

                // Jika tidak ada, fetch dengan search query
                const params = new URLSearchParams({
                    ...additionalParams,
                    search: searchValue,
                });

                const response = await fetch(`${apiUrl}?${params.toString()}`, {
                    signal: fetchSelectedRef.current.signal,
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch selected option');
                }

                const data: ComboboxRestResponse = await response.json();
                const found = data.data.find(
                    (opt) => getOptionValue(opt) === searchValue,
                );

                if (found) {
                    setSelectedOption(found);
                }
            } catch (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    console.error('Error fetching selected option:', error);
                }
            }
        },
        [apiUrl, additionalParams, options, getOptionValue],
    );

    // Debounce search query
    React.useEffect(() => {
        const timer = setTimeout(() => {
            fetchOptions(searchQuery);
        }, debounceDelay);

        return () => clearTimeout(timer);
    }, [searchQuery, debounceDelay]);

    // Load initial data saat component mount - hanya sekali
    React.useEffect(() => {
        fetchOptions('');

        // Cleanup
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch selected option saat value berubah (untuk edit form)
    React.useEffect(() => {
        if (value && !selectedOption) {
            fetchSelectedOption(value);
        }
    }, [value, selectedOption, fetchSelectedOption]);

    // Cleanup fetch selected
    React.useEffect(() => {
        return () => {
            if (fetchSelectedRef.current) {
                fetchSelectedRef.current.abort();
            }
        };
    }, []);

    const handleSelect = (selectedValue: string) => {
        const newValue = selectedValue === value ? '' : selectedValue;

        // Simpan selected option
        const selected = options.find(
            (option) => getOptionValue(option) === selectedValue,
        );
        setSelectedOption(selected || null);

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

    // Cari di options saat ini, jika tidak ada gunakan selectedOption yang tersimpan
    const currentSelectedOption =
        options.find((option) => getOptionValue(option) === value) ||
        selectedOption;

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
                            {currentSelectedOption && iconRenderer && (
                                <>{iconRenderer(currentSelectedOption)}</>
                            )}
                            {currentSelectedOption
                                ? getOptionLabel(currentSelectedOption)
                                : placeholder}
                        </span>
                        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                        />
                        <CommandList>
                            <CommandEmpty>
                                {isLoading ? (
                                    <div className="flex items-center justify-center py-6">
                                        <Spinner className="me-1" /> Loading...
                                    </div>
                                ) : (
                                    emptyText
                                )}
                            </CommandEmpty>
                            {!isLoading && (
                                <CommandGroup>
                                    {options.map((option) => {
                                        const optionValue =
                                            getOptionValue(option);
                                        const optionLabel =
                                            getOptionLabel(option);

                                        return (
                                            <CommandItem
                                                key={option.id}
                                                value={optionValue}
                                                keywords={[
                                                    optionLabel,
                                                    optionValue,
                                                ]}
                                                onSelect={() =>
                                                    handleSelect(optionValue)
                                                }
                                                className="flex items-center gap-2"
                                            >
                                                {iconRenderer && (
                                                    <>{iconRenderer(option)}</>
                                                )}
                                                <span className="flex-1">
                                                    {optionLabel}
                                                </span>
                                                <Check
                                                    className={cn(
                                                        'size-4',
                                                        value === optionValue
                                                            ? 'opacity-100'
                                                            : 'opacity-0',
                                                    )}
                                                />
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </>
    );
}
