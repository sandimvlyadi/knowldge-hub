import { cva, type VariantProps } from 'class-variance-authority';
import {
    CheckIcon,
    ChevronDown,
    WandSparkles,
    XCircle,
    XIcon,
} from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

/**
 * Animation types and configurations
 */
export interface AnimationConfig {
    /** Badge animation type */
    badgeAnimation?: 'bounce' | 'pulse' | 'wiggle' | 'fade' | 'slide' | 'none';
    /** Popover animation type */
    popoverAnimation?: 'scale' | 'slide' | 'fade' | 'flip' | 'none';
    /** Option hover animation type */
    optionHoverAnimation?: 'highlight' | 'scale' | 'glow' | 'none';
    /** Animation duration in seconds */
    duration?: number;
    /** Animation delay in seconds */
    delay?: number;
}

/**
 * Variants for the multi-select component to handle different styles.
 * Uses class-variance-authority (cva) to define different styles based on "variant" prop.
 */
const multiSelectVariants = cva('m-1 transition-all duration-300 ease-in-out', {
    variants: {
        variant: {
            default:
                'border-foreground/10 text-foreground bg-card hover:bg-card/80',
            secondary:
                'border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80',
            destructive:
                'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
            inverted: 'inverted',
        },
        badgeAnimation: {
            bounce: 'hover:-translate-y-1 hover:scale-110',
            pulse: 'hover:animate-pulse',
            wiggle: 'hover:animate-wiggle',
            fade: 'hover:opacity-80',
            slide: 'hover:translate-x-1',
            none: '',
        },
    },
    defaultVariants: {
        variant: 'default',
        badgeAnimation: 'bounce',
    },
});

/**
 * Option interface from REST API
 */
export interface MultiSelectRestOption {
    id: number;
    ref_id: string;
    name: string;
    /** Optional icon component to display alongside the option. */
    icon?: React.ComponentType<{ className?: string }>;
    /** Whether this option is disabled */
    disabled?: boolean;
    /** Custom styling for the option */
    style?: {
        /** Custom badge color */
        badgeColor?: string;
        /** Custom icon color */
        iconColor?: string;
        /** Gradient background for badge */
        gradient?: string;
    };
    [key: string]: any; // untuk field tambahan seperti key, color_name, dll
}

/**
 * Response interface from REST API
 */
