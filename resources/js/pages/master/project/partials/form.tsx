import {
    ComboboxOption,
    FormCombobox,
    FormInput,
    FormTextarea,
} from '@/components/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import external from '@/routes/external';
import { Project as ProjectOption } from '@/types/external';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import * as z from 'zod';

import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import master from '@/routes/master';
import { MasterProject as DataResponse } from '@/types/master/project';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface Props {
    state?: string;
    record?: DataResponse | null;
    open: boolean;
    setOpen: (open: boolean) => void;
}

async function getOptions(): Promise<ProjectOption[]> {
    const response = await axios.get(external.getOptions.url(), {
        withCredentials: true,
        params: {
            type: 'project',
        },
    });

    return response.data;
}

const ItemIcon = ({ item }: { item: ProjectOption }) => (
    <Avatar className="h-6 w-6">
        <AvatarImage src={item.avatarUrls['48x48']} alt={item.name} />
        <AvatarFallback>{item.key}</AvatarFallback>
    </Avatar>
);

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

export default function MasterProjectForm(props: Props) {
    const { state = 'add', record = null, open, setOpen } = props;
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);
    const [loadingOptions, setLoadingOptions] = useState(false);
    const [options, setOptions] = useState<ComboboxOption[]>([]);
    const [projectsData, setProjectsData] = useState<ProjectOption[]>([]);

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

    const fetchData = useCallback(async () => {
        try {
            setLoadingOptions(true);
            const result = await getOptions();
            setProjectsData(result);

            setOptions(
                result.map((item) => ({
                    label: item.name,
                    value: item.id.toString(),
                    icon: ({ className }: { className?: string }) => (
                        <ItemIcon item={item} />
                    ),
                    disabled: item.exist,
                })),
            );
            setLoadingOptions(false);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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
        setLoading(true);

        const request =
            state === 'add'
                ? axios.post(master.projects.store.url(), data, {
                      withCredentials: true,
                  })
                : axios.put(
                      master.projects.update.url(parseInt(data.id!)),
                      data,
                      {
                          withCredentials: true,
                      },
                  );

        await request
            .then(() => {
                setOpen(false);
                queryClient.invalidateQueries({
                    queryKey: ['master-projects'],
                });
                toast.success(
                    `Project ${state === 'add' ? 'added' : 'updated'} successfully!`,
                );
            })
            .catch((error) => {
                const code = error?.code || 'UNKNOWN_ERROR';
                const message =
                    `${error?.message}. (${code})` ||
                    `Failed to ${state === 'add' ? 'add' : 'update'} project. (${code})`;
                toast.error(message);

                const errs = error?.response?.data?.errors;
                if (errs) {
                    Object.keys(errs).forEach((field: string) => {
                        form.setError(field as keyof z.infer<typeof schema>, {
                            type: 'server',
                            message: errs[field][0],
                        });
                    });
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleSave = () => {
        form.handleSubmit(onSubmit)();
    };

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            form.reset();
        }
        setOpen(isOpen);
    };

    const handleDelete = async () => {
        setLoading(true);

        await axios
            .delete(
                master.projects.destroy.url(parseInt(form.getValues('id')!)),
                {
                    withCredentials: true,
                },
            )
            .then(() => {
                setOpen(false);
                queryClient.invalidateQueries({
                    queryKey: ['master-projects'],
                });
                toast.success('Project deleted successfully!');
            })
            .catch((error) => {
                const code = error?.code || 'UNKNOWN_ERROR';
                const message =
                    `${error?.message}. (${code})` ||
                    'Failed to delete project.';

                toast.error(message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetContent className="w-full md:w-2/3 lg:w-1/2 xl:w-2/5">
                <SheetHeader className="shadow-lg">
                    <SheetTitle>
                        {state === 'add' ? 'Add' : 'Edit'} Project
                    </SheetTitle>
                </SheetHeader>
                <form
                    id="form-master-project"
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid gap-6 overflow-auto p-4"
                >
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
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
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
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                    <div className="grid">
                        <div className="flex flex-col items-center justify-center gap-1">
                            <Avatar
                                className={`h-16 w-16 border shadow ${form.watch('avatar') ? '' : 'hidden'}`}
                            >
                                <AvatarImage
                                    src={form.watch('avatar')}
                                    alt="Project Avatar"
                                />
                                <AvatarFallback>
                                    {form.watch('key') || 'N/A'}
                                </AvatarFallback>
                            </Avatar>
                            <Badge
                                className={
                                    form.watch('archived') === undefined
                                        ? 'hidden'
                                        : form.watch('archived')
                                          ? 'bg-red-600'
                                          : 'bg-green-600'
                                }
                            >
                                {form.watch('archived') ? 'Archived' : 'Active'}
                            </Badge>
                        </div>
                    </div>
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
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
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
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
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
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>
                <SheetFooter className="border-t-2">
                    <Button
                        type="button"
                        className="cursor-pointer bg-teal-600 hover:bg-teal-700"
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Spinner /> Saving...
                            </>
                        ) : (
                            'Save'
                        )}
                    </Button>
                    {state === 'edit' && (
                        <Button
                            type="button"
                            variant="destructive"
                            className="cursor-pointer"
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner /> Deleting...
                                </>
                            ) : (
                                'Delete'
                            )}
                        </Button>
                    )}
                    <SheetClose asChild>
                        <Button variant="outline" className="cursor-pointer">
                            Cancel
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
