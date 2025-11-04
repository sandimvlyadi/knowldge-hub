import { MultiSelect, MultiSelectOption } from '@/components/multi-select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import issues from '@/routes/issues';
import { IssueType as IssueTypeResponse } from '@/types/issue';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

async function getOptions(): Promise<IssueTypeResponse[]> {
    const response = await axios.get(issues.options.issuetype.url(), {
        withCredentials: true,
    });

    return response.data;
}

const ItemIcon = ({ item }: { item: IssueTypeResponse }) => (
    <Avatar className="h-4 w-4">
        <AvatarImage src={item.iconUrl} alt={item.name} />
        <AvatarFallback>{item.name}</AvatarFallback>
    </Avatar>
);

interface IssueTypeFilterProps {
    selectedValues?: string[];
    onValueChange?: (values: string[]) => void;
}

export default function IssueTypeFilter({
    selectedValues = [],
    onValueChange,
}: IssueTypeFilterProps) {
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
            placeholder="Filter by Issue Type"
            maxCount={1}
            responsive
            singleLine
        />
    );
}
