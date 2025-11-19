import { SingleGraph } from '@/components/graph/single';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import features from '@/routes/features';
import { BreadcrumbItem } from '@/types';
import { FeatureDetail } from '@/types/feature';
import { Graph as GraphType } from '@/types/graph';
import { Library } from '@/types/library';
import { Head } from '@inertiajs/react';
import { MaximizeIcon } from 'lucide-react';
import { useState } from 'react';
import FeatureSuggestion from './partials/suggestion';

interface Props {
    record: FeatureDetail;
    graph?: GraphType;
}

export default function FeaturesDetail(props: Props) {
    const { record, graph } = props;
    const [openGraphDialog, setOpenGraphDialog] = useState(false);
    const [suggestedLibraries, setSuggestedLibraries] = useState<Library[]>([]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Features',
            href: features.index.url(),
        },
        {
            title: record.key,
            href: features.key.url({ key: record.key }),
        },
    ];

    const toggleGraphDialog = () => {
        setOpenGraphDialog(!openGraphDialog);
    };

    const handleLibrariesLoaded = (libraries: Library[]) => {
        setSuggestedLibraries(libraries);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={record.key} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Feature Header */}
                <div className="border-b">
                    <div className="mb-4 flex items-start justify-between">
                        <div className="flex items-start gap-3">
                            <Avatar className="h-12 w-12 rounded">
                                <AvatarImage
                                    src={record.project?.avatar}
                                    alt={record.project?.name}
                                />
                                <AvatarFallback className="rounded">
                                    {record.project?.key}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="text-sm text-blue-600 dark:text-blue-400">
                                    <a
                                        href={`https://features.apache.org/jira/browse/${record.project?.key}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:underline"
                                    >
                                        {record.project?.name}
                                    </a>{' '}
                                    /{' '}
                                    <span className="font-semibold text-primary">
                                        {record.key}
                                    </span>
                                </div>
                                <h1 className="text-xl font-semibold">
                                    {record.summary}
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Details Section */}
                        <div className="mb-6 rounded-lg border p-4">
                            <h4 className="mb-4 text-lg font-semibold">
                                Details
                            </h4>
                            <ul className="grid gap-2 lg:grid-cols-2 lg:gap-4">
                                <li>
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <span className="text-muted-foreground">
                                            Type:
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <Avatar className="h-4 w-4 rounded">
                                                <AvatarImage
                                                    src={
                                                        record.issue_type
                                                            ?.icon_url
                                                    }
                                                    alt={
                                                        record.issue_type?.name
                                                    }
                                                />
                                                <AvatarFallback className="rounded">
                                                    {record.issue_type?.name}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span>
                                                {record.issue_type?.name}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <span className="text-muted-foreground">
                                            Status:
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <Avatar className="h-4 w-4 rounded">
                                                <AvatarImage
                                                    src={
                                                        record.status?.icon_url
                                                    }
                                                    alt={record.status?.name}
                                                />
                                                <AvatarFallback className="rounded">
                                                    {record.status?.name}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span>{record.status?.name}</span>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <span className="text-muted-foreground">
                                            Priority:
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <Avatar className="h-4 w-4 rounded">
                                                <AvatarImage
                                                    src={
                                                        record.priority
                                                            ?.icon_url
                                                    }
                                                    alt={record.priority?.name}
                                                />
                                                <AvatarFallback className="rounded">
                                                    {record.priority?.name}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span>{record.priority?.name}</span>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <span className="text-muted-foreground">
                                            Components:
                                        </span>
                                        <div className="flex gap-1">
                                            {record.components
                                                ? record.components
                                                      .split(',')
                                                      .map((component) => (
                                                          <Badge
                                                              key={`component-${component.trim()}`}
                                                              variant="outline"
                                                          >
                                                              {component.trim()}
                                                          </Badge>
                                                      ))
                                                : 'None'}
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Suggestion Section */}
                        <FeatureSuggestion
                            record={record}
                            onLibrariesLoaded={handleLibrariesLoaded}
                        />

                        {/* Description Section */}
                        <div className="rounded-lg border p-4">
                            <h4 className="mb-4 text-lg font-semibold">
                                Description
                            </h4>
                            <div className="prose prose-sm max-w-none overflow-auto">
                                {record.description ? (
                                    <div className="text-sm whitespace-pre-wrap">
                                        {record.description}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">
                                        No description provided
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Method Section */}
                        <div className="mb-6 rounded-lg border p-4">
                            <h4 className="mb-4 text-lg font-semibold">
                                Suggested Methods
                            </h4>
                            <div className="prose prose-sm flex max-h-75 max-w-none flex-col gap-2 overflow-auto text-sm font-medium">
                                {suggestedLibraries.length > 0 ? (
                                    suggestedLibraries.map((library) => (
                                        <div
                                            className="flex flex-col gap-1 border-b pb-3"
                                            key={`library-${library.name}`}
                                        >
                                            <div className="flex items-center">
                                                <a
                                                    href={
                                                        library.url ||
                                                        `https://www.google.com/search?q=${library.name}`
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="truncate hover:underline"
                                                >
                                                    {library.name}
                                                </a>
                                                <div className="ml-auto flex items-center gap-1">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Badge variant="outline">
                                                                {
                                                                    library.used_in_issues_count
                                                                }
                                                            </Badge>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            Used in{' '}
                                                            {
                                                                library.used_in_issues_count
                                                            }{' '}
                                                            issues
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Badge variant="outline">
                                                                {library?.distance?.toFixed(
                                                                    2,
                                                                ) || 0}
                                                            </Badge>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            Distance:{' '}
                                                            {library?.distance?.toFixed(
                                                                2,
                                                            ) || 0}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {library.description ||
                                                    'No description provided'}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted-foreground">
                                        No suggested method provided
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Graph Section */}
                        <div className="mb-6 rounded-lg border p-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-lg font-semibold">Graph</h4>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="cursor-pointer"
                                    onClick={toggleGraphDialog}
                                >
                                    <MaximizeIcon className="h-4 w-4" />
                                </Button>
                            </div>
                            {graph ? (
                                <SingleGraph data={graph} />
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No graph data available
                                </p>
                            )}
                        </div>

                        {/* People Section */}
                        <div className="mb-6 rounded-lg border p-4">
                            <h4 className="mb-4 text-lg font-semibold">
                                People
                            </h4>
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <span className="text-muted-foreground">
                                    Reporter:
                                </span>
                                <div className="flex items-center gap-1">
                                    <Avatar className="h-6 w-6 rounded">
                                        <AvatarImage
                                            src={record.reporter?.avatar}
                                            alt={record.reporter?.name}
                                        />
                                        <AvatarFallback className="rounded">
                                            {record.reporter?.name}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span>{record.reporter?.display_name}</span>
                                </div>
                            </div>
                        </div>

                        {/* Dates Section */}
                        <div className="rounded-lg border p-4">
                            <h4 className="mb-4 text-lg font-semibold">
                                Dates
                            </h4>
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <span className="text-muted-foreground">
                                    Created:
                                </span>
                                <div className="flex items-center gap-1">
                                    <span>
                                        {new Date(
                                            record.created_at,
                                        ).toLocaleDateString('en-US', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Dialog open={openGraphDialog} onOpenChange={toggleGraphDialog}>
                <DialogContent className="!fixed !inset-0 !top-0 !left-0 m-0 h-screen w-screen !max-w-none !translate-x-0 !translate-y-0 gap-0 rounded-none border-0 p-0">
                    <DialogHeader className="px-6 pt-6 pb-4">
                        <DialogTitle>Graph: {record.key}</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-hidden px-6 pb-6">
                        {graph ? (
                            <SingleGraph data={graph} />
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No graph data available
                            </p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
