import { ProjectAvatar } from '@/components/avatar/project-avatar';
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
import { Project as ProjectOption } from '@/types/external';
import { MasterProject as DataResponse } from '@/types/master/project';
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
    ref_id: z.string().min(1, 'Project is required.'),
    key: z.string().min(1, 'Key is required.'),
    name: z.string().min(1, 'Name is required.'),
    avatar: z.url('Invalid URL format.').min(1, 'Avatar is required.'),
    archived: z.boolean().optional(),
    url: z.url('Invalid URL format.').min(1, 'URL is required.'),
    description: z.string().min(1, 'Description is required.'),
});

export default function MasterProjectForm({
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
            key: '',
            name: '',
            avatar: '',
            archived: undefined,
            url: '',
            description: '',
        },
    });

    const {
        options,
        data: projectsData,
        loading: loadingOptions,
    } = useOptions<ProjectOption>({
        url: external.getOptions.url(),
        params: { type: 'project' },
        mapToOption: (item) => ({
            label: item.name,
            value: item.id.toString(),
            icon: () => (
                <ProjectAvatar
                    avatar={item.avatarUrls['48x48']}
                    keyName={item.key}
                    size="sm"
                />
            ),
            disabled: item.exist,
        }),
    });

    const { loading, handleSubmit, handleDelete } = useMasterForm({
        queryKey: ['master-projects'],
        storePath: master.projects.store.url(),
        updatePath: (id) => master.projects.update.url(id),
        deletePath: (id) => master.projects.destroy.url(id),
        entityName: 'Project',
    });

    useEffect(() => {
        if (state === 'edit' && record) {
            form.reset({
                id: record.id.toString(),
                ref_id: record.ref_id.toString(),
                key: record.key,
                name: record.name,
                avatar: record.avatar,
                archived: record.archived,
                url: record.url,
                description: record.description,
            });
        } else if (state === 'add') {
            form.reset({
                id: '',
                ref_id: '',
                key: '',
                name: '',
                avatar: '',
                archived: undefined,
                url: '',
                description: '',
            });
        }
    }, [state, record, form]);

    const handleProjectChange = (value: string) => {
        const selectedProject = projectsData.find(
            (p) => p.id.toString() === value,
        );

        if (selectedProject) {
            form.setValue('ref_id', value);
            form.setValue('key', selectedProject.key);
            form.setValue('name', selectedProject.name);
            form.setValue('avatar', selectedProject.avatarUrls['48x48']);
            form.setValue('archived', selectedProject.archived);
            form.setValue(
                'url',
                `https://issues.apache.org/jira/projects/${selectedProject.key}`,
            );
            form.setValue(
                'description',
                selectedProject.projectCategory?.description || '',
            );
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
            title={`${state === 'add' ? 'Add' : 'Edit'} Project`}
            onSave={form.handleSubmit(onSubmit)}
            onDelete={state === 'edit' ? onDelete : undefined}
            loading={loading}
            state={state}
        >
            <form id="form-master-project" className="contents">
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
                                    Project
                                </FieldLabel>
                                <FormCombobox
                                    id="ref_id"
                                    placeholder="Select Project"
                                    searchPlaceholder="Search projects..."
                                    aria-invalid={fieldState.invalid}
                                    options={options}
                                    isLoading={loadingOptions}
                                    value={field.value}
                                    onChange={(value) => {
                                        field.onChange(value);
                                        handleProjectChange(value);
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
                                    readOnly
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

                <ProjectAvatar
                    avatar={form.watch('avatar')}
                    keyName={form.watch('key')}
                    archived={form.watch('archived')}
                    size="lg"
                />

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
