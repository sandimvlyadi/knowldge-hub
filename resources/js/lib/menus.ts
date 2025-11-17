import { dashboard } from '@/routes';
import features from '@/routes/features';
import issues from '@/routes/issues';
import libraries from '@/routes/libraries';
import master from '@/routes/master';
import { NavItem } from '@/types';
import {
    CircleFadingArrowUpIcon,
    DatabaseIcon,
    FileCodeIcon,
    FolderGit2Icon,
    LayoutGridIcon,
    LibraryIcon,
    MessageCircleCodeIcon,
    TagsIcon,
    TriangleAlertIcon,
    UserSearchIcon,
} from 'lucide-react';

export const menus: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGridIcon,
    },
    {
        title: 'Features',
        href: features.index.url(),
        icon: FileCodeIcon,
    },
    {
        title: 'Issues',
        href: issues.index.url(),
        icon: MessageCircleCodeIcon,
    },
    {
        title: 'Libraries',
        href: libraries.index.url(),
        icon: LibraryIcon,
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
                icon: CircleFadingArrowUpIcon,
            },
            {
                title: 'Reporters',
                href: master.reporters.index.url(),
                icon: UserSearchIcon,
            },
        ],
    },
];
