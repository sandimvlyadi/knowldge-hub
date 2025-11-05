import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MasterProject } from '@/types/master/project';
import { ColumnDef } from '@tanstack/react-table';
import { EditIcon, SquareArrowOutUpRightIcon } from 'lucide-react';

export const createColumns = (
    onEdit: (project: MasterProject) => void,
): ColumnDef<MasterProject>[] => [
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => {
            const project = row.original;
            return (
                <div className="flex items-center gap-1">
                    <Avatar className="h-6 w-6 border">
                        <AvatarImage src={project.avatar} alt={project.name} />
                        <AvatarFallback>{project.key}</AvatarFallback>
                    </Avatar>
                    <span>{project.name}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'key',
        header: 'Project Key',
        cell: ({ row }) => {
            const project = row.original;
            return (
                <a
                    href={`https://issues.apache.org/jira/browse/${project.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:underline"
                >
                    {project.key}
                    <SquareArrowOutUpRightIcon className="h-3 w-3 text-muted-foreground" />
                </a>
            );
        },
    },
    {
        accessorKey: 'url',
        header: 'URL',
        cell: ({ row }) => {
            const project = row.original;
            return (
                <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:underline"
                >
                    {project.url}
                    <SquareArrowOutUpRightIcon className="h-3 w-3 text-muted-foreground" />
                </a>
            );
        },
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => {
            const project = row.original;
            return (
                <span className="line-clamp-3 max-w-xs text-start whitespace-normal">
                    {project.description || 'No description'}
                </span>
            );
        },
    },
    {
        accessorKey: 'archived',
        header: 'Status',
        cell: ({ row }) => {
            const project = row.original;
            return (
                <Badge
                    className={project.archived ? 'bg-red-600' : 'bg-green-600'}
                >
                    {project.archived ? 'Archived' : 'Active'}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'action',
        header: '',
        cell: ({ row }) => {
            const project = row.original;
            return (
                <Button
                    variant="outline"
                    size="icon"
                    className="cursor-pointer"
                    onClick={() => onEdit(project)}
                >
                    <EditIcon />
                </Button>
            );
        },
    },
];
