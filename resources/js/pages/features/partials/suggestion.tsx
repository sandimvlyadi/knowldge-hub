import { MultipleLinkedGraph } from '@/components/graph/multiple-linked';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import features from '@/routes/features';
import issues from '@/routes/issues';
import { FeatureDetail } from '@/types/feature';
import { Graph as GraphType } from '@/types/graph';
import { Library } from '@/types/library';
import { Link } from '@inertiajs/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
    LocateFixedIcon,
    LocateIcon,
    MaximizeIcon,
    RefreshCwIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
    record: FeatureDetail;
    onLibrariesLoaded?: (libraries: Library[]) => void;
}

interface SuggestionDataProps {
    graph: GraphType;
    suggestions: GraphType[];
    libraries: Library[];
}

function useFeatureSuggestionData(key: string, acrossProjects = false) {
    return useQuery({
        queryKey: [
            'feature-suggestion',
            `${key}-${acrossProjects ? 'across' : 'same'}-project`,
        ],
        queryFn: async () => {
            const params: any = {
                across_projects: acrossProjects ? true : false,
            };

            const response = await axios.get<SuggestionDataProps>(
                features.key.suggestion.url(key),
                {
                    params,
                    withCredentials: true,
                },
            );

            return response.data;
        },
    });
}

export default function FeatureSuggestion(props: Props) {
    const { record, onLibrariesLoaded } = props;
    const [openDialog, setOpenDialog] = useState(false);
    const [acrossProjects, setAcrossProjects] = useState(false);

    const { data, isLoading, isFetching, error, refetch } =
        useFeatureSuggestionData(record.key, acrossProjects);

    useEffect(() => {
        if (data?.libraries && onLibrariesLoaded) {
            onLibrariesLoaded(data.libraries);
        }
    }, [data, acrossProjects]);

    const toggleDialog = () => {
        setOpenDialog(!openDialog);
    };

    const toggleAcrossProjects = () => {
        setAcrossProjects(!acrossProjects);
    };

    const renderGraphs = (data: SuggestionDataProps | undefined) => {
        if (!data || data.suggestions.length === 0) {
            return (
                <div className="text-sm text-muted-foreground">
                    No suggestion graphs available.
                </div>
            );
        }

        const combine = [data.graph, ...data.suggestions];
        return <MultipleLinkedGraph data={combine} />;
    };

    if (isLoading || isFetching) {
        return <Skeleton className="mb-6 h-[150px] rounded-lg" />;
    }

    if (error) {
        return (
            <div className="mb-6 rounded-lg border p-4">
                <h4 className="mb-4 text-lg font-semibold">Suggestion</h4>
                <div className="text-sm text-red-600">
                    Failed to load suggestion data.{' '}
                    <span
                        className="cursor-pointer font-semibold text-blue-600 hover:underline"
                        onClick={() => {
                            refetch();
                        }}
                    >
                        Reload <RefreshCwIcon className="inline h-3 w-3" />
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-6 rounded-lg border p-4">
            <div className="flex items-center justify-between">
                <h4 className="mb-4 text-lg font-semibold">
                    Feature Representation Graphs
                </h4>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="cursor-pointer"
                        onClick={toggleAcrossProjects}
                    >
                        {acrossProjects ? (
                            <Tooltip>
                                <TooltipTrigger>
                                    <LocateIcon className="h-4 w-4" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    Change to same project
                                </TooltipContent>
                            </Tooltip>
                        ) : (
                            <Tooltip>
                                <TooltipTrigger>
                                    <LocateFixedIcon className="h-4 w-4" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    Change to across projects
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="cursor-pointer"
                        onClick={toggleDialog}
                    >
                        <MaximizeIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="mb-4 flex items-center gap-2">
                <div className="flex-shrink-0 text-sm font-semibold">
                    Similarity Suggestion:
                </div>
                <div className="flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {data?.suggestions.map((graph, index) => (
                        <Link
                            key={`suggestion-${index}`}
                            href={issues.key.url(graph.key)}
                        >
                            <Badge
                                variant="secondary"
                                className="flex-shrink-0"
                            >
                                {graph.key} ({graph?.distance?.toFixed(2)})
                            </Badge>
                        </Link>
                    ))}
                </div>
            </div>
            {renderGraphs(data)}
            <Dialog open={openDialog} onOpenChange={toggleDialog}>
                <DialogContent className="!fixed !inset-0 !top-0 !left-0 m-0 h-screen w-screen !max-w-none !translate-x-0 !translate-y-0 gap-0 rounded-none border-0 p-0">
                    <div className="flex-1 overflow-hidden p-6">
                        {renderGraphs(data)}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
