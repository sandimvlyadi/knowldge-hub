import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import issues from '@/routes/issues';
import { type BreadcrumbItem } from '@/types';
import { IssuesResponse } from '@/types/issue';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
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

async function getData(
    startAt: number = 0,
    maxResults: number = 10,
    filters: FilterParams = {},
): Promise<IssuesResponse> {
    const params: any = {
        startAt,
        maxResults,
    };

    // Add filter parameters
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

    const response = await axios.get(issues.data.url(), {
        params,
        withCredentials: true,
    });

    return response.data;

    // return useQuery({
    //     queryKey: ['issues', filters],
    //     queryFn: async () => {
    //         const response = await axios.get(issues.data.url(), {
    //             params,
    //             withCredentials: true,
    //         });
    //         return response.data;
    //     },
    // });
}

export default function IssuesIndex() {
    const [data, setData] = useState<IssuesResponse>({
        expand: '',
        startAt: 0,
        maxResults: 10,
        total: 0,
        issues: [],
    });
    const [loading, setLoading] = useState(true);
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

    const fetchData = useCallback(
        async (
            pageIndex: number,
            pageSize: number,
            currentFilters: FilterParams,
        ) => {
            setLoading(true);
            try {
                const startAt = pageIndex * pageSize;
                const result = await getData(startAt, pageSize, currentFilters);
                setData(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    useEffect(() => {
        fetchData(pagination.pageIndex, pagination.pageSize, filters);
    }, [fetchData, pagination.pageIndex, pagination.pageSize, filters]);

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
            // Reset to first page when filters change
            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        },
        [],
    );

    const tableData = {
        data: data.issues,
        total: data.total,
        startAt: data.startAt,
        maxResults: data.maxResults,
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
                    loading={loading}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                />
            </div>
        </AppLayout>
    );
}
