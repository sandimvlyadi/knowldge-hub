'use client';

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

const chartData = [
    { project: 'January', issues: 186 },
    { project: 'February', issues: 305 },
    { project: 'March', issues: 237 },
    { project: 'April', issues: 73 },
    { project: 'May', issues: 209 },
    { project: 'June', issues: 214 },
];

const chartConfig = {
    issues: {
        label: 'Issues',
        color: 'var(--chart-2)',
    },
    label: {
        color: 'var(--background)',
    },
} satisfies ChartConfig;

interface Props {
    title?: string;
    description?: string;
    data: {
        project: string;
        issues: number;
    }[];
}

export function ChartProjects(props: Props) {
    const { data, title = 'Projects', description } = props;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={data}
                        layout="vertical"
                        margin={{
                            right: 16,
                        }}
                    >
                        <CartesianGrid horizontal={false} />
                        <YAxis
                            dataKey="project"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                            hide
                        />
                        <XAxis dataKey="issues" type="number" hide />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Bar
                            dataKey="issues"
                            layout="vertical"
                            fill="var(--color-issues)"
                            radius={4}
                        >
                            <LabelList
                                dataKey="project"
                                position="insideLeft"
                                offset={8}
                                className="fill-(--color-label)"
                                fontSize={12}
                            />
                            <LabelList
                                dataKey="issues"
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
