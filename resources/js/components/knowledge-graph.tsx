import { Graph } from '@/types/graph';
import { useEffect, useRef, useState } from 'react';
// @ts-ignore
import ForceGraph2D from 'react-force-graph-2d';

interface Node {
    id: string;
    label: string;
    type: string;
    val: number;
    color: string;
}

interface Link {
    source: string;
    target: string;
    label: string;
}

interface GraphData {
    nodes: Node[];
    links: Link[];
}

interface KnowledgeGraphProps {
    data: Graph;
}

const nodeColors: Record<string, string> = {
    issue: '#3b82f6', // blue
    project: '#8b5cf6', // purple
    issuetype: '#ec4899', // pink
    priority: '#f59e0b', // amber
    status: '#10b981', // green
    reporter: '#06b6d4', // cyan
    component: '#6366f1', // indigo
    method: '#f97316', // orange
};

export function KnowledgeGraph({ data }: KnowledgeGraphProps) {
    const graphRef = useRef<any>(null);
    const [graphData, setGraphData] = useState<GraphData>({
        nodes: [],
        links: [],
    });
    const [dimensions, setDimensions] = useState({ width: 0, height: 400 });
    const containerRef = useRef<HTMLDivElement>(null);

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
        // Transform data to graph format
        const nodes: Node[] = [];
        const links: Link[] = [];

        // Central issue node
        nodes.push({
            id: data.key,
            label: data.key,
            type: 'issue',
            val: 20,
            color: nodeColors.issue,
        });

        // Project node
        if (data.project) {
            nodes.push({
                id: `project-${data.project}`,
                label: data.project,
                type: 'project',
                val: 15,
                color: nodeColors.project,
            });
            links.push({
                source: data.key,
                target: `project-${data.project}`,
                label: 'belongs to',
            });
        }

        // Issue type node
        if (data.issuetype) {
            nodes.push({
                id: `type-${data.issuetype}`,
                label: data.issuetype,
                type: 'issuetype',
                val: 12,
                color: nodeColors.issuetype,
            });
            links.push({
                source: data.key,
                target: `type-${data.issuetype}`,
                label: 'type',
            });
        }

        // Priority node
        if (data.priority) {
            nodes.push({
                id: `priority-${data.priority}`,
                label: data.priority,
                type: 'priority',
                val: 12,
                color: nodeColors.priority,
            });
            links.push({
                source: data.key,
                target: `priority-${data.priority}`,
                label: 'priority',
            });
        }

        // Status node
        if (data.status) {
            nodes.push({
                id: `status-${data.status}`,
                label: data.status,
                type: 'status',
                val: 12,
                color: nodeColors.status,
            });
            links.push({
                source: data.key,
                target: `status-${data.status}`,
                label: 'status',
            });
        }

        // Reporter node
        if (data.reporter) {
            nodes.push({
                id: `reporter-${data.reporter}`,
                label: data.reporter,
                type: 'reporter',
                val: 12,
                color: nodeColors.reporter,
            });
            links.push({
                source: data.key,
                target: `reporter-${data.reporter}`,
                label: 'reported by',
            });
        }

        // Component nodes with group
        if (data.components && data.components.length > 0) {
            // Add components group node
            nodes.push({
                id: 'components-group',
                label: 'Components',
                type: 'component',
                val: 15,
                color: nodeColors.component,
            });
            links.push({
                source: data.key,
                target: 'components-group',
                label: 'has components',
            });

            // Add individual component nodes
            data.components.forEach((component) => {
                nodes.push({
                    id: `component-${component}`,
                    label: component,
                    type: 'component',
                    val: 8,
                    color: nodeColors.component,
                });
                links.push({
                    source: 'components-group',
                    target: `component-${component}`,
                    label: '',
                });
            });
        }

        // Method nodes with group
        if (data.methods && data.methods.length > 0) {
            // Add methods group node
            nodes.push({
                id: 'methods-group',
                label: 'Methods',
                type: 'method',
                val: 15,
                color: nodeColors.method,
            });
            links.push({
                source: data.key,
                target: 'methods-group',
                label: 'uses methods',
            });

            // Add individual method nodes
            data.methods.forEach((method) => {
                nodes.push({
                    id: `method-${method}`,
                    label: method,
                    type: 'method',
                    val: 8,
                    color: nodeColors.method,
                });
                links.push({
                    source: 'methods-group',
                    target: `method-${method}`,
                    label: '',
                });
            });
        }

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
        <div ref={containerRef} className="h-full w-full">
            <ForceGraph2D
                ref={graphRef}
                graphData={graphData}
                width={dimensions.width}
                height={dimensions.height}
                nodeLabel="label"
                nodeAutoColorBy="type"
                nodeCanvasObject={(
                    node: any,
                    ctx: CanvasRenderingContext2D,
                    globalScale: number,
                ) => {
                    const label = node.label;
                    const fontSize = 12 / globalScale;
                    ctx.font = `${fontSize}px Sans-Serif`;
                    const textWidth = ctx.measureText(label).width;
                    const bckgDimensions = [textWidth, fontSize].map(
                        (n) => n + fontSize * 0.4,
                    );

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
                        node.y! + node.val / 2 + 2 + bckgDimensions[1] / 2,
                    );
                }}
                linkLabel="label"
                linkColor={() => '#94a3b8'}
                linkWidth={2}
                linkDirectionalParticles={2}
                linkDirectionalParticleWidth={2}
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
