export interface MasterProject {
    id: number;
    ref_id: string;
    key: string;
    name: string;
    avatar: string;
    archived: boolean;
    url: string;
    description: string;
}

export interface MasterIssueType {
    id: number;
    ref_id: string;
    name: string;
    icon_url: string;
    description: string;
}
