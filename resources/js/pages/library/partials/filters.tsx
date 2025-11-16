import { Button } from '@/components/ui/button';
import QueryFilter from './query-filter';

interface FilterParams {
    query?: string;
}

interface FiltersProps {
    filters: FilterParams;
    onFilterChange: (filterType: keyof FilterParams, values: string) => void;
    onAdd?: () => void;
}

export default function Filters({
    filters,
    onFilterChange,
    onAdd,
}: FiltersProps) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <QueryFilter
                value={filters.query}
                onValueChange={(value) => onFilterChange('query', value)}
            />
            <Button
                className="w-full cursor-pointer justify-self-end bg-teal-600 hover:bg-teal-700 md:col-2 lg:col-start-4 lg:w-fit"
                onClick={onAdd}
            >
                Add Library
            </Button>
        </div>
    );
}
