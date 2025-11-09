import { DataTable, PaginatedData } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import master from '@/routes/master';
import { PaginatedResponse, type BreadcrumbItem } from '@/types';
import { MasterPriority as DataResponse } from '@/types/master';
import { Head } from '@inertiajs/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useCallback, useState } from 'react';
import { createColumns } from './partials/columns';
import Filters from './partials/filters';
import Form from './partials/form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Master',
        href: '#',
    },
    {
        title: 'Priorities',
        href: master.priorities.index.url(),
    },
];

interface FilterParams {
    query?: string;
}

interface Props {
    data: PaginatedResponse<DataResponse>;
}

function useMasterPriorityData(
    page: number,
    perPage: number,
    filters: FilterParams,
) {
    return useQuery({
        queryKey: ['master-priorities', page, perPage, filters],
        queryFn: async () => {
            const params: any = {
                page,
                per_page: perPage,
            };

            if (filters.query) {
                params.query = filters.query;
            }

            const response = await axios.get<PaginatedResponse<DataResponse>>(
                master.priorities.data.url(),
                {
                    params,
                    withCredentials: true,
                },
            );

            return response.data;
        },
    });
}

export default function MasterPriority(props: Props) {
    const [state, setState] = useState<'add' | 'edit'>('add');
    const [record, setRecord] = useState<DataResponse | null>(null);
    const [openForm, setOpenForm] = useState(false);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [filters, setFilters] = useState<FilterParams>({
        query: '',
    });

    const { data, isLoading, isFetching } = useMasterPriorityData(
        pagination.pageIndex + 1,
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
        (filterType: keyof FilterParams, values: string) => {
            setFilters((prev) => ({
                ...prev,
                [filterType]: values,
            }));

            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        },
        [],
    );

    const tableData: PaginatedData<DataResponse> = {
        data: data?.data ?? [],
        total: data?.total ?? 0,
        startAt: data?.from ? data.from - 1 : 0,
        maxResults: data?.per_page ?? pagination.pageSize,
    };

    const onAdd = () => {
        setState('add');
        setRecord(null);
        setOpenForm(true);
    };

    const handleEdit = (record: DataResponse) => {
        setState('edit');
        setRecord(record);
        setOpenForm(true);
    };

    const columns = createColumns(handleEdit);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Master Priorities" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Filters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onAdd={onAdd}
                />
                <DataTable
                    columns={columns}
                    data={tableData}
                    loading={isLoading || isFetching}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                />
            </div>
            <Form
                state={state}
                record={record}
                open={openForm}
                setOpen={setOpenForm}
            />
        </AppLayout>
    );
}
