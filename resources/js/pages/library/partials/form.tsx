import { FormInput, FormTextarea } from '@/components/form';
import { FormSheet } from '@/components/form/form-sheet';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { useMasterForm } from '@/hooks/use-master-form';
import libraries from '@/routes/libraries';
import { Library as DataResponse } from '@/types/library';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

interface Props {
    state?: 'add' | 'edit';
    record?: DataResponse | null;
    open: boolean;
    setOpen: (open: boolean) => void;
}

const schema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'Name is required.'),
    url: z.url('Invalid URL format.').optional().or(z.literal('')),
    description: z.string().optional(),
});

export default function MasterLibraryForm({
    state = 'add',
    record = null,
    open,
    setOpen,
}: Props) {
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            id: '',
            name: '',
            url: '',
            description: '',
        },
    });

    const { loading, handleSubmit, handleDelete } = useMasterForm({
        queryKey: ['libraries'],
        storePath: libraries.store.url(),
        updatePath: (id) => libraries.update.url(id),
        deletePath: (id) => libraries.destroy.url(id),
        entityName: 'Library',
    });

    useEffect(() => {
        if (state === 'edit' && record) {
            form.reset({
                id: record.id.toString(),
                name: record.name,
                url: record.url || '',
                description: record.description || '',
            });
        } else if (state === 'add') {
            form.reset({
                id: '',
                name: '',
                url: '',
                description: '',
            });
        }
    }, [state, record, form]);

    const onSubmit = async (data: z.infer<typeof schema>) => {
        const success = await handleSubmit(data, state, form);
        if (success) setOpen(false);
    };

    const onDelete = async () => {
        const success = await handleDelete(parseInt(form.getValues('id')!));
        if (success) setOpen(false);
    };

    return (
        <FormSheet
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) form.reset();
                setOpen(isOpen);
            }}
            title={`${state === 'add' ? 'Add' : 'Edit'} Library`}
            onSave={form.handleSubmit(onSubmit)}
            onDelete={state === 'edit' ? onDelete : undefined}
            loading={loading}
            state={state}
        >
            <form id="form-library" className="contents">
                <FieldGroup>
                    <Controller
                        name="name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="gap-1"
                            >
                                <FieldLabel htmlFor="name">Name</FieldLabel>
                                <FormInput
                                    {...field}
                                    id="name"
                                    type="text"
                                    autoComplete="off"
                                    aria-invalid={fieldState.invalid}
                                    readOnly={state === 'edit'}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </FieldGroup>

                <FieldGroup>
                    <Controller
                        name="url"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="gap-1"
                            >
                                <FieldLabel htmlFor="url">URL</FieldLabel>
                                <FormInput
                                    {...field}
                                    id="url"
                                    type="text"
                                    autoComplete="off"
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </FieldGroup>

                <FieldGroup>
                    <Controller
                        name="description"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="gap-1"
                            >
                                <FieldLabel htmlFor="description">
                                    Description
                                </FieldLabel>
                                <FormTextarea
                                    {...field}
                                    id="description"
                                    rows={4}
                                    autoComplete="off"
                                    aria-invalid={fieldState.invalid}
                                    className="resize-none"
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </FieldGroup>
            </form>
        </FormSheet>
    );
}
