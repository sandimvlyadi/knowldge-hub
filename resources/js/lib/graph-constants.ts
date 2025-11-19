export interface NodeTypeConfig {
    color: string;
    label: string;
}

export const NODE_COLORS: Record<string, NodeTypeConfig> = {
    issue: {
        color: '#3b82f6',
        label: 'Issue Key',
    },
    project: {
        color: '#f6ccf9',
        label: 'Project',
    },
    issuetype: {
        color: '#ec4899',
        label: 'Issue Type',
    },
    priority: {
        color: '#f59e0b',
        label: 'Priority',
    },
    status: {
        color: '#10b981',
        label: 'Status',
    },
    reporter: {
        color: '#06b6d4',
        label: 'Reporter',
    },
    component: {
        color: '#778f76',
        label: 'Component',
    },
    method: {
        color: '#f97316',
        label: 'Method',
    },
} as const;

// Helper function to get color only
export const getNodeColor = (type: string): string => {
    return NODE_COLORS[type]?.color || '#94a3b8';
};

// Helper function to get label only
export const getNodeLabel = (type: string): string => {
    return NODE_COLORS[type]?.label || type;
};
