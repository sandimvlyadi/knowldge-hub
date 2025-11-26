import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';

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

interface Props {
    title?: string;
    description?: string;
    data: {
        status: string;
        count: number;
    }[];
}

export function ChartIssuesByStatus(props: Props) {
    const { data, title = 'Issues by Status', description } = props;

    const totalCount = React.useMemo(() => {
        return data.reduce((acc, curr) => acc + curr.count, 0);
    }, [data]);

    // Generate dynamic chart config based on data
    const chartConfig = React.useMemo(() => {
        const config: ChartConfig = {
            count: {
                label: 'Issues',
            },
        };

        data.forEach((item, index) => {
            config[item.status] = {
                label: item.status,
                color: `var(--chart-${(index % 5) + 1})`,
            };
        });

        return config;
    }, [data]);

    // Generate dynamic colors for each status
    const chartData = data.map((item, index) => ({
        ...item,
        fill: `var(--chart-${(index % 5) + 1})`,
    }));

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>{title}</CardTitle>
                {description && (
                    <CardDescription>{description}</CardDescription>
                )}
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer config={chartConfig}>
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Pie
                            data={chartData}
                            dataKey="count"
                            nameKey="status"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (
                                        viewBox &&
                                        'cx' in viewBox &&
                                        'cy' in viewBox
                                    ) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalCount.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Issues
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
