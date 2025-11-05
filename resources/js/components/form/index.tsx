/**
 * Form Components - Global form components yang terintegrasi dengan Inertia Form
 *
 * Komponen-komponen ini dirancang untuk:
 * 1. Otomatis terbaca oleh Inertia Form menggunakan name attribute
 * 2. Dinamis dan reusable
 * 3. Type-safe dengan TypeScript
 * 4. Konsisten dengan design system
 *
 * @example
 * ```tsx
 * import { FormInput, FormSelect, FormCombobox } from '@/components/form';
 *
 * <Form {...Controller.store.form()}>
 *   {({ errors }) => (
 *     <>
 *       <FormInput name="email" type="email" required />
 *       <InputError message={errors.email} />
 *
 *       <FormSelect
 *         name="status"
 *         options={[
 *           { value: 'active', label: 'Active' },
 *           { value: 'inactive', label: 'Inactive' },
 *         ]}
 *       />
 *
 *       <FormCombobox
 *         name="category"
 *         options={categories}
 *         placeholder="Select category"
 *       />
 *     </>
 *   )}
 * </Form>
 * ```
 */

export { FormInput } from './form-input';
export type { FormInputProps } from './form-input';

export { FormTextarea } from './form-textarea';
export type { FormTextareaProps } from './form-textarea';

export { FormSelect } from './form-select';
export type { FormSelectProps, SelectOption } from './form-select';

export { FormCombobox } from './form-combobox';
export type { ComboboxOption, FormComboboxProps } from './form-combobox';

// Helpers
export {
    enumToSelectOptions,
    filterOptions,
    flattenGroupedOptions,
    sortOptions,
    toComboboxOptions,
    toSelectOptions,
} from './helpers';
export type { OptionGroup } from './helpers';
