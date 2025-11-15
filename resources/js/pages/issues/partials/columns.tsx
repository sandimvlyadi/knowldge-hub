import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Issue } from '@/types/issue';
import { ColumnDef } from '@tanstack/react-table';
import { SquareArrowOutUpRightIcon } from 'lucide-react';

export const columns: ColumnDef<Issue>[] = [
    {
        accessorKey: 'project',
        header: 'Project',
        cell: ({ row }) => {
            const project = row.original.fields.project;
            return (
                <div className="flex items-center gap-1">
                    <Avatar className="h-6 w-6 border">
                        <AvatarImage
                            src={project.avatarUrls['48x48']}
                            alt={project.name}
                        />
                        <AvatarFallback>{project.key}</AvatarFallback>
                    </Avatar>
                    <span>{project.name}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'key',
        header: 'Issue Key',
        cell: ({ row }) => {
            const issue = row.original;
            return issue.key;
            return (
                <a
                    href={`https://issues.apache.org/jira/browse/${issue.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:underline"
                >
                    {issue.key}
                    <SquareArrowOutUpRightIcon className="h-3 w-3 text-muted-foreground" />
                </a>
            );
        },
    },
    {
        accessorKey: 'details',
        header: 'Details',
        cell: ({ row }) => {
            const issueType = row.original.fields.issuetype;
            const status = row.original.fields.status;
            const priority = row.original.fields.priority;
            const components = row.original.fields.components;

            let statusColor = `bg-neutral-500`;
            switch (status.statusCategory.key) {
                case 'new':
                    statusColor = 'bg-blue-800';
                    break;
                case 'indeterminate':
                    statusColor = 'bg-yellow-500';
                    break;
                case 'done':
                    statusColor = 'bg-green-800';
                    break;
                default:
                    statusColor = 'bg-neutral-500';
            }

            return (
                <div className="flex flex-col items-start gap-1">
                    <Tooltip>
                        <TooltipTrigger>
                            <div className="flex items-center gap-1">
                                <Avatar className="h-4 w-4">
                                    <AvatarImage
                                        src={issueType.iconUrl}
                                        alt={issueType.name}
                                    />
                                    <AvatarFallback>
                                        {issueType.name}
                                    </AvatarFallback>
                                </Avatar>
                                <span>{issueType.name}</span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <span>{issueType.description}</span>
                        </TooltipContent>
                    </Tooltip>
                    <div className="flex items-center gap-1">
                        <Avatar className="h-4 w-4">
                            <AvatarImage
                                src={priority.iconUrl}
                                alt={priority.name}
                            />
                            <AvatarFallback>{priority.name}</AvatarFallback>
                        </Avatar>
                        <span>{priority.name}</span>
                    </div>
                    <Tooltip>
                        <TooltipTrigger>
                            <Badge className={`${statusColor} uppercase`}>
                                {status.name}
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                            <span>{status.description}</span>
                        </TooltipContent>
                    </Tooltip>
                    {components.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {components.map((component) => (
                                <Badge variant="outline" key={component.id}>
                                    <small>{component.name}</small>
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'summary',
        header: 'Summary',
        cell: ({ row }) => {
            const issue = row.original;
            return (
                <Tooltip>
                    <TooltipTrigger>
                        <span className="line-clamp-5 max-w-xs text-start whitespace-normal">
                            {issue.fields.summary}
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div className="flex flex-col gap-1">
                            <span className="font-medium">
                                {issue.fields.summary}
                            </span>
                            <span>{issue.fields.description}</span>
                        </div>
                    </TooltipContent>
                </Tooltip>
            );
        },
    },
    {
        accessorKey: 'reporter',
        header: 'Reporter',
        cell: ({ row }) => {
            const reporter = row.original.fields.reporter;
            return (
                <div className="flex items-center gap-1">
                    <Avatar className="h-6 w-6">
                        <AvatarImage
                            src={reporter.avatarUrls['48x48']}
                            alt={reporter.displayName}
                        />
                        <AvatarFallback>{reporter.displayName}</AvatarFallback>
                    </Avatar>
                    <span>{reporter.displayName}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'methods',
        header: 'Methods',
        cell: ({ row }) => {
            const libraries = row.original.libraries;

            return (
                <Tooltip>
                    <TooltipTrigger>
                        <Badge variant="outline">
                            {libraries.length} method
                            {libraries.length !== 1 ? 's' : ''}
                        </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div className="flex max-w-sm flex-col gap-2">
                            {libraries.map((library, index) => (
                                <div key={index} className="flex flex-col">
                                    <span>{library.name}</span>
                                    <span className="text-sm text-muted-foreground">
                                        {library.description}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </TooltipContent>
                </Tooltip>
            );
        },
    },
    {
        accessorKey: 'created',
        header: 'Created',
        cell: ({ row }) => {
            const created = new Date(row.original.fields.created);
            return (
                <span>
                    {created.toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </span>
            );
        },
    },
];
