import { FormInput, FormTextarea } from '@/components/form';
import { FormComboboxRest } from '@/components/form/form-combobox-rest';
import { FormSheet } from '@/components/form/form-sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { useMasterForm } from '@/hooks/use-master-form';
import features from '@/routes/features';
import master from '@/routes/master';
import { Feature as DataResponse } from '@/types/feature';
import {
    MasterIssueType as IssueTypeOption,
    MasterPriority as PriorityOption,
    MasterProject as ProjectOption,
    MasterReporter as ReporterOption,
    MasterStatus as StatusOption,
} from '@/types/master';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
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
    key: z.string().optional(),
    summary: z.string().optional(),
    description: z.string().optional(),
    components: z.string().optional(),
    ref_project_id: z.string().min(1, 'Project is required'),
    ref_issue_type_id: z.string().min(1, 'Issue Type is required'),
    ref_priority_id: z.string().min(1, 'Priority is required'),
    ref_status_id: z.string().min(1, 'Status is required'),
    ref_reporter_key: z.string().min(1, 'Reporter is required'),
});

export default function MasterFeatureForm({
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
            summary: '',
            description: '',
            components: '',
            ref_project_id: '',
            ref_issue_type_id: '',
            ref_priority_id: '',
            ref_status_id: '',
            ref_reporter_key: '',
        },
    });

    const { loading, handleSubmit, handleDelete } = useMasterForm({
        queryKey: ['features'],
        storePath: features.store.url(),
        updatePath: (id) => features.update.url(id),
        deletePath: (id) => features.destroy.url(id),
        entityName: 'Feature',
    });

    useEffect(() => {
        if (state === 'edit' && record) {
            form.reset({
                id: record.id.toString(),
                key: record.key,
                summary: record.fields.summary,
                description: record.fields.description,
                components: record.fields.components
                    .map((component) => component.name)
                    .join(', '),
                ref_project_id: record.fields.project.id.toString(),
                ref_issue_type_id: record.fields.issuetype.id.toString(),
                ref_priority_id: record.fields.priority.id.toString(),
                ref_status_id: record.fields.status.id.toString(),
                ref_reporter_key: record.fields.reporter.key,
            });
        } else if (state === 'add') {
            let key = '';
            axios
                .get(features.generateKey.url(), {
                    withCredentials: true,
                })
                .then((response) => {
                    key = response.data.key;
                    form.setValue('key', key);
                });

            form.reset({
                id: '',
                key: key,
                summary: '',
                description: '',
                components: '',
                ref_project_id: '',
                ref_issue_type_id: '',
                ref_priority_id: '',
                ref_status_id: '',
                ref_reporter_key: '',
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
            title={`${state === 'add' ? 'Add' : 'Edit'} Feature`}
            onSave={form.handleSubmit(onSubmit)}
            onDelete={state === 'edit' ? onDelete : undefined}
            loading={loading}
            state={state}
        >
            <form id="form-feature" className="contents">
                <FieldGroup>
                    <Controller
                        name="key"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="gap-1"
                            >
                                <FieldLabel htmlFor="key">
                                    Feature Key
                                </FieldLabel>
                                <FormInput
                                    {...field}
                                    id="key"
                                    type="text"
                                    autoComplete="off"
                                    aria-invalid={fieldState.invalid}
                                    readOnly
                                />
                                <small className="text-xs text-muted-foreground">
                                    Auto generated feature key.
                                </small>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </FieldGroup>

                <FieldGroup>
                    <Controller
                        name="ref_project_id"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="gap-1"
                            >
                                <FieldLabel htmlFor="ref_project_id">
                                    Project
                                </FieldLabel>
                                <FormComboboxRest
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Select project..."
                                    searchPlaceholder="Search projects..."
                                    apiUrl={master.projects.option.url()}
                                    valueFormatter={(option) =>
                                        option.ref_id.toString()
                                    }
                                    labelFormatter={(option) => option.name}
                                    iconRenderer={(option) => {
                                        const item =
                                            option as unknown as ProjectOption;
                                        return (
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage
                                                    src={item.avatar}
                                                    alt={item.name}
                                                />
                                                <AvatarFallback>
                                                    {item.key}
                                                </AvatarFallback>
                                            </Avatar>
                                        );
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
                        name="summary"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="gap-1"
                            >
                                <FieldLabel htmlFor="summary">
                                    Summary
                                </FieldLabel>
                                <FormTextarea
                                    {...field}
                                    id="summary"
                                    rows={2}
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

                <FieldGroup>
                    <Controller
                        name="components"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="gap-1"
                            >
                                <FieldLabel htmlFor="components">
                                    Components
                                </FieldLabel>
                                <FormTextarea
                                    {...field}
                                    id="components"
                                    rows={2}
                                    autoComplete="off"
                                    aria-invalid={fieldState.invalid}
                                    className="resize-none"
                                />
                                <small className="text-xs text-muted-foreground">
                                    Comma separated component names.
                                </small>
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </FieldGroup>

                <FieldGroup>
                    <Controller
                        name="ref_issue_type_id"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="gap-1"
                            >
                                <FieldLabel htmlFor="ref_issue_type_id">
                                    Issue Type
                                </FieldLabel>
                                <FormComboboxRest
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Select issue type..."
                                    searchPlaceholder="Search issue types..."
                                    apiUrl={master.issuetypes.option.url()}
                                    valueFormatter={(option) =>
                                        option.ref_id.toString()
                                    }
                                    labelFormatter={(option) => option.name}
                                    iconRenderer={(option) => {
                                        const item =
                                            option as unknown as IssueTypeOption;
                                        return (
                                            <Avatar className="h-4 w-4">
                                                <AvatarImage
                                                    src={item.icon_url}
                                                    alt={item.name}
                                                />
                                                <AvatarFallback>
                                                    {item.name}
                                                </AvatarFallback>
                                            </Avatar>
                                        );
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
                        name="ref_priority_id"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="gap-1"
                            >
                                <FieldLabel htmlFor="ref_priority_id">
                                    Priority
                                </FieldLabel>
                                <FormComboboxRest
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Select priority..."
                                    searchPlaceholder="Search priorities..."
                                    apiUrl={master.priorities.option.url()}
                                    valueFormatter={(option) =>
                                        option.ref_id.toString()
                                    }
                                    labelFormatter={(option) => option.name}
                                    iconRenderer={(option) => {
                                        const item =
                                            option as unknown as PriorityOption;
                                        return (
                                            <Avatar className="h-4 w-4">
                                                <AvatarImage
                                                    src={item.icon_url}
                                                    alt={item.name}
                                                />
                                                <AvatarFallback>
                                                    {item.name}
                                                </AvatarFallback>
                                            </Avatar>
                                        );
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
                        name="ref_status_id"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="gap-1"
                            >
                                <FieldLabel htmlFor="ref_status_id">
                                    Status
                                </FieldLabel>
                                <FormComboboxRest
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Select status..."
                                    searchPlaceholder="Search statuses..."
                                    apiUrl={master.statuses.option.url()}
                                    valueFormatter={(option) =>
                                        option.ref_id.toString()
                                    }
                                    labelFormatter={(option) => option.name}
                                    iconRenderer={(option) => {
                                        const item =
                                            option as unknown as StatusOption;
                                        return (
                                            <Avatar className="h-4 w-4">
                                                <AvatarImage
                                                    src={item.icon_url}
                                                    alt={item.name}
                                                />
                                                <AvatarFallback>
                                                    {item.name}
                                                </AvatarFallback>
                                            </Avatar>
                                        );
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
                        name="ref_reporter_key"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="gap-1"
                            >
                                <FieldLabel htmlFor="ref_reporter_key">
                                    Reporter
                                </FieldLabel>
                                <FormComboboxRest
                                    {...field}
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Select reporter..."
                                    searchPlaceholder="Search reporters..."
                                    apiUrl={master.reporters.option.url()}
                                    valueFormatter={(option) => option.key}
                                    labelFormatter={(option) =>
                                        option.display_name
                                    }
                                    iconRenderer={(option) => {
                                        const item =
                                            option as unknown as ReporterOption;
                                        return (
                                            <Avatar className="h-4 w-4">
                                                <AvatarImage
                                                    src={item.avatar}
                                                    alt={item.display_name}
                                                />
                                                <AvatarFallback>
                                                    {item.name}
                                                </AvatarFallback>
                                            </Avatar>
                                        );
                                    }}
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
