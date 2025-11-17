import issues from '@/routes/issues';
import { Graph as GraphType } from '@/types/graph';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { MultipleLinkedGraph } from './multiple-linked';

function useGraphData(pageIndex: number, pageSize: number) {
    return useQuery({
        queryKey: ['dashboard-graph', pageIndex, pageSize],
        queryFn: async () => {
            const startAt = pageIndex * pageSize;
            const params: any = {
                startAt,
                maxResults: pageSize,
            };

            const response = await axios.get<GraphType[]>(
                issues.allGraphs.url(),
                {
                    params,
                    withCredentials: true,
                },
            );

            return response.data;
        },
    });
}

export function KnowledgeGraph() {
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [records, setRecords] = useState<GraphType[]>([]);

    const { data, isLoading, isFetching } = useGraphData(
        pagination.pageIndex,
        pagination.pageSize,
    );

    const handlePageChange = useCallback((pageIndex: number) => {
        setPagination((prev) => ({ ...prev, pageIndex }));
    }, []);

    const handlePageSizeChange = useCallback((pageSize: number) => {
        setPagination({ pageIndex: 0, pageSize });
    }, []);

    useEffect(() => {
        if (data) {
            setRecords(data);
        }
    }, [data]);

    return <MultipleLinkedGraph data={records} />;
}
