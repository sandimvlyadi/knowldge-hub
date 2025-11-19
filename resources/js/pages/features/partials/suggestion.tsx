import { MultipleLinkedGraph } from '@/components/graph/multiple-linked';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import features from '@/routes/features';
import { FeatureDetail } from '@/types/feature';
import { Graph as GraphType } from '@/types/graph';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { MaximizeIcon } from 'lucide-react';
import { useState } from 'react';

interface Props {
    record: FeatureDetail;
}

interface SuggestionDataProps {
    graph: GraphType;
    suggestions: GraphType[];
}

function useFeatureSuggestionData(key: string) {
    return useQuery({
        queryKey: ['feature-suggestion', key],
        queryFn: async () => {
            const response = await axios.get<SuggestionDataProps>(
                features.key.suggestion.url(key),
                {
                    withCredentials: true,
                },
            );

            return response.data;
        },
    });
}

export default function FeatureSuggestion(props: Props) {
    const { record } = props;
    const { data, isLoading, isFetching, error } = useFeatureSuggestionData(
        record.key,
    );
    const [openDialog, setOpenDialog] = useState(false);

    const toggleDialog = () => {
        setOpenDialog(!openDialog);
    };

    if (isLoading || isFetching) {
        return <Skeleton className="mb-6 h-[150px] rounded-lg" />;
    }

    if (error) {
        return (
            <div className="mb-6 rounded-lg border p-4">
                <h4 className="mb-4 text-lg font-semibold">Suggestion</h4>
                <div className="text-sm text-red-600">
                    Failed to load suggestion data.
                </div>
            </div>
        );
    }

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

    return (
        <div className="mb-6 rounded-lg border p-4">
            <div className="flex items-center justify-between">
                <h4 className="mb-4 text-lg font-semibold">
                    Feature Representation Graphs
                </h4>
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
