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
                href: '#',
                icon: TagsIcon,
            },
            {
                title: 'Priorities',
                href: '#',
                icon: TriangleAlertIcon,
            },
            {
                title: 'Statuses',
                href: '#',
                icon: CirclePlusIcon,
            },
        ],
    },
];
