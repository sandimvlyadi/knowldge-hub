import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { useIsMobile } from '@/hooks/use-mobile';

const chartConfig = {
    all: {
        label: 'All',
        color: 'var(--chart-1)',
    },
    vectorized: {
        label: 'Vectorized',
        color: 'var(--chart-2)',
    },
    methods: {
        label: 'Methods',
        color: 'var(--chart-3)',
    },
} satisfies ChartConfig;

interface Props {
    title?: string;
    description?: string;
    data: {
        project: string;
        key: string;
        all: number;
        vectorized: number;
        methods: number;
    }[];
}

export function ChartIssueByProject(props: Props) {
    const { data, title = 'Issues by Project', description } = props;
    const isMobile = useIsMobile();

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={data}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey={isMobile ? 'key' : 'project'}
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Bar
                            dataKey="all"
                            stackId="a"
                            fill="var(--color-all)"
                            radius={[0, 0, 4, 4]}
                        />
                        <Bar
                            dataKey="vectorized"
                            stackId="a"
                            fill="var(--color-vectorized)"
                            radius={[0, 0, 0, 0]}
                        />
                        <Bar
                            dataKey="methods"
                            stackId="a"
                            fill="var(--color-methods)"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