export interface MultiSelectRestResponse {
    current_page: number;
    data: MultiSelectRestOption[];
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

/**
 * Props for MultiSelectRest component
 */
interface MultiSelectRestProps
    extends Omit<
            React.ButtonHTMLAttributes<HTMLButtonElement>,
            'animationConfig' | 'value' | 'onChange'
        >,
        VariantProps<typeof multiSelectVariants> {
    /**
     * REST API URL to fetch options from
     */
    apiUrl: string;

    /**
     * Callback function triggered when the selected values change.
     * Receives an array of the new selected values.
     */
    onValueChange: (value: string[]) => void;

    /** The default selected values when the component mounts. */
    defaultValue?: string[];

    /** The controlled value */
    value?: string[];

    /**
     * Placeholder text to be displayed when no values are selected.
     * Optional, defaults to "Select options".
     */
    placeholder?: string;

    /**
     * Search placeholder text.
     * Optional, defaults to "Search options...".
     */
    searchPlaceholder?: string;

    /**
     * Animation duration in seconds for the visual effects (e.g., bouncing badges).
     * Optional, defaults to 0 (no animation).
     */
    animation?: number;

    /**
     * Advanced animation configuration for different component parts.
     * Optional, allows fine-tuning of various animation effects.
     */
    animationConfig?: AnimationConfig;

    /**
     * Maximum number of items to display. Extra selected items will be summarized.
     * Optional, defaults to 3.
     */
    maxCount?: number;

    /**
     * The modality of the popover. When set to true, interaction with outside elements
     * will be disabled and only popover content will be visible to screen readers.
     * Optional, defaults to false.
     */
    modalPopover?: boolean;

    /**
     * If true, renders the multi-select component as a child of another component.
     * Optional, defaults to false.
     */
    asChild?: boolean;

    /**
     * Additional class names to apply custom styles to the multi-select component.
     * Optional, can be used to add custom styles.
     */
    className?: string;

    /**
     * If true, disables the select all functionality.
     * Optional, defaults to false.
     */
    hideSelectAll?: boolean;

    /**
     * If true, shows search functionality in the popover.
     * If false, hides the search input completely.
     * Optional, defaults to true.
     */
    searchable?: boolean;

    /**
     * Custom empty state message when no options match search.
     * Optional, defaults to "No results found."
     */
    emptyIndicator?: React.ReactNode;

    /**
     * If true, allows the component to grow and shrink with its content.
     * If false, uses fixed width behavior.
     * Optional, defaults to false.
     */
    autoSize?: boolean;

    /**
     * If true, shows badges in a single line with horizontal scroll.
     * If false, badges wrap to multiple lines.
     * Optional, defaults to false.
     */
    singleLine?: boolean;

    /**
     * Custom CSS class for the popover content.
     * Optional, can be used to customize popover appearance.
     */
    popoverClassName?: string;

    /**
     * If true, disables the component completely.
     * Optional, defaults to false.
     */
    disabled?: boolean;

    /**
     * Responsive configuration for different screen sizes.
     * Allows customizing maxCount and other properties based on viewport.
     * Can be boolean true for default responsive behavior or an object for custom configuration.
     */
    responsive?:
        | boolean
        | {
              /** Configuration for mobile devices (< 640px) */
              mobile?: {
                  maxCount?: number;
                  hideIcons?: boolean;
                  compactMode?: boolean;
              };
              /** Configuration for tablet devices (640px - 1024px) */
              tablet?: {
                  maxCount?: number;
                  hideIcons?: boolean;
                  compactMode?: boolean;
              };
              /** Configuration for desktop devices (> 1024px) */
              desktop?: {
                  maxCount?: number;
                  hideIcons?: boolean;
                  compactMode?: boolean;
              };
          };

    /**
     * Minimum width for the component.
     * Optional, defaults to auto-sizing based on content.
     * When set, component will not shrink below this width.
     */
    minWidth?: string;

    /**
     * Maximum width for the component.
     * Optional, defaults to 100% of container.
     * Component will not exceed container boundaries.
     */
    maxWidth?: string;

    /**
     * If true, the component will reset its internal state when defaultValue changes.
     * Useful for React Hook Form integration and form reset functionality.
     * Optional, defaults to true.
     */
    resetOnDefaultValueChange?: boolean;

    /**
     * If true, automatically closes the popover after selecting an option.
     * Useful for single-selection-like behavior or mobile UX.
     * Optional, defaults to false.
     */
    closeOnSelect?: boolean;

    /**
     * Debounce delay in milliseconds for search input.
     * Optional, defaults to 300.
     */
    debounceDelay?: number;

    /**
     * Custom formatter untuk label jika tidak menggunakan 'name'
     */
    labelFormatter?: (option: MultiSelectRestOption) => string;

    /**
     * Custom formatter untuk value jika tidak menggunakan 'ref_id'
     */
    valueFormatter?: (option: MultiSelectRestOption) => string;

    /**
     * Icon renderer berdasarkan option
     */
    iconRenderer?: (option: MultiSelectRestOption) => React.ReactNode;

    /**
     * Query params tambahan
     */
    additionalParams?: Record<string, string>;

    /**
     * Name attribute for form submission
     */
    name?: string;

    /**
     * Required attribute for form validation
     */
    required?: boolean;
}

/**
 * Imperative methods exposed through ref
 */
export interface MultiSelectRestRef {
    /**
     * Programmatically reset the component to its default value
     */
    reset: () => void;
    /**
     * Get current selected values
     */
    getSelectedValues: () => string[];
    /**
     * Set selected values programmatically
     */
    setSelectedValues: (values: string[]) => void;
    /**
     * Clear all selected values
     */
    clear: () => void;
    /**
     * Focus the component
     */
    focus: () => void;
    /**
     * Refresh options from API
     */
    refresh: () => void;
}

export const MultiSelectRest = React.forwardRef<
    MultiSelectRestRef,
    MultiSelectRestProps
>(
    (
        {
            apiUrl,
            onValueChange,
            variant,
            defaultValue = [],
            value: controlledValue,
            placeholder = 'Select options',
            searchPlaceholder = 'Search options...',
            animation = 0,
            animationConfig,
            maxCount = 3,
            modalPopover = false,
            asChild = false,
            className,
            hideSelectAll = false,
            searchable = true,
            emptyIndicator,
            autoSize = false,
            singleLine = false,
            popoverClassName,
            disabled = false,
            responsive,
            minWidth,
            maxWidth,
            resetOnDefaultValueChange = true,
            closeOnSelect = false,
            debounceDelay = 300,
            labelFormatter,
            valueFormatter,
            iconRenderer,
            additionalParams = {},
            name,
            required,
            ...props
        },
        ref,
    ) => {
        const [internalValue, setInternalValue] =
            React.useState<string[]>(defaultValue);
        const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
        const [isAnimating, setIsAnimating] = React.useState(false);
        const [searchValue, setSearchValue] = React.useState('');
        const [options, setOptions] = React.useState<MultiSelectRestOption[]>(
            [],
        );
        const [isLoading, setIsLoading] = React.useState(false);

        const selectedValues =
            controlledValue !== undefined ? controlledValue : internalValue;

        const [politeMessage, setPoliteMessage] = React.useState('');
        const [assertiveMessage, setAssertiveMessage] = React.useState('');
        const prevSelectedCount = React.useRef(selectedValues.length);
        const prevIsOpen = React.useRef(isPopoverOpen);
        const prevSearchValue = React.useRef(searchValue);

        const hiddenInputRef = React.useRef<HTMLInputElement>(null);
        const abortControllerRef = React.useRef<AbortController | null>(null);

        const announce = React.useCallback(
            (message: string, priority: 'polite' | 'assertive' = 'polite') => {
                if (priority === 'assertive') {
                    setAssertiveMessage(message);
                    setTimeout(() => setAssertiveMessage(''), 100);
                } else {
                    setPoliteMessage(message);
                    setTimeout(() => setPoliteMessage(''), 100);
                }
            },
            [],
        );

        const multiSelectId = React.useId();
        const listboxId = `${multiSelectId}-listbox`;
        const triggerDescriptionId = `${multiSelectId}-description`;
        const selectedCountId = `${multiSelectId}-count`;

        const prevDefaultValueRef = React.useRef<string[]>(defaultValue);

        const arraysEqual = React.useCallback(
            (a: string[], b: string[]): boolean => {
                if (a.length !== b.length) return false;
                const sortedA = [...a].sort();
                const sortedB = [...b].sort();
                return sortedA.every((val, index) => val === sortedB[index]);
            },
            [],
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

                    const response = await fetch(
                        `${apiUrl}?${params.toString()}`,
                        {
                            signal: abortControllerRef.current.signal,
                        },
                    );

                    if (!response.ok) {
                        throw new Error('Failed to fetch options');
                    }

                    const data: MultiSelectRestResponse = await response.json();
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

        // Debounce search query
        React.useEffect(() => {
            const timer = setTimeout(() => {
                fetchOptions(searchValue);
            }, debounceDelay);

            return () => clearTimeout(timer);
        }, [searchValue, debounceDelay]);

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

        // Helper functions untuk get label dan value
        const getOptionLabel = (option: MultiSelectRestOption) => {
            return labelFormatter ? labelFormatter(option) : option.name;
        };

        const getOptionValue = (option: MultiSelectRestOption) => {
            return valueFormatter ? valueFormatter(option) : option.ref_id;
        };

        const resetToDefault = React.useCallback(() => {
            const newValue = defaultValue;
            if (controlledValue === undefined) {
                setInternalValue(newValue);
            }
            setIsPopoverOpen(false);
            setSearchValue('');
            onValueChange(newValue);
        }, [defaultValue, onValueChange, controlledValue]);

        const buttonRef = React.useRef<HTMLButtonElement>(null);

        React.useImperativeHandle(
            ref,
            () => ({
                reset: resetToDefault,
                getSelectedValues: () => selectedValues,
                setSelectedValues: (values: string[]) => {
                    if (controlledValue === undefined) {
                        setInternalValue(values);
                    }
                    onValueChange(values);
                },
                clear: () => {
                    if (controlledValue === undefined) {
                        setInternalValue([]);
                    }
                    onValueChange([]);
                },
                focus: () => {
                    if (buttonRef.current) {
                        buttonRef.current.focus();
                        const originalOutline = buttonRef.current.style.outline;
                        const originalOutlineOffset =
                            buttonRef.current.style.outlineOffset;
                        buttonRef.current.style.outline =
                            '2px solid hsl(var(--ring))';
                        buttonRef.current.style.outlineOffset = '2px';
                        setTimeout(() => {
                            if (buttonRef.current) {
                                buttonRef.current.style.outline =
                                    originalOutline;
                                buttonRef.current.style.outlineOffset =
                                    originalOutlineOffset;
                            }
                        }, 1000);
                    }
                },
                refresh: () => {
                    fetchOptions(searchValue);
                },
            }),
            [
                resetToDefault,
                selectedValues,
                onValueChange,
                controlledValue,
                fetchOptions,
                searchValue,
            ],
        );

        const [screenSize, setScreenSize] = React.useState<
            'mobile' | 'tablet' | 'desktop'
        >('desktop');

        React.useEffect(() => {
            if (typeof window === 'undefined') return;
            const handleResize = () => {
                const width = window.innerWidth;
                if (width < 640) {
                    setScreenSize('mobile');
                } else if (width < 1024) {
                    setScreenSize('tablet');
                } else {
                    setScreenSize('desktop');
                }
            };
            handleResize();
            window.addEventListener('resize', handleResize);
            return () => {
                if (typeof window !== 'undefined') {
                    window.removeEventListener('resize', handleResize);
                }
            };
        }, []);

        const getResponsiveSettings = () => {
            if (!responsive) {
                return {
                    maxCount: maxCount,
                    hideIcons: false,
                    compactMode: false,
                };
            }
            if (responsive === true) {
                const defaultResponsive = {
                    mobile: {
                        maxCount: maxCount ?? 2,
                        hideIcons: false,
                        compactMode: true,
                    },
                    tablet: {
                        maxCount: maxCount ?? 4,
                        hideIcons: false,
                        compactMode: false,
                    },
                    desktop: {
                        maxCount: maxCount ?? 6,
                        hideIcons: false,
                        compactMode: false,
                    },
                };
                const currentSettings = defaultResponsive[screenSize];
                return {
                    maxCount: currentSettings?.maxCount ?? maxCount,
                    hideIcons: currentSettings?.hideIcons ?? false,
                    compactMode: currentSettings?.compactMode ?? false,
                };
            }
            const currentSettings = responsive[screenSize];
            return {
                maxCount: currentSettings?.maxCount ?? maxCount,
                hideIcons: currentSettings?.hideIcons ?? false,
                compactMode: currentSettings?.compactMode ?? false,
            };
        };

        const responsiveSettings = getResponsiveSettings();

        const getBadgeAnimationClass = () => {
            if (animationConfig?.badgeAnimation) {
                switch (animationConfig.badgeAnimation) {
                    case 'bounce':
                        return isAnimating
                            ? 'animate-bounce'
                            : 'hover:-translate-y-1 hover:scale-110';
                    case 'pulse':
                        return 'hover:animate-pulse';
                    case 'wiggle':
                        return 'hover:animate-wiggle';
                    case 'fade':
                        return 'hover:opacity-80';
                    case 'slide':
                        return 'hover:translate-x-1';
                    case 'none':
                        return '';
                    default:
                        return '';
                }
            }
            return isAnimating ? 'animate-bounce' : '';
        };

        const getPopoverAnimationClass = () => {
            if (animationConfig?.popoverAnimation) {
                switch (animationConfig.popoverAnimation) {
                    case 'scale':
                        return 'animate-scaleIn';
                    case 'slide':
                        return 'animate-slideInDown';
                    case 'fade':
                        return 'animate-fadeIn';
                    case 'flip':
                        return 'animate-flipIn';
                    case 'none':
                        return '';
                    default:
                        return '';
                }
            }
            return '';
        };

        const getOptionByValue = React.useCallback(
            (value: string): MultiSelectRestOption | undefined => {
                const option = options.find(
                    (option) => getOptionValue(option) === value,
                );
                if (!option && process.env.NODE_ENV === 'development') {
                    console.warn(
                        `MultiSelectRest: Option with value "${value}" not found in options list`,
                    );
                }
                return option;
            },
            [options, getOptionValue],
        );

        const handleInputKeyDown = (
            event: React.KeyboardEvent<HTMLInputElement>,
        ) => {
            if (event.key === 'Enter') {
                setIsPopoverOpen(true);
            } else if (
                event.key === 'Backspace' &&
                !event.currentTarget.value
            ) {
                const newSelectedValues = [...selectedValues];
                newSelectedValues.pop();
                if (controlledValue === undefined) {
                    setInternalValue(newSelectedValues);
                }
                onValueChange(newSelectedValues);
            }
        };

        const toggleOption = (optionValue: string) => {
            if (disabled) return;
            const option = getOptionByValue(optionValue);
            if (option?.disabled) return;
            const newSelectedValues = selectedValues.includes(optionValue)
                ? selectedValues.filter((value) => value !== optionValue)
                : [...selectedValues, optionValue];
            if (controlledValue === undefined) {
                setInternalValue(newSelectedValues);
            }
            onValueChange(newSelectedValues);

            // Trigger native input change event untuk form
            if (hiddenInputRef.current) {
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLInputElement.prototype,
                    'value',
                )?.set;
                nativeInputValueSetter?.call(
                    hiddenInputRef.current,
                    JSON.stringify(newSelectedValues),
                );

                const event = new Event('input', { bubbles: true });
                hiddenInputRef.current.dispatchEvent(event);
            }

            if (closeOnSelect) {
                setIsPopoverOpen(false);
            }
        };

        const handleClear = () => {
            if (disabled) return;
            if (controlledValue === undefined) {
                setInternalValue([]);
            }
            onValueChange([]);
        };

        const handleTogglePopover = () => {
            if (disabled) return;
            setIsPopoverOpen((prev) => !prev);
        };

        const clearExtraOptions = () => {
            if (disabled) return;
            const newSelectedValues = selectedValues.slice(
                0,
                responsiveSettings.maxCount,
            );
            if (controlledValue === undefined) {
                setInternalValue(newSelectedValues);
            }
            onValueChange(newSelectedValues);
        };

        const toggleAll = () => {
            if (disabled) return;
            const allOptions = options.filter((option) => !option.disabled);
            const allValues = allOptions.map((option) =>
                getOptionValue(option),
            );
            if (selectedValues.length === allValues.length) {
                handleClear();
            } else {
                if (controlledValue === undefined) {
                    setInternalValue(allValues);
                }
                onValueChange(allValues);
            }

            if (closeOnSelect) {
                setIsPopoverOpen(false);
            }
        };

        React.useEffect(() => {
            if (!resetOnDefaultValueChange) return;
            const prevDefaultValue = prevDefaultValueRef.current;
            if (!arraysEqual(prevDefaultValue, defaultValue)) {
                if (!arraysEqual(selectedValues, defaultValue)) {
                    if (controlledValue === undefined) {
                        setInternalValue(defaultValue);
                    }
                }
                prevDefaultValueRef.current = [...defaultValue];
            }
        }, [
            defaultValue,
            selectedValues,
            arraysEqual,
            resetOnDefaultValueChange,
            controlledValue,
        ]);

        const getWidthConstraints = () => {
            const defaultMinWidth = screenSize === 'mobile' ? '0px' : '200px';
            const effectiveMinWidth = minWidth || defaultMinWidth;
            const effectiveMaxWidth = maxWidth || '100%';
            return {
                minWidth: effectiveMinWidth,
                maxWidth: effectiveMaxWidth,
                width: autoSize ? 'auto' : '100%',
            };
        };

        const widthConstraints = getWidthConstraints();

        React.useEffect(() => {
            if (!isPopoverOpen) {
                setSearchValue('');
            }
        }, [isPopoverOpen]);

        React.useEffect(() => {
            const selectedCount = selectedValues.length;
            const totalOptions = options.filter((opt) => !opt.disabled).length;
            if (selectedCount !== prevSelectedCount.current) {
                const diff = selectedCount - prevSelectedCount.current;
                if (diff > 0) {
                    const addedItems = selectedValues.slice(-diff);
                    const addedLabels = addedItems
                        .map(
                            (value) =>
                                options.find(
                                    (opt) => getOptionValue(opt) === value,
                                )?.name,
                        )
                        .filter(Boolean);

                    if (addedLabels.length === 1) {
                        announce(
                            `${addedLabels[0]} selected. ${selectedCount} of ${totalOptions} options selected.`,
                        );
                    } else {
                        announce(
                            `${addedLabels.length} options selected. ${selectedCount} of ${totalOptions} total selected.`,
                        );
                    }
                } else if (diff < 0) {
                    announce(
                        `Option removed. ${selectedCount} of ${totalOptions} options selected.`,
                    );
                }
                prevSelectedCount.current = selectedCount;
            }

            if (isPopoverOpen !== prevIsOpen.current) {
                if (isPopoverOpen) {
                    announce(
                        `Dropdown opened. ${totalOptions} options available. Use arrow keys to navigate.`,
                    );
                } else {
                    announce('Dropdown closed.');
                }
                prevIsOpen.current = isPopoverOpen;
            }

            if (
                searchValue !== prevSearchValue.current &&
                searchValue !== undefined
            ) {
                if (searchValue && isPopoverOpen) {
                    announce(
                        `${options.length} option${
                            options.length === 1 ? '' : 's'
                        } found for "${searchValue}"`,
                    );
                }
                prevSearchValue.current = searchValue;
            }
        }, [
            selectedValues,
            isPopoverOpen,
            searchValue,
            announce,
            options,
            getOptionValue,
        ]);

        return (
            <>
                <div className="sr-only">
                    <div aria-live="polite" aria-atomic="true" role="status">
                        {politeMessage}
                    </div>
                    <div aria-live="assertive" aria-atomic="true" role="alert">
                        {assertiveMessage}
                    </div>
                </div>

                {/* Hidden input untuk form submission */}
                {name && (
                    <input
                        ref={hiddenInputRef}
                        type="hidden"
                        name={name}
                        value={JSON.stringify(selectedValues)}
                        required={required}
                    />
                )}

                <Popover
                    open={isPopoverOpen}
                    onOpenChange={setIsPopoverOpen}
                    modal={modalPopover}
                >
                    <div id={triggerDescriptionId} className="sr-only">
                        Multi-select dropdown. Use arrow keys to navigate, Enter
                        to select, and Escape to close.
                    </div>
                    <div
                        id={selectedCountId}
                        className="sr-only"
                        aria-live="polite"
                    >
                        {selectedValues.length === 0
                            ? 'No options selected'
                            : `${selectedValues.length} option${
                                  selectedValues.length === 1 ? '' : 's'
                              } selected: ${selectedValues
                                  .map((value) => getOptionByValue(value)?.name)
                                  .filter(Boolean)
                                  .join(', ')}`}
                    </div>

                    <PopoverTrigger asChild>
                        <Button
                            ref={buttonRef}
                            {...props}
                            onClick={handleTogglePopover}
                            disabled={disabled}
                            role="combobox"
                            aria-expanded={isPopoverOpen}
                            aria-haspopup="listbox"
                            aria-controls={
                                isPopoverOpen ? listboxId : undefined
                            }
                            aria-describedby={`${triggerDescriptionId} ${selectedCountId}`}
                            aria-label={`Multi-select: ${selectedValues.length} of ${options.length} options selected. ${placeholder}`}
                            className={cn(
                                'flex h-auto min-h-10 items-center justify-between rounded-md border bg-inherit p-1 hover:bg-inherit [&_svg]:pointer-events-auto',
                                autoSize ? 'w-auto' : 'w-full',
                                responsiveSettings.compactMode &&
                                    'min-h-8 text-sm',
                                screenSize === 'mobile' && 'min-h-12 text-base',
                                disabled && 'cursor-not-allowed opacity-50',
                                className,
                            )}
                            style={{
                                ...widthConstraints,
                                maxWidth: `min(${widthConstraints.maxWidth}, 100%)`,
                            }}
                        >
                            {selectedValues.length > 0 ? (
                                <div className="flex w-full items-center justify-between">
                                    <div
                                        className={cn(
                                            'flex items-center gap-1',
                                            singleLine
                                                ? 'multiselect-singleline-scroll overflow-x-auto'
                                                : 'flex-wrap',
                                            responsiveSettings.compactMode &&
                                                'gap-0.5',
                                        )}
                                        style={
                                            singleLine
                                                ? {
                                                      paddingBottom: '4px',
                                                  }
                                                : {}
                                        }
                                    >
                                        {selectedValues
                                            .slice(
                                                0,
                                                responsiveSettings.maxCount,
                                            )
                                            .map((value) => {
                                                const option =
                                                    getOptionByValue(value);
                                                const customStyle =
                                                    option?.style;
                                                if (!option) {
                                                    return null;
                                                }
                                                const badgeStyle: React.CSSProperties =
                                                    {
                                                        animationDuration: `${animation}s`,
                                                        ...(customStyle?.badgeColor && {
                                                            backgroundColor:
                                                                customStyle.badgeColor,
                                                        }),
                                                        ...(customStyle?.gradient && {
                                                            background:
                                                                customStyle.gradient,
                                                            color: 'white',
                                                        }),
                                                    };
                                                return (
                                                    <Badge
                                                        key={value}
                                                        className={cn(
                                                            getBadgeAnimationClass(),
                                                            multiSelectVariants(
                                                                { variant },
                                                            ),
                                                            customStyle?.gradient &&
                                                                'border-transparent text-white',
                                                            responsiveSettings.compactMode &&
                                                                'px-1.5 py-0.5 text-xs',
                                                            screenSize ===
                                                                'mobile' &&
                                                                'max-w-[120px] truncate',
                                                            singleLine &&
                                                                'flex-shrink-0 whitespace-nowrap',
                                                            '[&>svg]:pointer-events-auto',
                                                        )}
                                                        style={{
                                                            ...badgeStyle,
                                                            animationDuration: `${
                                                                animationConfig?.duration ||
                                                                animation
                                                            }s`,
                                                            animationDelay: `${animationConfig?.delay || 0}s`,
                                                        }}
                                                    >
                                                        {option.icon &&
                                                            !responsiveSettings.hideIcons && (
                                                                <option.icon
                                                                    className={cn(
                                                                        'mr-2 h-4 w-4',
                                                                        responsiveSettings.compactMode &&
                                                                            'mr-1 h-3 w-3',
                                                                        customStyle?.iconColor &&
                                                                            'text-current',
                                                                    )}
                                                                    {...(customStyle?.iconColor && {
                                                                        style: {
                                                                            color: customStyle.iconColor,
                                                                        },
                                                                    })}
                                                                />
                                                            )}
                                                        {iconRenderer &&
                                                            !responsiveSettings.hideIcons && (
                                                                <>
                                                                    {iconRenderer(
                                                                        option,
                                                                    )}
                                                                </>
                                                            )}
                                                        <span
                                                            className={cn(
                                                                screenSize ===
                                                                    'mobile' &&
                                                                    'truncate',
                                                            )}
                                                        >
                                                            {getOptionLabel(
                                                                option,
                                                            )}
                                                        </span>
                                                        <div
                                                            role="button"
                                                            tabIndex={0}
                                                            onClick={(
                                                                event,
                                                            ) => {
                                                                event.stopPropagation();
                                                                toggleOption(
                                                                    value,
                                                                );
                                                            }}
                                                            onKeyDown={(
                                                                event,
                                                            ) => {
                                                                if (
                                                                    event.key ===
                                                                        'Enter' ||
                                                                    event.key ===
                                                                        ' '
                                                                ) {
                                                                    event.preventDefault();
                                                                    event.stopPropagation();
                                                                    toggleOption(
                                                                        value,
                                                                    );
                                                                }
                                                            }}
                                                            aria-label={`Remove ${getOptionLabel(option)} from selection`}
                                                            className="ml-2 h-4 w-4 cursor-pointer rounded-sm hover:bg-white/20 focus:ring-1 focus:ring-white/50 focus:outline-none"
                                                        >
                                                            <XCircle
                                                                className={cn(
                                                                    'h-3 w-3',
                                                                    responsiveSettings.compactMode &&
                                                                        'h-2.5 w-2.5',
                                                                )}
                                                            />
                                                        </div>
                                                    </Badge>
                                                );
                                            })
                                            .filter(Boolean)}
                                        {selectedValues.length >
                                            responsiveSettings.maxCount && (
                                            <Badge
                                                className={cn(
                                                    'border-foreground/1 bg-transparent text-foreground hover:bg-transparent',
                                                    getBadgeAnimationClass(),
                                                    multiSelectVariants({
                                                        variant,
                                                    }),
                                                    responsiveSettings.compactMode &&
                                                        'px-1.5 py-0.5 text-xs',
                                                    singleLine &&
                                                        'flex-shrink-0 whitespace-nowrap',
                                                    '[&>svg]:pointer-events-auto',
                                                )}
                                                style={{
                                                    animationDuration: `${
                                                        animationConfig?.duration ||
                                                        animation
                                                    }s`,
                                                    animationDelay: `${animationConfig?.delay || 0}s`,
                                                }}
                                            >
                                                {`+ ${
                                                    selectedValues.length -
                                                    responsiveSettings.maxCount
                                                } more`}
                                                <XCircle
                                                    className={cn(
                                                        'ml-2 h-4 w-4 cursor-pointer',
                                                        responsiveSettings.compactMode &&
                                                            'ml-1 h-3 w-3',
                                                    )}
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        clearExtraOptions();
                                                    }}
                                                />
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div
                                            role="button"
                                            tabIndex={0}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleClear();
                                            }}
                                            onKeyDown={(event) => {
                                                if (
                                                    event.key === 'Enter' ||
                                                    event.key === ' '
                                                ) {
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                    handleClear();
                                                }
                                            }}
                                            aria-label={`Clear all ${selectedValues.length} selected options`}
                                            className="mx-2 flex h-4 w-4 cursor-pointer items-center justify-center rounded-sm text-muted-foreground hover:text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:outline-none"
                                        >
                                            <XIcon className="h-4 w-4" />
                                        </div>
                                        <Separator
                                            orientation="vertical"
                                            className="flex h-full min-h-6"
                                        />
                                        <ChevronDown
                                            className="mx-2 h-4 cursor-pointer text-muted-foreground"
                                            aria-hidden="true"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="mx-auto flex w-full items-center justify-between">
                                    <span className="mx-3 text-sm text-muted-foreground">
                                        {placeholder}
                                    </span>
                                    <ChevronDown className="mx-2 h-4 cursor-pointer text-muted-foreground" />
                                </div>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        id={listboxId}
                        role="listbox"
                        aria-multiselectable="true"
                        aria-label="Available options"
                        className={cn(
                            'w-auto p-0',
                            getPopoverAnimationClass(),
                            screenSize === 'mobile' && 'w-[85vw] max-w-[280px]',
                            screenSize === 'tablet' && 'w-[70vw] max-w-md',
                            screenSize === 'desktop' && 'min-w-[300px]',
                            popoverClassName,
                        )}
                        style={{
                            animationDuration: `${animationConfig?.duration || animation}s`,
                            animationDelay: `${animationConfig?.delay || 0}s`,
                            maxWidth: `min(${widthConstraints.maxWidth}, 85vw)`,
                            maxHeight:
                                screenSize === 'mobile' ? '70vh' : '60vh',
                            touchAction: 'manipulation',
                        }}
                        align="start"
                        onEscapeKeyDown={() => setIsPopoverOpen(false)}
                    >
                        <Command shouldFilter={false}>
                            {searchable && (
                                <CommandInput
                                    placeholder={searchPlaceholder}
                                    onKeyDown={handleInputKeyDown}
                                    value={searchValue}
                                    onValueChange={setSearchValue}
                                    aria-label="Search through available options"
                                    aria-describedby={`${multiSelectId}-search-help`}
                                />
                            )}
                            {searchable && (
                                <div
                                    id={`${multiSelectId}-search-help`}
                                    className="sr-only"
                                >
                                    Type to filter options. Use arrow keys to
                                    navigate results.
                                </div>
                            )}
                            <CommandList
                                className={cn(
                                    'multiselect-scrollbar max-h-[40vh] overflow-y-auto',
                                    screenSize === 'mobile' && 'max-h-[50vh]',
                                    'overscroll-behavior-y-contain',
                                )}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center py-6">
                                        <Spinner className="me-1" /> Loading...
                                    </div>
                                ) : options.length === 0 ? (
                                    <div className="py-6 text-center text-sm text-muted-foreground">
                                        {emptyIndicator || 'No results found.'}
                                    </div>
                                ) : (
                                    <>
                                        {!hideSelectAll && !searchValue && (
                                            <CommandGroup>
                                                <CommandItem
                                                    key="all"
                                                    onSelect={toggleAll}
                                                    role="option"
                                                    aria-selected={
                                                        selectedValues.length ===
                                                        options.filter(
                                                            (opt) =>
                                                                !opt.disabled,
                                                        ).length
                                                    }
                                                    aria-label={`Select all ${options.length} options`}
                                                    className="cursor-pointer"
                                                >
                                                    <div
                                                        className={cn(
                                                            'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                                            selectedValues.length ===
                                                                options.filter(
                                                                    (opt) =>
                                                                        !opt.disabled,
                                                                ).length
                                                                ? 'bg-primary text-primary-foreground'
                                                                : 'opacity-50 [&_svg]:invisible',
                                                        )}
                                                        aria-hidden="true"
                                                    >
                                                        <CheckIcon className="h-4 w-4" />
                                                    </div>
                                                    <span>
                                                        (Select All
                                                        {options.length > 20
                                                            ? ` - ${options.length} options`
                                                            : ''}
                                                        )
                                                    </span>
                                                </CommandItem>
                                            </CommandGroup>
                                        )}
                                        <CommandGroup>
                                            {options.map((option) => {
                                                const isSelected =
                                                    selectedValues.includes(
                                                        getOptionValue(option),
                                                    );
                                                return (
                                                    <CommandItem
                                                        key={option.id}
                                                        onSelect={() =>
                                                            toggleOption(
                                                                getOptionValue(
                                                                    option,
                                                                ),
                                                            )
                                                        }
                                                        role="option"
                                                        aria-selected={
                                                            isSelected
                                                        }
                                                        aria-disabled={
                                                            option.disabled
                                                        }
                                                        aria-label={`${getOptionLabel(option)}${
                                                            isSelected
                                                                ? ', selected'
                                                                : ', not selected'
                                                        }${option.disabled ? ', disabled' : ''}`}
                                                        className={cn(
                                                            'cursor-pointer',
                                                            option.disabled &&
                                                                'cursor-not-allowed opacity-50',
                                                        )}
                                                        disabled={
                                                            option.disabled
                                                        }
                                                    >
                                                        <div
                                                            className={cn(
                                                                'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                                                isSelected
                                                                    ? 'bg-primary text-primary-foreground'
                                                                    : 'opacity-50 [&_svg]:invisible',
                                                            )}
                                                            aria-hidden="true"
                                                        >
                                                            <CheckIcon className="h-4 w-4" />
                                                        </div>
                                                        {option.icon && (
                                                            <option.icon
                                                                className="mr-2 h-4 w-4 text-muted-foreground"
                                                                aria-hidden="true"
                                                            />
                                                        )}
                                                        {iconRenderer && (
                                                            <>
                                                                {iconRenderer(
                                                                    option,
                                                                )}
                                                            </>
                                                        )}
                                                        <span>
                                                            {getOptionLabel(
                                                                option,
                                                            )}
                                                        </span>
                                                    </CommandItem>
                                                );
                                            })}
                                        </CommandGroup>
                                        <CommandSeparator />
                                        <CommandGroup>
                                            <div className="flex items-center justify-between">
                                                {selectedValues.length > 0 && (
                                                    <>
                                                        <CommandItem
                                                            onSelect={
                                                                handleClear
                                                            }
                                                            className="flex-1 cursor-pointer justify-center"
                                                        >
                                                            Clear
                                                        </CommandItem>
                                                        <Separator
                                                            orientation="vertical"
                                                            className="flex h-full min-h-6"
                                                        />
                                                    </>
                                                )}
                                                <CommandItem
                                                    onSelect={() =>
                                                        setIsPopoverOpen(false)
                                                    }
                                                    className="max-w-full flex-1 cursor-pointer justify-center"
                                                >
                                                    Close
                                                </CommandItem>
                                            </div>
                                        </CommandGroup>
                                    </>
                                )}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                    {animation > 0 && selectedValues.length > 0 && (
                        <WandSparkles
                            className={cn(
                                'my-2 h-3 w-3 cursor-pointer bg-background text-foreground',
                                isAnimating ? '' : 'text-muted-foreground',
                            )}
                            onClick={() => setIsAnimating(!isAnimating)}
                        />
                    )}
                </Popover>
            </>
        );
    },
);

MultiSelectRest.displayName = 'MultiSelectRest';
export type { MultiSelectRestProps };
