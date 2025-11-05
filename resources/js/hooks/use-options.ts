import { ComboboxOption } from '@/components/form';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

interface UseOptionsConfig<T> {
    url: string;
    params?: Record<string, any>;
    mapToOption: (item: T) => ComboboxOption;
}

export function useOptions<T>(config: UseOptionsConfig<T>) {
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState<ComboboxOption[]>([]);
    const [data, setData] = useState<T[]>([]);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(config.url, {
                withCredentials: true,
                params: config.params,
            });

            setData(response.data);
            setOptions(response.data.map(config.mapToOption));
        } catch (error) {
            console.error('Error fetching options:', error);
        } finally {
            setLoading(false);
        }
    }, [config.url, JSON.stringify(config.params)]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { options, data, loading, refetch: fetchData };
}
