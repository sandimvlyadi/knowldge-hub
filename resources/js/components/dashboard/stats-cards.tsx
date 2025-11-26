import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { thousand } from '@/lib/utils';
import {
    DatabaseIcon,
    FileCodeIcon,
    FolderGit2Icon,
    MessageCircleCodeIcon,
} from 'lucide-react';

interface Props {
    overview: {
        total_features: number;
        total_issues: number;
        total_libraries: number;
        total_projects: number;
    };
}

export function StatsCards(props: Props) {
    const { overview } = props;

    const stats = [
        {
            title: 'Total Projects',
            value: overview.total_projects,
            icon: FolderGit2Icon,
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-100 dark:bg-blue-950',
        },
        {
            title: 'Total Features',
            value: overview.total_features,
            icon: FileCodeIcon,
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-100 dark:bg-purple-950',
        },
        {
            title: 'Total Issues',
            value: overview.total_issues,
            icon: MessageCircleCodeIcon,
            color: 'text-orange-600 dark:text-orange-400',
            bgColor: 'bg-orange-100 dark:bg-orange-950',
        },
        {
            title: 'Total Libraries',
            value: overview.total_libraries,
            icon: DatabaseIcon,
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-100 dark:bg-green-950',
        },
    ];

    return (
        <>
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                                <Icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {thousand(stat.value)}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </>
    );
}
