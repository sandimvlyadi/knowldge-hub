import { MultiSelectRest } from '@/components/multi-select/rest';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import master from '@/routes/master';
import { MasterPriority as PriorityOption } from '@/types/master';

interface PriorityFilterProps {
    selectedValues?: string[];
    onValueChange?: (values: string[]) => void;
}

export default function PriorityFilter({
    selectedValues = [],
    onValueChange,
}: PriorityFilterProps) {
    return (
        <MultiSelectRest
            apiUrl={master.priorities.option.url()}
            onValueChange={onValueChange || (() => {})}
            defaultValue={selectedValues}
            placeholder="Filter by Priority"
            maxCount={1}
            responsive
            singleLine
            labelFormatter={(option) => option.name}
            valueFormatter={(option) => option.name}
            iconRenderer={(option) => {
                const item = option as unknown as PriorityOption;
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
