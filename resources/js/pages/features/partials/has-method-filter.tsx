import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface HasMethodFilterProps {
    value?: boolean;
    onValueChange?: (value: boolean) => void;
}

export default function HasMethodFilter({
    value,
    onValueChange,
}: HasMethodFilterProps) {
    return (
        <Select
            value={value?.toString()}
            onValueChange={(val) => onValueChange?.(val === 'true')}
        >
            <SelectTrigger>
                <SelectValue placeholder="Has Method" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
            </SelectContent>
        </Select>
    );
}
