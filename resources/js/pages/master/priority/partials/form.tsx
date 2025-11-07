import { GeneralAvatar } from '@/components/avatar/general-avatar';
import { FormCombobox, FormInput, FormTextarea } from '@/components/form';
import { FormSheet } from '@/components/form/form-sheet';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { useMasterForm } from '@/hooks/use-master-form';
import { useOptions } from '@/hooks/use-options';
import external from '@/routes/external';
import master from '@/routes/master';
import { Priority as PriorityOption } from '@/types/external';
import { MasterPriority as DataResponse } from '@/types/master';
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
    ref_id: z.string().min(1, 'Priority is required.'),
    name: z.string().min(1, 'Name is required.'),
    icon_url: z.url('Invalid URL format.').min(1, 'URL is required.'),
    status_color: z.string().min(1, 'Status color is required.'),
    description: z.string().min(1, 'Description is required.'),
});

export default function MasterPriorityForm({
    state = 'add',
    record = null,
    open,
    setOpen,
}: Props) {
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            id: '',
            ref_id: '',
            name: '',
            icon_url: '',
            status_color: '',
            description: '',
        },
    });

    const {
        options,
        data: prioritiesData,
        loading: loadingOptions,
    } = useOptions<PriorityOption>({
        url: external.getOptions.url(),
        params: { type: 'priority' },
        mapToOption: (item) => ({
            label: item.name,
            value: item.id.toString(),
            icon: () => (
                <GeneralAvatar
                    avatar={item.iconUrl}
                    keyName={item.name}
                    size="xs"
                />
            ),
            disabled: item.exist,
        }),
    });

    const { loading, handleSubmit, handleDelete } = useMasterForm({
        queryKey: ['master-priorities'],
        storePath: master.priorities.store.url(),
        updatePath: (id) => master.priorities.update.url(id),
        deletePath: (id) => master.priorities.destroy.url(id),
        entityName: 'Priority',
    });

    useEffect(() => {
        if (state === 'edit' && record) {
            form.reset({
                id: record.id.toString(),
                ref_id: record.ref_id.toString(),
                name: record.name,
                icon_url: record.icon_url,
                status_color: record.status_color,
                description: record.description,
            });
        } else if (state === 'add') {
            form.reset({
                id: '',
                ref_id: '',
                name: '',
                icon_url: '',
                status_color: '',
                description: '',
            });
        }
    }, [state, record, form]);

    const handlePriorityChange = (value: string) => {
        const selectedPriority = prioritiesData.find(
            (p) => p.id.toString() === value,
        );

        if (selectedPriority) {
            form.setValue('ref_id', value);
            form.setValue('name', selectedPriority.name);
            form.setValue('icon_url', selectedPriority.iconUrl);
            form.setValue('status_color', selectedPriority.statusColor);
            form.setValue('description', selectedPriority.description || '');
        }
    };

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
            title={`${state === 'add' ? 'Add' : 'Edit'} Priority`}
            onSave={form.handleSubmit(onSubmit)}
            onDelete={state === 'edit' ? onDelete : undefined}
            loading={loading}
            state={state}
        >
            <form id="form-master-priority" className="contents">
                <FieldGroup>
                    <Controller
                        name="ref_id"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="gap-1"
                            >
                                <FieldLabel htmlFor="ref_id">
                                    Priority
                                </FieldLabel>
                                <FormCombobox
                                    id="ref_id"
                                    placeholder="Select priority..."
                                    searchPlaceholder="Search priorities..."
                                    aria-invalid={fieldState.invalid}
                                    options={options}
                                    isLoading={loadingOptions}
                                    value={field.value}
                                    onChange={(value) => {
                                        field.onChange(value);
                                        handlePriorityChange(value);
                                    }}
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
                        name="status_color"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="gap-1"
                            >
                                <FieldLabel htmlFor="status_color">
                                    Status Color
                                </FieldLabel>
                                <FormInput
                                    {...field}
                                    id="status_color"
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
