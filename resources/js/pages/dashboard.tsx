import { ChartFeaturesByStatus } from '@/components/chart/chart-features-by-status';
import { ChartIssueByProject } from '@/components/chart/chart-issue-by-project';
import { ChartIssuesByPriority } from '@/components/chart/chart-issues-by-priority';
import { ChartIssuesByStatus } from '@/components/chart/chart-issues-by-status';
import { ChartLibraries } from '@/components/chart/chart-libraries';
import { ChartTopLibraries } from '@/components/chart/chart-top-libraries';
import { StatsCards } from '@/components/dashboard/stats-cards';
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
    overview: {
        total_features: number;
        total_issues: number;
        total_libraries: number;
        total_projects: number;
    };
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
        issue_by_status: {
            status: string;
            count: number;
        }[];
        issue_by_priority: {
            priority: string;
            count: number;
        }[];
        feature_by_status: {
            status: string;
            count: number;
        }[];
        top_libraries: {
            name: string;
            count: number;
        }[];
    };
}

export default function Dashboard(props: Props) {
    const { count, overview } = props;

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
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCards overview={overview} />
                </div>

                {/* First Row - Issues and Libraries Overview */}
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

                {/* Second Row - Issues and Features by Status */}
                <div className="grid auto-rows-min gap-4 lg:grid-cols-2">
                    <ChartIssuesByStatus data={count.issue_by_status} />
                    <ChartFeaturesByStatus data={count.feature_by_status} />
                </div>

                {/* Third Row - Issues by Priority and Top Libraries */}
                <div className="grid auto-rows-min gap-4 lg:grid-cols-2">
                    <ChartIssuesByPriority data={count.issue_by_priority} />
                    <ChartTopLibraries data={count.top_libraries} />
                </div>
            </div>
        </AppLayout>
    );
}
