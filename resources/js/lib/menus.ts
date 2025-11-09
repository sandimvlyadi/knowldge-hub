import { dashboard } from '@/routes';
import issues from '@/routes/issues';
import master from '@/routes/master';
import { NavItem } from '@/types';
import {
    BugIcon,
    CirclePlusIcon,
    DatabaseIcon,
    FolderGit2Icon,
    LayoutGridIcon,
    TagsIcon,
    TriangleAlertIcon,
} from 'lucide-react';

export const menus: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGridIcon,
    },
    {
        title: 'Issues',
        href: issues.index.url(),
        icon: BugIcon,
    },
    {
        title: 'Master',
        href: '#',
        icon: DatabaseIcon,
        children: [
            {
                title: 'Projects',
                href: master.projects.index.url(),
                icon: FolderGit2Icon,
            },
            {
                title: 'Issue Types',
                href: master.issuetypes.index.url(),
                icon: TagsIcon,
            },
            {
                title: 'Priorities',
                href: master.priorities.index.url(),
                icon: TriangleAlertIcon,
            },
            {
                title: 'Statuses',
                href: master.statuses.index.url(),
                icon: CirclePlusIcon,
            },
        ],
    },
];
