export interface AvatarUrls {
    '48x48': string;
    '24x24': string;
    '16x16': string;
    '32x32': string;
}

export interface ProjectCategory {
    self: string;
    id: number;
    description: string;
    name: string;
}

export interface Project {
    self: string;
    id: number;
    key: string;
    name: string;
    projectTypeKey: string;
    avatarUrls: AvatarUrls;
    projectCategory: ProjectCategory;
    archived: boolean;
    exist?: boolean;
}
