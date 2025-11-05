import type { ComboboxOption, SelectOption } from '@/components/form';

/**
 * Form Helper Utilities
 *
 * Helper functions untuk memudahkan konversi data ke format options
 */

/**
 * Mengkonversi array object ke SelectOption[]
 *
 * @example
 * const users = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
 * const options = toSelectOptions(users, 'id', 'name');
 * // [{ value: '1', label: 'John' }, { value: '2', label: 'Jane' }]
 */
export function toSelectOptions<T extends Record<string, any>>(
    data: T[],
    valueKey: keyof T,
    labelKey: keyof T,
    disabledKey?: keyof T,
): SelectOption[] {
    return data.map((item) => ({
        value: String(item[valueKey]),
        label: String(item[labelKey]),
        disabled: disabledKey ? Boolean(item[disabledKey]) : undefined,
    }));
}

/**
 * Mengkonversi array object ke ComboboxOption[]
 *
 * @example
 * const projects = [
 *   { id: 1, name: 'Project A', icon: Folder },
 *   { id: 2, name: 'Project B', icon: Folder }
 * ];
 * const options = toComboboxOptions(projects, 'id', 'name', 'icon');
 */
export function toComboboxOptions<T extends Record<string, any>>(
    data: T[],
    valueKey: keyof T,
    labelKey: keyof T,
    iconKey?: keyof T,
    disabledKey?: keyof T,
): ComboboxOption[] {
    return data.map((item) => ({
        value: String(item[valueKey]),
        label: String(item[labelKey]),
        icon: iconKey ? item[iconKey] : undefined,
        disabled: disabledKey ? Boolean(item[disabledKey]) : undefined,
    }));
}

/**
 * Mengkonversi enum ke SelectOption[]
 *
 * @example
 * enum Status {
 *   ACTIVE = 'active',
 *   INACTIVE = 'inactive'
 * }
 * const options = enumToSelectOptions(Status);
 * // [{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]
 */
export function enumToSelectOptions<T extends Record<string, string>>(
    enumObj: T,
    labelFormatter?: (value: string) => string,
): SelectOption[] {
    return Object.values(enumObj).map((value) => ({
        value: String(value),
        label: labelFormatter
            ? labelFormatter(value)
            : capitalize(value.replace(/_/g, ' ')),
    }));
}

/**
 * Capitalize string
 */
function capitalize(str: string): string {
    return str
        .split(' ')
        .map(
            (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(' ');
}

/**
 * Group options dengan separator
 *
 * @example
 * const options = [
 *   { value: '1', label: 'Active 1' },
 *   { value: '2', label: 'Active 2' },
 * ];
 * const grouped = groupOptions([
 *   { label: 'Active', options },
 *   { label: 'Inactive', options: [...] }
 * ]);
 */
export interface OptionGroup {
    label: string;
    options: SelectOption[];
}

export function flattenGroupedOptions(groups: OptionGroup[]): SelectOption[] {
    const result: SelectOption[] = [];

    groups.forEach((group, index) => {
        // Add separator label (disabled)
        if (index > 0) {
            result.push({
                value: `separator-${index}`,
                label: '─────────────',
                disabled: true,
            });
        }

        // Add group label (disabled)
        result.push({
            value: `group-${index}`,
            label: `── ${group.label} ──`,
            disabled: true,
        });

        // Add options
        result.push(...group.options);
    });

    return result;
}

/**
 * Filter options berdasarkan search query
 *
 * @example
 * const filtered = filterOptions(options, 'john');
 */
export function filterOptions<T extends { label: string; value: string }>(
    options: T[],
    query: string,
): T[] {
    const lowerQuery = query.toLowerCase();
    return options.filter(
        (option) =>
            option.label.toLowerCase().includes(lowerQuery) ||
            option.value.toLowerCase().includes(lowerQuery),
    );
}

/**
 * Sort options alphabetically
 */
export function sortOptions<T extends { label: string }>(
    options: T[],
    order: 'asc' | 'desc' = 'asc',
): T[] {
    return [...options].sort((a, b) => {
        const comparison = a.label.localeCompare(b.label);
        return order === 'asc' ? comparison : -comparison;
    });
}
