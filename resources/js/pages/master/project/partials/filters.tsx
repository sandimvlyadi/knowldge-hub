import { Button } from '@/components/ui/button';
import ArchivedFilter from './archived-filter';
import QueryFilter from './query-filter';

interface FilterParams {
    query?: string;
    archived?: boolean;
}

interface FiltersProps {
    filters: FilterParams;
    onFilterChange: (
        filterType: keyof FilterParams,
        values: string | boolean,
    ) => void;
}

export default function Filters({ filters, onFilterChange }: FiltersProps) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <QueryFilter
                value={filters.query}
                onValueChange={(value) => onFilterChange('query', value)}
            />
            <ArchivedFilter
                value={filters.archived}
                onValueChange={(value) => onFilterChange('archived', value)}
            />
            <Button className="w-full cursor-pointer justify-self-end bg-teal-600 hover:bg-teal-700 md:col-2 lg:col-start-4 lg:w-fit">
                Add Project
            </Button>
        </div>
    );
}
