import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';
import features from '@/routes/features';
import { type BreadcrumbItem } from '@/types';
import { Feature as FeatureRecord, FeaturesResponse } from '@/types/feature';
import { Head, router } from '@inertiajs/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useCallback, useState } from 'react';
import { createColumns } from './partials/columns';
import Filters from './partials/filters';
import Form from './partials/form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Features',
        href: features.index.url(),
    },
];

interface FilterParams {
    query?: string;
    project?: string[];
    issueType?: string[];
    priority?: string[];
    status?: string[];
    reporter?: string[];
    has_method?: boolean;
}

function useFeaturesData(
    pageIndex: number,
    pageSize: number,
    filters: FilterParams,
) {
    return useQuery({
        queryKey: ['features', pageIndex, pageSize, filters],
        queryFn: async () => {
            const startAt = pageIndex * pageSize;
            const params: any = {
                startAt,
                maxResults: pageSize,
            };

            if (filters.query) {
                params.query = filters.query;
            }
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
            if (filters.reporter?.length) {
                params.reporter = filters.reporter;
            }
            if (filters.has_method !== undefined) {
                params.has_method = filters.has_method;
            }

            const response = await axios.get<FeaturesResponse>(
                features.data.url(),
                {
                    params,
                    withCredentials: true,
                },
            );

            return response.data;
        },
    });
}

export default function FeaturesIndex() {
    const [state, setState] = useState<'add' | 'edit'>('add');
    const [record, setRecord] = useState<FeatureRecord | null>(null);
    const [openForm, setOpenForm] = useState(false);
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

    const { data, isLoading, isFetching } = useFeaturesData(
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
        (
            filterType: keyof FilterParams,
            values: string | string[] | boolean,
        ) => {
            setFilters((prev) => ({
                ...prev,
                [filterType]: values,
            }));

            setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        },
        [],
    );

    const handleRowClick = useCallback((row: any) => {
        router.visit(features.key.url({ key: row.key }));
    }, []);

    const tableData = {
        data: data?.features ?? [],
        total: data?.total ?? 0,
        startAt: data?.startAt ?? 0,
        maxResults: data?.maxResults ?? pagination.pageSize,
    };

    const onAdd = () => {
        setState('add');
        setRecord(null);
        setOpenForm(true);
    };

    const handleEdit = (record: FeatureRecord) => {
        setState('edit');
        setRecord(record);
        setOpenForm(true);
    };

    const columns = createColumns(handleEdit, handleRowClick);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Features" />
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
                    // onRowClick={handleRowClick}
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
