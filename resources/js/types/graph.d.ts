export interface Graph {
    key: string;
    summary?: string;
    description?: string;
    components?: string[];
    project?: string;
    issuetype?: string;
    priority?: string;
    status?: string;
    reporter?: string;
    methods?: string[];
}
