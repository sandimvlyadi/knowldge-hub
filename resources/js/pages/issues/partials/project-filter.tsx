import { MultiSelectRest } from '@/components/multi-select/rest';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import master from '@/routes/master';
import { MasterProject as ProjectOption } from '@/types/master';

interface ProjectFilterProps {
    selectedValues?: string[];
    onValueChange?: (values: string[]) => void;
}

export default function ProjectFilter({
    selectedValues = [],
    onValueChange,
}: ProjectFilterProps) {
    return (
        <MultiSelectRest
            apiUrl={master.projects.option.url()}
            onValueChange={onValueChange || (() => {})}
            defaultValue={selectedValues}
            placeholder="Filter by Project"
            maxCount={1}
            responsive
            singleLine
            labelFormatter={(option) => option.name}
            valueFormatter={(option) => option.name}
            iconRenderer={(option) => {
                const item = option as unknown as ProjectOption;
                return (
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={item.avatar} alt={item.name} />
                        <AvatarFallback>{item.key}</AvatarFallback>
                    </Avatar>
                );
            }}
        />
    );
}
