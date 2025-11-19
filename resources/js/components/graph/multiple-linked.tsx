import { useAppearance } from '@/hooks/use-appearance';
import { NODE_COLORS, getNodeColor } from '@/lib/graph-constants';
import { Graph } from '@/types/graph';
import { SquareIcon } from 'lucide-react';
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
}

interface Link {
    source: string;
    target: string;
    label: string;
    isCrossGraph?: boolean;
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

        data.forEach((graphItem, graphIndex) => {
            // Central issue node for each graph
            nodes.push({
                id: `${graphItem.key}-${graphIndex}`,
                label: graphItem.key,
                type: 'issue',
                val: 20,
                color: getNodeColor('issue'),
                typeDescription: 'Issue Key',
                graphIndex,
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

            // Issue type node
            if (graphItem.issuetype) {
                const typeKey = `type-${graphItem.issuetype}`;
                const typeId = `${typeKey}-${graphIndex}`;

                nodes.push({
                    id: typeId,
                    label: graphItem.issuetype,
                    type: 'issuetype',
                    val: 12,
                    color: getNodeColor('issuetype'),
                    typeDescription: 'Issue Type',
                });

                if (!sharedNodeMap.issuetype[graphItem.issuetype]) {
                    sharedNodeMap.issuetype[graphItem.issuetype] = [];
                }
                sharedNodeMap.issuetype[graphItem.issuetype].push(typeId);

                links.push({
                    source: `${graphItem.key}-${graphIndex}`,
                    target: typeId,
                    label: 'issue type',
                    isCrossGraph: false,
                });
            }

            // Priority node
            if (graphItem.priority) {
                const priorityKey = `priority-${graphItem.priority}`;
                const priorityId = `${priorityKey}-${graphIndex}`;

                nodes.push({
                    id: priorityId,
                    label: graphItem.priority,
                    type: 'priority',
                    val: 12,
                    color: getNodeColor('priority'),
                    typeDescription: 'Priority',
                });

                if (!sharedNodeMap.priority[graphItem.priority]) {
                    sharedNodeMap.priority[graphItem.priority] = [];
                }
                sharedNodeMap.priority[graphItem.priority].push(priorityId);

                links.push({
                    source: `${graphItem.key}-${graphIndex}`,
                    target: priorityId,
                    label: 'priority',
                    isCrossGraph: false,
                });
            }

            // Status node
            if (graphItem.status) {
                const statusKey = `status-${graphItem.status}`;
                const statusId = `${statusKey}-${graphIndex}`;

                nodes.push({
                    id: statusId,
                    label: graphItem.status,
                    type: 'status',
                    val: 12,
                    color: getNodeColor('status'),
                    typeDescription: 'Status',
                });

                if (!sharedNodeMap.status[graphItem.status]) {
                    sharedNodeMap.status[graphItem.status] = [];
                }
                sharedNodeMap.status[graphItem.status].push(statusId);

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
                });
                links.push({
                    source: `${graphItem.key}-${graphIndex}`,
                    target: componentsGroupId,
                    label: 'affected components',
                    isCrossGraph: false,
                });

                graphItem.components.forEach((component) => {
                    const componentKey = `component-${component}`;
                    const componentId = `${componentKey}-${graphIndex}`;

                    nodes.push({
                        id: componentId,
                        label: component,
                        type: 'component',
                        val: 6,
                        color: getNodeColor('component'),
                        originalLabel: component,
                    });

                    if (!sharedNodeMap.component[component]) {
                        sharedNodeMap.component[component] = [];
                    }
                    sharedNodeMap.component[component].push(componentId);

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
                    const methodId = `${methodKey}-${graphIndex}`;

                    nodes.push({
                        id: methodId,
                        label: showMethodLabels ? method : '',
                        type: 'method',
                        val: 6,
                        color: getNodeColor('method'),
                        originalLabel: method,
                    });

                    if (!sharedNodeMap.method[method]) {
                        sharedNodeMap.method[method] = [];
                    }
                    sharedNodeMap.method[method].push(methodId);

                    links.push({
                        source: methodsGroupId,
                        target: methodId,
                        label: '',
                        isCrossGraph: false,
                    });
                });
            }
        });

        // Add cross-graph links for shared nodes
        Object.entries(sharedNodeMap).forEach(([type, nodesByValue]) => {
            Object.values(nodesByValue).forEach((nodeIds) => {
                // Link nodes with same value across different graphs
                if (nodeIds.length > 1) {
                    for (let i = 0; i < nodeIds.length - 1; i++) {
                        links.push({
                            source: nodeIds[i],
                            target: nodeIds[i + 1],
                            label: 'same ' + type,
                            isCrossGraph: true,
                        });
                    }
                }
            });
        });

        setGraphData({ nodes, links });
    }, [data]);

    useEffect(() => {
        // Center graph after data is loaded
        if (graphRef.current && graphData.nodes.length > 0) {
            setTimeout(() => {
                graphRef.current?.zoomToFit(400, 50);
            }, 100);
        }
    }, [graphData]);

    return (
        <div ref={containerRef} className="relative h-full w-full">
            <div className="absolute z-10 flex flex-col gap-1 rounded-md border bg-slate-800 p-2 text-xs text-white opacity-25 shadow-md hover:opacity-75 dark:bg-slate-600">
                {Object.entries(NODE_COLORS).map(([type, config]) => (
                    <div key={type} className="flex items-center gap-1">
                        <SquareIcon
                            fill={config.color}
                            stroke={config.color}
                            className="h-4 w-4"
                        />
                        <span className="font-semibold">{config.label}</span>
                    </div>
                ))}
            </div>
            <ForceGraph2D
                ref={graphRef}
                graphData={graphData}
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

                    // Only draw label if it exists
                    if (label) {
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
                }}
                linkLabel="label"
                linkColor={(link: any) =>
                    link.isCrossGraph ? '#ef4444' : '#94a3b8'
                }
                linkWidth={(link: any) => (link.isCrossGraph ? 3 : 2)}
                linkLineDash={(link: any) =>
                    link.isCrossGraph ? [5, 5] : null
                }
                linkDirectionalParticles={(link: any) =>
                    link.isCrossGraph ? 4 : 2
                }
                linkDirectionalParticleWidth={(link: any) =>
                    link.isCrossGraph ? 3 : 2
                }
                linkDirectionalParticleColor={(link: any) =>
                    link.isCrossGraph ? '#ef4444' : '#94a3b8'
                }
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
