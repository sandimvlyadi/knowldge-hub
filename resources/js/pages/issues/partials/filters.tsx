import IssueTypeFilter from './issue-type-filter';
import PriorityFilter from './priority-filter';
import ProjectFilter from './project-filter';
import StatusFilter from './status-filter';

interface FilterParams {
    project?: string[];
    issueType?: string[];
    priority?: string[];
    status?: string[];
}

interface FiltersProps {
    filters: FilterParams;
    onFilterChange: (filterType: keyof FilterParams, values: string[]) => void;
}

export default function Filters({ filters, onFilterChange }: FiltersProps) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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
        </div>
    );
}
