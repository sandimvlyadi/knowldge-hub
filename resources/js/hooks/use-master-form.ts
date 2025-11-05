import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

interface UseMasterFormOptions {
    queryKey: string[];
    storePath: string;
    updatePath: (id: number) => string;
    deletePath: (id: number) => string;
    entityName: string;
}

export function useMasterForm(options: UseMasterFormOptions) {
    const { queryKey, storePath, updatePath, deletePath, entityName } = options;
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (
        data: any,
        state: 'add' | 'edit',
        form: any,
    ) => {
        setLoading(true);

        const request =
            state === 'add'
                ? axios.post(storePath, data, { withCredentials: true })
                : axios.put(updatePath(parseInt(data.id!)), data, {
                      withCredentials: true,
                  });

        try {
            await request;
            queryClient.invalidateQueries({ queryKey });
            toast.success(
                `${entityName} ${state === 'add' ? 'added' : 'updated'} successfully!`,
            );
            return true;
        } catch (error: any) {
            const code = error?.code || 'UNKNOWN_ERROR';
            const message = `${error?.message}. (${code})`;
            toast.error(message);

            const errs = error?.response?.data?.errors;
            if (errs) {
                Object.keys(errs).forEach((field: string) => {
                    form.setError(field, {
                        type: 'server',
                        message: errs[field][0],
                    });
                });
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        setLoading(true);

        try {
            await axios.delete(deletePath(id), { withCredentials: true });
            queryClient.invalidateQueries({ queryKey });
            toast.success(`${entityName} deleted successfully!`);
            return true;
        } catch (error: any) {
            const code = error?.code || 'UNKNOWN_ERROR';
            const message = `${error?.message}. (${code})`;
            toast.error(message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { loading, handleSubmit, handleDelete };
}
