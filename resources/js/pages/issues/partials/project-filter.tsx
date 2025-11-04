import { MultiSelect, MultiSelectOption } from '@/components/multi-select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import issues from '@/routes/issues';
import { Project as ProjectResponse } from '@/types/issue';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

async function getOptions(): Promise<ProjectResponse[]> {
    const response = await axios.get(issues.options.project.url(), {
        withCredentials: true,
    });

    return response.data;
}

const ItemIcon = ({ item }: { item: ProjectResponse }) => (
    <Avatar className="h-6 w-6">
        <AvatarImage src={item.avatarUrls['48x48']} alt={item.name} />
        <AvatarFallback>{item.key}</AvatarFallback>
    </Avatar>
);

interface ProjectFilterProps {
    selectedValues?: string[];
    onValueChange?: (values: string[]) => void;
}

export default function ProjectFilter({
    selectedValues = [],
    onValueChange,
}: ProjectFilterProps) {
    const [options, setOptions] = useState<MultiSelectOption[]>([]);

    const fetchData = useCallback(async () => {
        try {
            const result = await getOptions();

            setOptions(
                result.map((item) => ({
                    label: item.name,
                    value: item.name,
                    icon: ({ className }: { className?: string }) => (
                        <ItemIcon item={item} />
                    ),
                })),
            );
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <MultiSelect
            options={options}
            onValueChange={onValueChange || (() => {})}
            defaultValue={selectedValues}
            placeholder="Filter by Project"
            maxCount={1}
            responsive
            singleLine
        />
    );
}
