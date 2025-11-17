import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';

interface QueryFilterProps {
    value?: string;
    onValueChange?: (value: string) => void;
    debounceMs?: number;
}

export default function QueryFilter({
    value = '',
    onValueChange,
    debounceMs = 500,
}: QueryFilterProps) {
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
        <Input
            type="text"
            placeholder="Search..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
        />
    );
}
