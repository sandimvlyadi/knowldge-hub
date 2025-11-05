import { Input } from '@/components/ui/input';
import * as React from 'react';

export interface FormInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * Form-integrated Input Component
 *
 * Wrapper untuk Input component yang sudah terintegrasi dengan Inertia Form.
 * Komponen ini adalah alias untuk memudahkan konsistensi penamaan.
 *
 * @example
 * <FormInput
 *   name="email"
 *   type="email"
 *   placeholder="email@example.com"
 *   required
 * />
 */
export function FormInput(props: FormInputProps) {
    return <Input {...props} />;
}
