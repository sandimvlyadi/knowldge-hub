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
import { IssueType as IssueTypeOption } from '@/types/external';
import { MasterIssueType as DataResponse } from '@/types/master';
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
    ref_id: z.string().min(1, 'Issue Type is required.'),
    name: z.string().min(1, 'Name is required.'),
    icon_url: z.url('Invalid URL format.').min(1, 'URL is required.'),
    description: z.string().min(1, 'Description is required.'),
});

export default function MasterIssueTypeForm({
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
        },
    });

    const {
        options,
        data: issueTypesData,
        loading: loadingOptions,
    } = useOptions<IssueTypeOption>({
        url: external.getOptions.url(),
        params: { type: 'issueType' },
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
        queryKey: ['master-issue-types'],
        storePath: master.issuetypes.store.url(),
        updatePath: (id) => master.issuetypes.update.url(id),
        deletePath: (id) => master.issuetypes.destroy.url(id),
        entityName: 'Issue Type',
    });

    useEffect(() => {
        if (state === 'edit' && record) {
            form.reset({
                id: record.id.toString(),
                ref_id: record.ref_id.toString(),
                name: record.name,
                icon_url: record.icon_url,
                description: record.description,
            });
        } else if (state === 'add') {
            form.reset({
                id: '',
                ref_id: '',
                name: '',
                icon_url: '',
                description: '',
            });
        }
    }, [state, record, form]);

    const handleIssueTypeChange = (value: string) => {
        const selectedIssueType = issueTypesData.find(
            (p) => p.id.toString() === value,
        );

        if (selectedIssueType) {
            form.setValue('ref_id', value);
            form.setValue('name', selectedIssueType.name);
            form.setValue('icon_url', selectedIssueType.iconUrl);
            form.setValue('description', selectedIssueType.description || '');
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
            title={`${state === 'add' ? 'Add' : 'Edit'} Issue Type`}
            onSave={form.handleSubmit(onSubmit)}
            onDelete={state === 'edit' ? onDelete : undefined}
            loading={loading}
            state={state}
        >
            <form id="form-master-issue-type" className="contents">
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
                                    Issue Type
                                </FieldLabel>
                                <FormCombobox
                                    id="ref_id"
                                    placeholder="Select issue type..."
                                    searchPlaceholder="Search issue types..."
                                    aria-invalid={fieldState.invalid}
                                    options={options}
                                    isLoading={loadingOptions}
                                    value={field.value}
                                    onChange={(value) => {
                                        field.onChange(value);
                                        handleIssueTypeChange(value);
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
