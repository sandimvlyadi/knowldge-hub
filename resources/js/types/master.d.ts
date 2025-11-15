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

export interface MasterPriority {
    id: number;
    ref_id: string;
    name: string;
    icon_url: string;
    status_color: string;
    description: string;
}

export interface MasterStatusCategory {
    id: number;
    ref_id: string;
    key: string;
    name: string;
    color_name: string;
}

export interface MasterStatus {
    id: number;
    ref_id: string;
    name: string;
    icon_url: string;
    description: string;
    status_category: MasterStatusCategory;
}

export interface MasterReporter {
    id: number;
    key: string;
    name: string;
    display_name: string;
    avatar: string;
    active: boolean;
    time_zone: string;
}
