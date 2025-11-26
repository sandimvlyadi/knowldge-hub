import {
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    XAxis,
    YAxis,
} from 'recharts';

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
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
    count: {
        label: 'Issues',
        color: 'var(--chart-2)',
    },
} satisfies ChartConfig;

interface Props {
    title?: string;
    description?: string;
    data: {
        priority: string;
        count: number;
    }[];
}

export function ChartIssuesByPriority(props: Props) {
    const { data, title = 'Issues by Priority', description } = props;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                {description && (
                    <CardDescription>{description}</CardDescription>
                )}
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={data}
                        layout="vertical"
                        margin={{
                            left: 0,
                        }}
                    >
                        <CartesianGrid horizontal={false} />
                        <YAxis
                            dataKey="priority"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            width={80}
                        />
                        <XAxis dataKey="count" type="number" hide />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar
                            dataKey="count"
                            fill="var(--color-count)"
                            radius={5}
                        >
                            <LabelList
                                dataKey="count"
                                position="right"
                                offset={8}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
