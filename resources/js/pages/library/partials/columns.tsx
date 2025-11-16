import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Library as LibraryType } from '@/types/library';
import { ColumnDef } from '@tanstack/react-table';
import { EditIcon, SquareArrowOutUpRightIcon } from 'lucide-react';

export const createColumns = (
    onEdit: (record: LibraryType) => void,
): ColumnDef<LibraryType>[] => [
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => {
            const record = row.original;
            return (
                <p className="max-w-xs text-start break-words whitespace-normal">
                    {record.name}
                </p>
            );
        },
    },
    {
        accessorKey: 'url',
        header: 'URL',
        cell: ({ row }) => {
            const record = row.original;
            return (
                <p className="max-w-xs truncate">
                    <a
                        href={
                            record.url ||
                            `https://www.google.com/search?q=${record.name}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:underline"
                    >
                        {record.url || 'Search on Google'}
                        <SquareArrowOutUpRightIcon className="h-3 w-3 text-muted-foreground" />
                    </a>
                </p>
            );
        },
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => {
            const record = row.original;
            return record.description ? (
                record.description
            ) : (
                <div className="text-muted-foreground">
                    No description provided
                </div>
            );
        },
    },
    {
        accessorKey: 'used_in_issues_count',
        header: 'Used In Issues',
        cell: ({ row }) => {
            const record = row.original;
            return (
                <Badge variant="outline">
                    {record.used_in_issues_count} issue
                    {record.used_in_issues_count !== 1 ? 's' : ''}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'action',
        header: '',
        cell: ({ row }) => {
            const record = row.original;
            return (
                <div className="flex items-center justify-center">
                    <Button
                        variant="outline"
                        size="icon"
                        className="cursor-pointer"
                        onClick={() => onEdit(record)}
                    >
                        <EditIcon />
                    </Button>
                </div>
            );
        },
    },
];
