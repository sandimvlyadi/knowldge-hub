import { GeneralAvatar } from '@/components/avatar/general-avatar';
import { FormCombobox, FormInput, FormTextarea } from '@/components/form';
import { FormSheet } from '@/components/form/form-sheet';
import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { useMasterForm } from '@/hooks/use-master-form';
import { useOptions } from '@/hooks/use-options';
import external from '@/routes/external';
import master from '@/routes/master';
import { Status as StatusOption } from '@/types/external';
import { MasterStatus as DataResponse } from '@/types/master';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronsUpDownIcon } from 'lucide-react';
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
    ref_id: z.string().min(1, 'Status is required.'),
    name: z.string().min(1, 'Name is required.'),
    icon_url: z.url('Invalid URL format.').min(1, 'URL is required.'),
    description: z.string().min(1, 'Description is required.'),
    category_ref_id: z.string().optional(),
    category_key: z.string().optional(),
    category_name: z.string().optional(),
    category_color_name: z.string().optional(),
});

export default function MasterStatusForm({
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
            description: '',
            category_ref_id: '',
            category_key: '',
            category_name: '',
            category_color_name: '',
        },
    });

    const {
        options,
        data: statusesData,
        loading: loadingOptions,
    } = useOptions<StatusOption>({
        url: external.getOptions.url(),
        params: { type: 'status' },
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
        queryKey: ['master-statuses'],
        storePath: master.statuses.store.url(),
        updatePath: (id) => master.statuses.update.url(id),
        deletePath: (id) => master.statuses.destroy.url(id),
        entityName: 'Status',
    });

    useEffect(() => {
        if (state === 'edit' && record) {
            form.reset({
                id: record.id.toString(),
                ref_id: record.ref_id.toString(),
                name: record.name,
                icon_url: record.icon_url,
                description: record.description,
                category_ref_id: record.status_category.ref_id,
                category_key: record.status_category.key,
                category_name: record.status_category.name,
                category_color_name: record.status_category.color_name,
            });
        } else if (state === 'add') {
            form.reset({
                id: '',
                ref_id: '',
                name: '',
                icon_url: '',
                description: '',
                category_ref_id: '',
                category_key: '',
                category_name: '',
                category_color_name: '',
            });
        }
    }, [state, record, form]);

    const handleStatusChange = (value: string) => {
        const selectedStatus = statusesData.find(
            (p) => p.id.toString() === value,
        );

        if (selectedStatus) {
            form.setValue('ref_id', value);
            form.setValue('name', selectedStatus.name);
            form.setValue('icon_url', selectedStatus.iconUrl);
            form.setValue('description', selectedStatus.description || '');
            form.setValue(
                'category_ref_id',
                String(selectedStatus.statusCategory?.id) || '',
            );
            form.setValue(
                'category_key',
                selectedStatus.statusCategory?.key || '',
            );
            form.setValue(
                'category_name',
                selectedStatus.statusCategory?.name || '',
            );
            form.setValue(
                'category_color_name',
                selectedStatus.statusCategory?.colorName || '',
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
            title={`${state === 'add' ? 'Add' : 'Edit'} Status`}
            onSave={form.handleSubmit(onSubmit)}
            onDelete={state === 'edit' ? onDelete : undefined}
            loading={loading}
            state={state}
        >
            <form id="form-master-status" className="contents">
                <FieldGroup>
                    <Controller
                        name="ref_id"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field
                                data-invalid={fieldState.invalid}
                                className="gap-1"
                            >
                                <FieldLabel htmlFor="ref_id">Status</FieldLabel>
                                <FormCombobox
                                    id="ref_id"
                                    placeholder="Select status..."
                                    searchPlaceholder="Search statuses..."
                                    aria-invalid={fieldState.invalid}
                                    options={options}
                                    isLoading={loadingOptions}
                                    value={field.value}
                                    onChange={(value) => {
                                        field.onChange(value);
                                        handleStatusChange(value);
                                    }}
                                />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </FieldGroup>

                <Collapsible>
                    <div className="flex items-center justify-between gap-4">
                        <Label>Category</Label>
                        <CollapsibleTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8"
                            >
                                <ChevronsUpDownIcon />
                                <span className="sr-only">Toggle</span>
                            </Button>
                        </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className="grid gap-4 pt-2">
                        <FieldGroup className="hidden">
                            <Controller
                                name="category_ref_id"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field
                                        data-invalid={fieldState.invalid}
                                        className="gap-1"
                                    >
                                        <FieldLabel htmlFor="category_ref_id">
                                            ID
                                        </FieldLabel>
                                        <FormInput
                                            {...field}
                                            id="category_ref_id"
                                            type="text"
                                            autoComplete="off"
                                            aria-invalid={fieldState.invalid}
                                            readOnly
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
                                name="category_key"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field
                                        data-invalid={fieldState.invalid}
                                        className="gap-1"
                                    >
                                        <FieldLabel htmlFor="category_key">
                                            Key
                                        </FieldLabel>
                                        <FormInput
                                            {...field}
                                            id="category_key"
                                            type="text"
                                            autoComplete="off"
                                            aria-invalid={fieldState.invalid}
                                            readOnly
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
                                name="category_name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field
                                        data-invalid={fieldState.invalid}
                                        className="gap-1"
                                    >
                                        <FieldLabel htmlFor="category_name">
                                            Name
                                        </FieldLabel>
                                        <FormInput
                                            {...field}
                                            id="category_name"
                                            type="text"
                                            autoComplete="off"
                                            aria-invalid={fieldState.invalid}
                                            readOnly
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
                                name="category_color_name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field
                                        data-invalid={fieldState.invalid}
                                        className="gap-1"
                                    >
                                        <FieldLabel htmlFor="category_color_name">
                                            Color Name
                                        </FieldLabel>
                                        <FormInput
                                            {...field}
                                            id="category_color_name"
                                            type="text"
                                            autoComplete="off"
                                            aria-invalid={fieldState.invalid}
                                            readOnly
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
                    </CollapsibleContent>
                </Collapsible>

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
