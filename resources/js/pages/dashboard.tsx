import { ChartIssueByProject } from '@/components/chart/chart-issue-by-project';
import { ChartLibraries } from '@/components/chart/chart-libraries';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { thousand } from '@/lib/utils';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface Props {
    count: {
        library: {
            library_with_description: number;
            library_all: number;
        };
        issue_by_project: {
            project_key: string;
            project_name: string;
            project_avatar: string;
            issue_with_library: number;
            issue_vectorized: number;
            issue_all: number;
        }[];
    };
}

export default function Dashboard(props: Props) {
    const { count } = props;

    const totalIssues = count.issue_by_project.reduce(
        (acc, item) => acc + item.issue_all,
        0,
    );
    const totalProjects = count.issue_by_project.length;

    const dataIssueByProject = count.issue_by_project.map((item) => ({
        project: item.project_name,
        key: item.project_key,
        all: item.issue_all,
        vectorized: item.issue_vectorized,
        methods: item.issue_with_library,
    }));

    const dataLibraries = [
        {
            category: 'no_description',
            count:
                count.library.library_all -
                count.library.library_with_description,
            fill: 'var(--color-no_description)',
        },
        {
            category: 'with_description',
            count: count.library.library_with_description,
            fill: 'var(--color-with_description)',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 lg:grid-cols-2">
                    <ChartIssueByProject
                        data={dataIssueByProject}
                        description={`${thousand(totalIssues)} issues across ${totalProjects} projects`}
                    />
                    <ChartLibraries
                        data={dataLibraries}
                        description={`We collect ${thousand(count.library.library_all)} methods from various libraries`}
                    />
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
