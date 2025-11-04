import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface ArchivedFilterProps {
    value?: boolean;
    onValueChange?: (value: boolean) => void;
}

export default function ArchivedFilter({
    value,
    onValueChange,
}: ArchivedFilterProps) {
    return (
        <Select
            value={value?.toString()}
            onValueChange={(val) => onValueChange?.(val === 'true')}
        >
            <SelectTrigger>
                <SelectValue placeholder="Choose Status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="true">Archived</SelectItem>
                <SelectItem value="false">Active</SelectItem>
            </SelectContent>
        </Select>
    );
}
