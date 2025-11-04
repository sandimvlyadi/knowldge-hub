import { DataTable, PaginatedData } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import master from '@/routes/master';
import { PaginatedResponse, type BreadcrumbItem } from '@/types';
import { MasterProject as DataResponse } from '@/types/master/project';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { columns } from './partials/columns';
import Filters from './partials/filters';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Master',
        href: '#',
    },
    {
        title: 'Projects',
        href: master.projects.index.url(),
    },
];

interface FilterParams {
    query?: string;
    archived?: boolean;
}

interface Props {
    data: PaginatedResponse<DataResponse>;
}

async function getData(
    page: number = 1,
    perPage: number = 10,
    filters: FilterParams = {},
): Promise<PaginatedResponse<DataResponse>> {
    const params: any = {
        page,
        per_page: perPage,
    };

    if (filters.query) {
        params.query = filters.query;
    }
    if (filters.archived !== undefined) {
        params.archived = filters.archived;
    }

    const response = await axios.get(master.projects.data.url(), {
        params,
        withCredentials: true,
    });

    return response.data;
}

export default function MasterProject(props: Props) {
    const [data, setData] = useState<PaginatedResponse<DataResponse>>(
        props.data || {
            data: [],
            total: 0,
            current_page: 1,
            per_page: 10,
            from: 1,
            to: 0,
            last_page: 1,
            first_page_url: '',
            last_page_url: '',
            next_page_url: null,
            prev_page_url: null,
            path: '',
            links: [],
        },
    );
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [filters, setFilters] = useState<FilterParams>({
        query: '',
        archived: undefined,
    });

    const fetchData = useCallback(
        async (
            page: number,
            pageSize: number,
            currentFilters: FilterParams,
        ) => {
            setLoading(true);
            try {
                const result = await getData(page, pageSize, currentFilters);
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
        fetchData(pagination.pageIndex + 1, pagination.pageSize, filters);
    }, [fetchData, pagination.pageIndex, pagination.pageSize, filters]);

    const handlePageChange = useCallback((pageIndex: number) => {
        setPagination((prev) => ({ ...prev, pageIndex }));
    }, []);

    const handlePageSizeChange = useCallback((pageSize: number) => {
        setPagination({ pageIndex: 0, pageSize });
    }, []);

    const handleFilterChange = useCallback(
        (filterType: keyof FilterParams, values: string | boolean) => {
            setFilters((prev) => ({
                ...prev,
                [filterType]: values,
            }));
            // Reset to first page when filters change
            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        },
        [],
    );

    const tableData: PaginatedData<DataResponse> = {
        data: data?.data || [],
        total: data?.total || 0,
        startAt: data?.from ? data.from - 1 : 0,
        maxResults: data?.per_page || 10,
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Master Projects" />
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
