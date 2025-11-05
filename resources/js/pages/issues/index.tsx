import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import issues from '@/routes/issues';
import { type BreadcrumbItem } from '@/types';
import { IssuesResponse } from '@/types/issue';
import { Head } from '@inertiajs/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useCallback, useState } from 'react';
import { columns } from './partials/columns';
import Filters from './partials/filters';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Issues',
        href: issues.index.url(),
    },
];

interface FilterParams {
    project?: string[];
    issueType?: string[];
    priority?: string[];
    status?: string[];
}

function useIssuesData(
    pageIndex: number,
    pageSize: number,
    filters: FilterParams,
) {
    return useQuery({
        queryKey: ['issues', pageIndex, pageSize, filters],
        queryFn: async () => {
            const startAt = pageIndex * pageSize;
            const params: any = {
                startAt,
                maxResults: pageSize,
            };

            if (filters.project?.length) {
                params.project = filters.project;
            }
            if (filters.issueType?.length) {
                params.issueType = filters.issueType;
            }
            if (filters.priority?.length) {
                params.priority = filters.priority;
            }
            if (filters.status?.length) {
                params.status = filters.status;
            }

            const response = await axios.get<IssuesResponse>(
                issues.data.url(),
                {
                    params,
                    withCredentials: true,
                },
            );

            return response.data;
        },
    });
}

export default function IssuesIndex() {
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [filters, setFilters] = useState<FilterParams>({
        project: [],
        issueType: [],
        priority: [],
        status: [],
    });

    const { data, isLoading, isFetching } = useIssuesData(
        pagination.pageIndex,
        pagination.pageSize,
        filters,
    );

    const handlePageChange = useCallback((pageIndex: number) => {
        setPagination((prev) => ({ ...prev, pageIndex }));
    }, []);

    const handlePageSizeChange = useCallback((pageSize: number) => {
        setPagination({ pageIndex: 0, pageSize });
    }, []);

    const handleFilterChange = useCallback(
        (filterType: keyof FilterParams, values: string[]) => {
            setFilters((prev) => ({
                ...prev,
                [filterType]: values,
            }));

            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        },
        [],
    );

    const tableData = {
        data: data?.issues ?? [],
        total: data?.total ?? 0,
        startAt: data?.startAt ?? 0,
        maxResults: data?.maxResults ?? pagination.pageSize,
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Issues" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Filters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                />
                <DataTable
                    columns={columns}
                    data={tableData}
                    loading={isLoading || isFetching}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                />
            </div>
        </AppLayout>
    );
}
