import { useAppearance } from '@/hooks/use-appearance';
import { NODE_COLORS, getNodeColor } from '@/lib/graph-constants';
import { Graph } from '@/types/graph';
import { EyeIcon, EyeOffIcon, SquareIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
// @ts-ignore
import ForceGraph2D from 'react-force-graph-2d';

interface Node {
    id: string;
    label: string;
    type: string;
    val: number;
    color: string;
    originalLabel?: string;
    typeDescription?: string;
    graphIndex?: number;
    opacity?: number;
}

interface Link {
    source: string;
    target: string;
    label: string;
    isCrossGraph?: boolean;
    distance?: number;
}

interface GraphData {
    nodes: Node[];
    links: Link[];
}

interface MultipleLinkedGraphProps {
    data: Graph[];
}

export function MultipleLinkedGraph({ data }: MultipleLinkedGraphProps) {
    const graphRef = useRef<any>(null);
    const [graphData, setGraphData] = useState<GraphData>({
        nodes: [],
        links: [],
    });
    const [dimensions, setDimensions] = useState({ width: 0, height: 400 });
    const containerRef = useRef<HTMLDivElement>(null);
    const { appearance = 'system' } = useAppearance();
    const [showLabels, setShowLabels] = useState(true);
    const [visibleNodeTypes, setVisibleNodeTypes] = useState<
        Record<string, boolean>
    >({
        issue: true,
        project: true,
        reporter: true,
        issuetype: true,
        priority: true,
        status: true,
        component: true,
        method: true,
    });

    const toggleNodeType = (type: string) => {
        if (type === 'issue') return; // Issue nodes cannot be hidden
        setVisibleNodeTypes((prev) => ({ ...prev, [type]: !prev[type] }));
    };

    useEffect(() => {
        // Update dimensions on mount and resize
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight,
                });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    useEffect(() => {
        // Transform multiple graph data to combined graph format with cross-graph links
        const nodes: Node[] = [];
        const links: Link[] = [];

        // Track shared nodes across graphs
        const sharedNodeMap: Record<string, Record<string, string[]>> = {
            project: {},
            reporter: {},
            issuetype: {},
            priority: {},
            status: {},
            component: {},
            method: {},
        };

        // Find max distance for opacity calculation
        const maxDistance = Math.max(
            ...data
                .filter((item) => item.distance !== undefined)
                .map((item) => item.distance!),
            1, // Minimum value to avoid division by zero
        );

        data.forEach((graphItem, graphIndex) => {
            // Calculate opacity based on distance (0 distance = 100% opacity, max distance = lower opacity)
            // First graph (index 0) always has 100% opacity
            const opacity =
                graphIndex === 0 || graphItem.distance === undefined
                    ? 1.0
                    : Math.max(0.3, 1 - graphItem.distance / maxDistance);

            // Central issue node for each graph
            nodes.push({
                id: `${graphItem.key}-${graphIndex}`,
                label: graphItem.key,
                type: 'issue',
                val: 20,
                color: getNodeColor('issue'),
                typeDescription: 'Issue Key',
                graphIndex,
                opacity,
            });

            // Project node - shared across graphs
            if (graphItem.project) {
                const projectKey = `project-${graphItem.project}`;
                const projectId = `${projectKey}-shared`;

                if (!sharedNodeMap.project[graphItem.project]) {
                    sharedNodeMap.project[graphItem.project] = [];
                    nodes.push({
                        id: projectId,
                        label: graphItem.project,
                        type: 'project',
                        val: 18,
                        color: getNodeColor('project'),
                        typeDescription: 'Project',
                    });
                }
                sharedNodeMap.project[graphItem.project].push(
                    `${graphItem.key}-${graphIndex}`,
                );

                links.push({
                    source: `${graphItem.key}-${graphIndex}`,
                    target: projectId,
                    label: 'belongs to',
                    isCrossGraph: false,
                });
            }

            // Issue type node - shared across graphs
            if (graphItem.issuetype) {
                const typeKey = `type-${graphItem.issuetype}`;
                const typeId = `${typeKey}-shared`;

                if (!sharedNodeMap.issuetype[graphItem.issuetype]) {
                    sharedNodeMap.issuetype[graphItem.issuetype] = [];
                    nodes.push({
                        id: typeId,
                        label: graphItem.issuetype,
                        type: 'issuetype',
                        val: 12,
                        color: getNodeColor('issuetype'),
                        typeDescription: 'Issue Type',
                    });
                }
                sharedNodeMap.issuetype[graphItem.issuetype].push(
                    `${graphItem.key}-${graphIndex}`,
                );

                links.push({
                    source: `${graphItem.key}-${graphIndex}`,
                    target: typeId,
                    label: 'issue type',
                    isCrossGraph: false,
                });
            }

            // Priority node - shared across graphs
            if (graphItem.priority) {
                const priorityKey = `priority-${graphItem.priority}`;
                const priorityId = `${priorityKey}-shared`;

                if (!sharedNodeMap.priority[graphItem.priority]) {
                    sharedNodeMap.priority[graphItem.priority] = [];
                    nodes.push({
                        id: priorityId,
                        label: graphItem.priority,
                        type: 'priority',
                        val: 12,
                        color: getNodeColor('priority'),
                        typeDescription: 'Priority',
                    });
                }
                sharedNodeMap.priority[graphItem.priority].push(
                    `${graphItem.key}-${graphIndex}`,
                );

                links.push({
                    source: `${graphItem.key}-${graphIndex}`,
                    target: priorityId,
                    label: 'priority',
                    isCrossGraph: false,
                });
            }

            // Status node - shared across graphs
            if (graphItem.status) {
                const statusKey = `status-${graphItem.status}`;
                const statusId = `${statusKey}-shared`;

                if (!sharedNodeMap.status[graphItem.status]) {
                    sharedNodeMap.status[graphItem.status] = [];
                    nodes.push({
                        id: statusId,
                        label: graphItem.status,
                        type: 'status',
                        val: 12,
                        color: getNodeColor('status'),
                        typeDescription: 'Status',
                    });
                }
                sharedNodeMap.status[graphItem.status].push(
                    `${graphItem.key}-${graphIndex}`,
                );

                links.push({
                    source: `${graphItem.key}-${graphIndex}`,
                    target: statusId,
                    label: 'status',
                    isCrossGraph: false,
                });
            }

            // Reporter node - shared across graphs
            if (graphItem.reporter) {
                const reporterKey = `reporter-${graphItem.reporter}`;
                const reporterId = `${reporterKey}-shared`;

                if (!sharedNodeMap.reporter[graphItem.reporter]) {
                    sharedNodeMap.reporter[graphItem.reporter] = [];
                    nodes.push({
                        id: reporterId,
                        label: graphItem.reporter,
                        type: 'reporter',
                        val: 15,
                        color: getNodeColor('reporter'),
                        typeDescription: 'Reporter',
                    });
                }
                sharedNodeMap.reporter[graphItem.reporter].push(
                    `${graphItem.key}-${graphIndex}`,
                );

                links.push({
                    source: `${graphItem.key}-${graphIndex}`,
                    target: reporterId,
                    label: 'reported by',
                    isCrossGraph: false,
                });
            }

            // Component nodes with group
            if (graphItem.components && graphItem.components.length > 0) {
                const componentsGroupId = `components-group-${graphIndex}`;
                nodes.push({
                    id: componentsGroupId,
                    label: `${graphItem.components.length.toString()}\nComponent${graphItem.components.length > 1 ? 's' : ''}`,
                    type: 'component',
                    val: 20,
                    color: getNodeColor('component'),
                    opacity,
                });
                links.push({
                    source: `${graphItem.key}-${graphIndex}`,
                    target: componentsGroupId,
                    label: 'affected components',
                    isCrossGraph: false,
                });

                graphItem.components.forEach((component) => {
                    const componentKey = `component-${component}`;
                    const componentId = `${componentKey}-shared`;

                    if (!sharedNodeMap.component[component]) {
                        sharedNodeMap.component[component] = [];
                        nodes.push({
                            id: componentId,
                            label: component,
                            type: 'component',
                            val: 6,
                            color: getNodeColor('component'),
                            originalLabel: component,
                        });
                    }

                    links.push({
                        source: componentsGroupId,
                        target: componentId,
                        label: '',
                        isCrossGraph: false,
                    });
                });
            }

            // Method nodes with group
            if (graphItem.methods && graphItem.methods.length > 0) {
                const methodsGroupId = `methods-group-${graphIndex}`;
                nodes.push({
                    id: methodsGroupId,
                    label: `${graphItem.methods.length.toString()}\nMethod${graphItem.methods.length > 1 ? 's' : ''}`,
                    type: 'method',
                    val: 20,
                    color: getNodeColor('method'),
                    opacity,
                });
                links.push({
                    source: `${graphItem.key}-${graphIndex}`,
                    target: methodsGroupId,
                    label: 'uses methods',
                    isCrossGraph: false,
                });

                const showMethodLabels = graphItem.methods.length < 10;
                graphItem.methods.forEach((method) => {
                    const methodKey = `method-${method}`;
                    const methodId = `${methodKey}-shared`;

                    if (!sharedNodeMap.method[method]) {
                        sharedNodeMap.method[method] = [];
                        nodes.push({
                            id: methodId,
                            label: showMethodLabels ? method : '',
                            type: 'method',
                            val: 6,
                            color: getNodeColor('method'),
                            originalLabel: method,
                        });
                    }

                    links.push({
                        source: methodsGroupId,
                        target: methodId,
                        label: '',
                        isCrossGraph: false,
                    });
                });
            }
        });

        // Cross-graph links are now implicit through shared nodes
        // No need to create separate links between duplicate nodes since they're the same node

        // Add distance links from first issue to other issues
        // Distance represents the distance from each issue to the first issue (index 0)
        data.forEach((graphItem, graphIndex) => {
            if (graphItem.distance !== undefined && graphIndex > 0) {
                // Link from first issue to this issue with distance
                links.push({
                    source: `${data[0].key}-0`,
                    target: `${graphItem.key}-${graphIndex}`,
                    label: `distance: ${graphItem.distance.toFixed(2)}`,
                    isCrossGraph: true,
                    distance: graphItem.distance,
                });
            }
        });

        setGraphData({ nodes, links });
    }, [data]);

    // Filter nodes and links based on visibility
    const filteredGraphData = {
        nodes: graphData.nodes.filter((node) => visibleNodeTypes[node.type]),
        links: graphData.links.filter((link) => {
            const sourceNode = graphData.nodes.find(
                (n) =>
                    n.id ===
                    (typeof link.source === 'object'
                        ? (link.source as any).id
                        : link.source),
            );
            const targetNode = graphData.nodes.find(
                (n) =>
                    n.id ===
                    (typeof link.target === 'object'
                        ? (link.target as any).id
                        : link.target),
            );
            return (
                sourceNode &&
                targetNode &&
                visibleNodeTypes[sourceNode.type] &&
                visibleNodeTypes[targetNode.type]
            );
        }),
    };

    useEffect(() => {
        // Center graph after data is loaded
        if (graphRef.current && filteredGraphData.nodes.length > 0) {
            setTimeout(() => {
                graphRef.current?.zoomToFit(400, 50);
            }, 100);
        }
    }, [filteredGraphData]);

    return (
        <div ref={containerRef} className="relative h-full w-full">
            <div className="absolute z-10 flex flex-col gap-2">
                <div className="flex flex-col gap-1 rounded-md border bg-slate-800 p-2 text-xs text-white opacity-25 shadow-md hover:opacity-75 dark:bg-slate-600">
                    {Object.entries(NODE_COLORS).map(([type, config]) => (
                        <button
                            key={type}
                            onClick={() => toggleNodeType(type)}
                            className={`flex items-center gap-1 text-left transition-opacity ${
                                type === 'issue'
                                    ? 'cursor-default'
                                    : 'cursor-pointer hover:opacity-80'
                            } ${
                                !visibleNodeTypes[type]
                                    ? 'line-through opacity-30'
                                    : ''
                            }`}
                            disabled={type === 'issue'}
                            title={
                                type === 'issue'
                                    ? 'Issue nodes cannot be hidden'
                                    : `Click to ${visibleNodeTypes[type] ? 'hide' : 'show'} ${config.label}`
                            }
                        >
                            <SquareIcon
                                fill={config.color}
                                stroke={config.color}
                                className="h-4 w-4"
                            />
                            <span className="font-semibold">
                                {config.label}
                            </span>
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => setShowLabels(!showLabels)}
                    className="flex items-center gap-2 rounded-md border bg-slate-800 p-2 text-xs text-white opacity-25 shadow-md transition-opacity hover:opacity-75 dark:bg-slate-600"
                    title={showLabels ? 'Hide labels' : 'Show labels'}
                >
                    {showLabels ? (
                        <EyeIcon className="h-4 w-4" />
                    ) : (
                        <EyeOffIcon className="h-4 w-4" />
                    )}
                    <span className="font-semibold">
                        {showLabels ? 'Hide Labels' : 'Show Labels'}
                    </span>
                </button>
            </div>
            <ForceGraph2D
                ref={graphRef}
                graphData={filteredGraphData}
                width={dimensions.width}
                height={dimensions.height}
                nodeLabel={(node: any) => {
                    if (node.typeDescription && node.label) {
                        return `${node.typeDescription}: ${node.label}`;
                    }
                    return node.originalLabel || node.label;
                }}
                nodeAutoColorBy="type"
                onNodeDragEnd={(node: any) => {
                    node.fx = node.x;
                    node.fy = node.y;
                }}
                nodeCanvasObject={(
                    node: any,
                    ctx: CanvasRenderingContext2D,
                    globalScale: number,
                ) => {
                    const label = node.label;
                    const fontSize = 12 / globalScale;
                    ctx.font = `${fontSize}px Sans-Serif`;

                    // Apply opacity for nodes with graphIndex (issue, component group, method group)
                    const nodeOpacity =
                        node.opacity !== undefined ? node.opacity : 1.0;
                    ctx.globalAlpha = nodeOpacity;

                    // Draw node circle
                    ctx.fillStyle = node.color;
                    ctx.beginPath();
                    ctx.arc(
                        node.x!,
                        node.y!,
                        node.val / 2,
                        0,
                        2 * Math.PI,
                        false,
                    );
                    ctx.fill();

                    // Only draw label if it exists and showLabels is true
                    if (label && showLabels) {
                        const isComponentChild =
                            node.type === 'component' &&
                            !node.typeDescription &&
                            !node.id.includes('components-group');
                        const isMethodChild =
                            node.type === 'method' &&
                            node.originalLabel &&
                            !node.id.includes('methods-group');

                        if (
                            node.id.includes('methods-group') ||
                            node.id.includes('components-group') ||
                            node.typeDescription
                        ) {
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillStyle =
                                appearance === 'dark' || appearance === 'system'
                                    ? '#ffffff'
                                    : '#1e293b';
                            ctx.font = `bold ${fontSize * 1.2}px Sans-Serif`;

                            const lines = label.split('\n');
                            const lineHeight = fontSize * 1.3;
                            const totalHeight = lines.length * lineHeight;
                            const startY =
                                node.y! - totalHeight / 2 + lineHeight / 2;

                            lines.forEach((line: string, i: number) => {
                                ctx.fillText(
                                    line,
                                    node.x!,
                                    startY + i * lineHeight,
                                );
                            });
                        } else if (isComponentChild || isMethodChild) {
                            const textWidth = ctx.measureText(label).width;
                            const bckgDimensions = [textWidth, fontSize].map(
                                (n) => n + fontSize * 0.4,
                            );

                            // Draw label background
                            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                            ctx.fillRect(
                                node.x! - bckgDimensions[0] / 2,
                                node.y! + node.val / 2 + 2,
                                bckgDimensions[0],
                                bckgDimensions[1],
                            );

                            // Draw label text
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillStyle = '#1b1b18';
                            ctx.fillText(
                                label,
                                node.x!,
                                node.y! +
                                    node.val / 2 +
                                    2 +
                                    bckgDimensions[1] / 2,
                            );
                        }
                    }

                    // Reset global alpha
                    ctx.globalAlpha = 1.0;
                }}
                linkLabel="label"
                linkColor={(link: any) =>
                    link.distance !== undefined
                        ? '#10b981'
                        : link.isCrossGraph
                          ? '#ef4444'
                          : '#94a3b8'
                }
                // linkWidth={(link: any) =>
                //     link.distance !== undefined ? 4 : link.isCrossGraph ? 3 : 2
                // }
                linkWidth={2}
                linkLineDash={(link: any) =>
                    link.distance !== undefined
                        ? [10, 5]
                        : link.isCrossGraph
                          ? [5, 5]
                          : null
                }
                linkDirectionalParticles={(link: any) =>
                    link.distance !== undefined ? 6 : link.isCrossGraph ? 4 : 2
                }
                linkDirectionalParticleWidth={(link: any) =>
                    link.distance !== undefined ? 4 : link.isCrossGraph ? 3 : 2
                }
                linkDirectionalParticleColor={(link: any) =>
                    link.distance !== undefined
                        ? '#10b981'
                        : link.isCrossGraph
                          ? '#ef4444'
                          : '#94a3b8'
                }
                linkCanvasObjectMode={() => 'after'}
                linkCanvasObject={(
                    link: any,
                    ctx: CanvasRenderingContext2D,
                    globalScale: number,
                ) => {
                    if (link.distance !== undefined && showLabels) {
                        const start = link.source;
                        const end = link.target;
                        const textPos = {
                            x: start.x + (end.x - start.x) / 2,
                            y: start.y + (end.y - start.y) / 2,
                        };

                        const label = `${link.distance.toFixed(2)}`;
                        const fontSize = 14 / globalScale;
                        ctx.font = `bold ${fontSize}px Sans-Serif`;
                        const textWidth = ctx.measureText(label).width;
                        const bckgDimensions = [
                            textWidth + fontSize * 0.4,
                            fontSize + fontSize * 0.2,
                        ];

                        // Draw background
                        ctx.fillStyle = 'rgba(16, 185, 129, 0.9)';
                        ctx.fillRect(
                            textPos.x - bckgDimensions[0] / 2,
                            textPos.y - bckgDimensions[1] / 2,
                            bckgDimensions[0],
                            bckgDimensions[1],
                        );

                        // Draw border
                        ctx.strokeStyle = '#ffffff';
                        ctx.lineWidth = 0.5 / globalScale;
                        ctx.strokeRect(
                            textPos.x - bckgDimensions[0] / 2,
                            textPos.y - bckgDimensions[1] / 2,
                            bckgDimensions[0],
                            bckgDimensions[1],
                        );

                        // Draw text
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = '#ffffff';
                        ctx.fillText(label, textPos.x, textPos.y);
                    }
                }}
                backgroundColor="transparent"
                cooldownTicks={100}
                onEngineStop={() => {
                    if (graphRef.current) {
                        graphRef.current.zoomToFit(400, 50);
                    }
                }}
            />
        </div>
    );
}
