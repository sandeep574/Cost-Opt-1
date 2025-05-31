import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle } from "lucide-react";
import type { OptimizationResult } from "@shared/schema";

interface WorkflowTabProps {
  analysis: OptimizationResult | null;
}

export default function WorkflowTab({ analysis }: WorkflowTabProps) {
  if (!analysis) {
    return (
      <div className="text-center py-12">
        <div className="text-[hsl(var(--carbon-70))] mb-4">
          Submit your use case configuration to see the optimized workflow
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'hsl(var(--status-success))';
      case 'warning': return 'hsl(var(--status-warning))';
      case 'active': return 'hsl(var(--status-info))';
      default: return 'hsl(var(--carbon-50))';
    }
  };

  const getStatusDot = (status: string) => {
    const color = getStatusColor(status);
    return <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[hsl(var(--carbon-100))] mb-2">
          Multi-Agent Workflow
        </h3>
        <p className="text-sm text-[hsl(var(--carbon-70))]">
          Optimized agent architecture for your use case
        </p>
      </div>

      {/* Interactive Flowchart */}
      <div className="relative bg-[hsl(var(--carbon-10))] rounded-lg p-6 min-h-96 overflow-hidden">
        {/* Agent Nodes */}
        {analysis.agents.map((agent) => (
          <div
            key={agent.id}
            className="absolute agent-node bg-white border-2 rounded-lg p-4 w-40 shadow-sm"
            style={{
              left: `${agent.position.x}px`,
              top: `${agent.position.y}px`,
              borderColor: getStatusColor(agent.status),
            }}
          >
            <div className="flex items-center space-x-2 mb-2">
              {getStatusDot(agent.status)}
              <span className="text-sm font-medium">{agent.name}</span>
            </div>
            <p className="text-xs text-[hsl(var(--carbon-70))]">{agent.description}</p>
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                ${agent.cost}/req
              </Badge>
            </div>
          </div>
        ))}

        {/* Connection Lines - SVG overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--carbon-70))" />
            </marker>
          </defs>
          {/* Main flow connections */}
          <path 
            d="M 190 70 L 260 70" 
            stroke="hsl(var(--carbon-70))" 
            strokeWidth="2" 
            markerEnd="url(#arrowhead)" 
          />
          <path 
            d="M 440 70 L 510 70" 
            stroke="hsl(var(--carbon-70))" 
            strokeWidth="2" 
            markerEnd="url(#arrowhead)" 
          />
          <path 
            d="M 360 110 L 360 160" 
            stroke="hsl(var(--carbon-70))" 
            strokeWidth="2" 
            markerEnd="url(#arrowhead)" 
            strokeDasharray="5,5"
          />
        </svg>

        {/* Performance Metrics */}
        <div className="absolute bottom-4 right-4 bg-white rounded-lg p-3 shadow-sm border border-[hsl(var(--carbon-20))]">
          <div className="text-xs font-medium text-[hsl(var(--carbon-100))] mb-1">Performance</div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-[hsl(var(--carbon-70))]">Latency:</span>
              <span className="text-[hsl(var(--status-success))]">{analysis.performance.latency}ms</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[hsl(var(--carbon-70))]">Throughput:</span>
              <span className="text-[hsl(var(--status-success))]">{analysis.performance.throughput} req/s</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[hsl(var(--carbon-70))]">Accuracy:</span>
              <span className="text-[hsl(var(--status-success))]">{analysis.performance.accuracy}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analysis.recommendations.map((rec, index) => (
          <Card
            key={index}
            className={`p-4 border ${
              rec.type === 'recommended' 
                ? 'bg-[hsl(var(--status-success)/0.1)] border-[hsl(var(--status-success))]'
                : 'bg-[hsl(var(--status-warning)/0.1)] border-[hsl(var(--status-warning))]'
            }`}
          >
            <div className="flex items-center space-x-2 mb-2">
              {rec.type === 'recommended' ? (
                <CheckCircle className="w-4 h-4 text-[hsl(var(--status-success))]" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-[hsl(var(--status-warning))]" />
              )}
              <span className="font-medium text-[hsl(var(--carbon-100))]">
                {rec.type === 'recommended' ? 'Recommended' : 'Alternative'}
              </span>
            </div>
            <p className="text-sm text-[hsl(var(--carbon-70))]">{rec.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
