import { MultiSelectRest } from '@/components/multi-select/rest';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import master from '@/routes/master';
import { MasterIssueType as IssueTypeOption } from '@/types/master';

interface IssueTypeFilterProps {
    selectedValues?: string[];
    onValueChange?: (values: string[]) => void;
}

export default function IssueTypeFilter({
    selectedValues = [],
    onValueChange,
}: IssueTypeFilterProps) {
    return (
        <MultiSelectRest
            apiUrl={master.issuetypes.option.url()}
            onValueChange={onValueChange || (() => {})}
            defaultValue={selectedValues}
            placeholder="Filter by Issue Type"
            maxCount={1}
            responsive
            singleLine
            labelFormatter={(option) => option.name}
            valueFormatter={(option) => option.name}
            iconRenderer={(option) => {
                const item = option as unknown as IssueTypeOption;
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
