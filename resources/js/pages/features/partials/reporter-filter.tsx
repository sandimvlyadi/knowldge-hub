import { MultiSelectRest } from '@/components/multi-select/rest';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import master from '@/routes/master';
import { MasterReporter as ReporterOption } from '@/types/master';

interface ReporterFilterProps {
    selectedValues?: string[];
    onValueChange?: (values: string[]) => void;
}

export default function ReporterFilter({
    selectedValues = [],
    onValueChange,
}: ReporterFilterProps) {
    return (
        <MultiSelectRest
            apiUrl={master.reporters.option.url()}
            onValueChange={onValueChange || (() => {})}
            defaultValue={selectedValues}
            placeholder="Filter by Reporter"
            maxCount={1}
            responsive
            singleLine
            labelFormatter={(option) => option.display_name}
            valueFormatter={(option) => option.key}
            iconRenderer={(option) => {
                const item = option as unknown as ReporterOption;
                return (
                    <Avatar className="h-4 w-4">
                        <AvatarImage src={item.avatar} alt={item.name} />
                        <AvatarFallback>{item.name}</AvatarFallback>
                    </Avatar>
                );
            }}
        />
    );
}
