import IssueTypeFilter from './issue-type-filter';
import PriorityFilter from './priority-filter';
import ProjectFilter from './project-filter';
import QueryFilter from './query-filter';
import ReporterFilter from './reporter-filter';
import StatusFilter from './status-filter';

interface FilterParams {
    query?: string;
    project?: string[];
    issueType?: string[];
    priority?: string[];
    status?: string[];
    reporter?: string[];
}

interface FiltersProps {
    filters: FilterParams;
    onFilterChange: (
        filterType: keyof FilterParams,
        values: string | string[],
    ) => void;
}

export default function Filters({ filters, onFilterChange }: FiltersProps) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <QueryFilter
                value={filters.query}
                onValueChange={(value) => onFilterChange('query', value)}
            />
            <ProjectFilter
                selectedValues={filters.project || []}
                onValueChange={(values: string[]) =>
                    onFilterChange('project', values)
                }
            />
            <IssueTypeFilter
                selectedValues={filters.issueType || []}
                onValueChange={(values: string[]) =>
                    onFilterChange('issueType', values)
                }
            />
            <PriorityFilter
                selectedValues={filters.priority || []}
                onValueChange={(values: string[]) =>
                    onFilterChange('priority', values)
                }
            />
            <StatusFilter
                selectedValues={filters.status || []}
                onValueChange={(values: string[]) =>
                    onFilterChange('status', values)
                }
            />
            <ReporterFilter
                selectedValues={filters.reporter || []}
                onValueChange={(values: string[]) =>
                    onFilterChange('reporter', values)
                }
            />
        </div>
    );
}
