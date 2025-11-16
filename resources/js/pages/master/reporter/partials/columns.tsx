import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MasterReporter } from '@/types/master';
import { ColumnDef } from '@tanstack/react-table';
import { EditIcon } from 'lucide-react';

export const createColumns = (
    onEdit: (record: MasterReporter) => void,
): ColumnDef<MasterReporter>[] => [
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => {
            const record = row.original;
            return (
                <div className="flex items-center gap-1">
                    <Avatar className="h-6 w-6 border">
                        <AvatarImage src={record.avatar} alt={record.name} />
                        <AvatarFallback>{record.name}</AvatarFallback>
                    </Avatar>
                    <span>{record.display_name}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'time_zone',
        header: 'Time Zone',
        cell: ({ row }) => {
            const record = row.original;
            return record.time_zone;
        },
    },
    {
        accessorKey: 'active',
        header: 'Status',
        cell: ({ row }) => {
            const project = row.original;
            return (
                <Badge
                    className={project.active ? 'bg-green-600' : 'bg-red-600'}
                >
                    {project.active ? 'Active' : 'Inactive'}
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
