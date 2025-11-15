export interface IssueType {
    self: string;
    id: number;
    description: string;
    iconUrl: string;
    name: string;
    subtask: boolean;
    avatarId: number;
}

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
}

export interface StatusCategory {
    self: string;
    id: number;
    key: string;
    colorName: string;
    name: string;
}

export interface IssueStatus {
    self: string;
    description: string;
    iconUrl: string;
    name: string;
    id: number;
    statusCategory: StatusCategory;
}

export interface Priority {
    self: string;
    iconUrl: string;
    name: string;
    id: number;
}

export interface Reporter {
    self: string;
    name: string;
    key: string;
    avatarUrls: AvatarUrls;
    displayName: string;
    active: boolean;
    timeZone: string;
}

export interface Component {
    self: string;
    id: number;
    name: string;
}

export interface IssueFields {
    summary: string;
    issuetype: IssueType;
    created: string;
    description: string;
    project: Project;
    status: IssueStatus;
    priority: Priority;
    reporter: Reporter;
    components: Component[];
}

export interface Library {
    name: string;
    url: string;
    description: string;
}

export interface Issue {
    expand: string;
    id: number;
    self: string;
    key: string;
    fields: IssueFields;
    libraries: Library[];
}

export interface IssuesResponse {
    expand: string;
    startAt: number;
    maxResults: number;
    total: number;
    issues: Issue[];
}
