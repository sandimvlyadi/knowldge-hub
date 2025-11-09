import { FormComboboxRest } from '@/components/form/form-combobox-rest';
import master from '@/routes/master';
import { useEffect, useState } from 'react';

interface CategoryFilterProps {
    value?: string;
    onValueChange?: (value: string) => void;
    debounceMs?: number;
}

export default function CategoryFilter({
    value = '',
    onValueChange,
    debounceMs = 500,
}: CategoryFilterProps) {
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (onValueChange && inputValue !== value) {
                onValueChange(inputValue);
            }
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [inputValue, debounceMs, onValueChange, value]);

    return (
        <FormComboboxRest
            placeholder="Select category..."
            searchPlaceholder="Search categories..."
            apiUrl={master.statuses.option.category.url()}
            value={inputValue}
            onChange={(v) => setInputValue(v)}
            valueFormatter={(option) => option.id.toString()}
        />
    );
}
