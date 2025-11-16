import { FormInput } from '@/components/form';
import { FormSheet } from '@/components/form/form-sheet';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { useMasterForm } from '@/hooks/use-master-form';
import master from '@/routes/master';
import { MasterReporter as DataResponse } from '@/types/master';
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
    key: z.string().min(1, 'Key is required.'),
    name: z.string().min(1, 'Name is required.'),
    display_name: z.string().min(1, 'Display name is required.'),
    avatar: z.url('Invalid URL format.').min(1, 'URL is required.'),
    time_zone: z.string().min(1, 'Time zone is required.'),
    active: z.boolean().optional(),
});

export default function MasterReporterForm({
    state = 'add',
    record = null,
    open,
    setOpen,
}: Props) {
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            id: '',
            key: '',
            name: '',
            display_name: '',
            avatar: '',
            time_zone: '',
            active: true,
        },
    });

    const { loading, handleSubmit, handleDelete } = useMasterForm({
        queryKey: ['master-reporters'],
        storePath: master.reporters.store.url(),
        updatePath: (id) => master.reporters.update.url(id),
        deletePath: (id) => master.reporters.destroy.url(id),
        entityName: 'Reporter',
    });

    useEffect(() => {
        if (state === 'edit' && record) {
            form.reset({
                id: record.id.toString(),
                key: record.key,
                name: record.name,
                display_name: record.display_name,
                avatar: record.avatar,
                time_zone: record.time_zone,
                active: record.active,
            });
        } else if (state === 'add') {
            form.reset({
                id: '',
                key: '',
                name: '',
                display_name: '',
                avatar: '',
                time_zone: '',
                active: true,
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
            title={`${state === 'add' ? 'Add' : 'Edit'} Reporter`}
            onSave={form.handleSubmit(onSubmit)}
            onDelete={state === 'edit' ? onDelete : undefined}
            loading={loading}
            state={state}
        >
            <form id="form-master-reporter" className="contents">
                <FieldGroup>
                    <Controller
                        name="key"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="gap-1"
                            >
                                <FieldLabel htmlFor="key">Key</FieldLabel>
                                <FormInput
                                    {...field}
                                    id="key"
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
                        name="display_name"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="gap-1"
                            >
                                <FieldLabel htmlFor="display_name">
                                    Display Name
                                </FieldLabel>
                                <FormInput
                                    {...field}
                                    id="display_name"
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
                        name="avatar"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="gap-1"
                            >
                                <FieldLabel htmlFor="avatar">
                                    Avatar URL
                                </FieldLabel>
                                <FormInput
                                    {...field}
                                    id="avatar"
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
                        name="time_zone"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="gap-1"
                            >
                                <FieldLabel htmlFor="time_zone">
                                    Time Zone
                                </FieldLabel>
                                <FormInput
                                    {...field}
                                    id="time_zone"
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
                        name="active"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="gap-1"
                            >
                                <FieldLabel htmlFor="active">Active</FieldLabel>
                                <Checkbox
                                    id="active"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    aria-invalid={fieldState.invalid}
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
