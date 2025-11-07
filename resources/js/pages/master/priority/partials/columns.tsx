import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MasterPriority } from '@/types/master';
import { ColumnDef } from '@tanstack/react-table';
import { EditIcon } from 'lucide-react';

export const createColumns = (
    onEdit: (record: MasterPriority) => void,
): ColumnDef<MasterPriority>[] => [
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => {
            const record = row.original;
            return (
                <div className="flex items-center gap-1">
                    <Avatar
                        className="h-4 w-4 border border-1"
                        style={{
                            borderColor: `${record.status_color}`,
                        }}
                    >
                        <AvatarImage src={record.icon_url} alt={record.name} />
                        <AvatarFallback>{record.name}</AvatarFallback>
                    </Avatar>
                    <span>{record.name}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => {
            const record = row.original;
            return record.description;
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
