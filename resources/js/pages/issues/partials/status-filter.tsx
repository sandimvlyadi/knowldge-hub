import { MultiSelect, MultiSelectOption } from '@/components/multi-select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import issues from '@/routes/issues';
import { IssueStatus as StatusResponse } from '@/types/issue';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

async function getOptions(): Promise<StatusResponse[]> {
    const response = await axios.get(issues.options.status.url(), {
        withCredentials: true,
    });

    return response.data;
}

const ItemIcon = ({ item }: { item: StatusResponse }) => (
    <Avatar className="h-4 w-4">
        <AvatarImage src={item.iconUrl} alt={item.name} />
        <AvatarFallback>{item.name}</AvatarFallback>
    </Avatar>
);

interface StatusFilterProps {
    selectedValues?: string[];
    onValueChange?: (values: string[]) => void;
}

export default function StatusFilter({
    selectedValues = [],
    onValueChange,
}: StatusFilterProps) {
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
            placeholder="Filter by Status"
            maxCount={1}
            responsive
            singleLine
        />
    );
}
