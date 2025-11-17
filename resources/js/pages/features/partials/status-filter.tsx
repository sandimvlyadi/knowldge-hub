import { MultiSelectRest } from '@/components/multi-select/rest';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import master from '@/routes/master';
import { MasterStatus as StatusOption } from '@/types/master';

interface StatusFilterProps {
    selectedValues?: string[];
    onValueChange?: (values: string[]) => void;
}

export default function StatusFilter({
    selectedValues = [],
    onValueChange,
}: StatusFilterProps) {
    return (
        <MultiSelectRest
            apiUrl={master.statuses.option.url()}
            onValueChange={onValueChange || (() => {})}
            defaultValue={selectedValues}
            placeholder="Filter by Status"
            maxCount={1}
            responsive
            singleLine
            labelFormatter={(option) => option.name}
            valueFormatter={(option) => option.name}
            iconRenderer={(option) => {
                const item = option as unknown as StatusOption;
                return (
                    <Avatar className="h-4 w-4">
                        <AvatarImage src={item.icon_url} alt={item.name} />
                        <AvatarFallback>{item.name}</AvatarFallback>
                    </Avatar>
                );
            }}
        />
    );
}
