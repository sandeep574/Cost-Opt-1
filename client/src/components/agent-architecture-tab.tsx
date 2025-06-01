import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Activity, Zap, Database, MessageSquare } from "lucide-react";
import type { OptimizationResult } from "@shared/schema";

interface AgentArchitectureTabProps {
  analysis: OptimizationResult | null;
}

export default function AgentArchitectureTab({ analysis }: AgentArchitectureTabProps) {
  if (!analysis) {
    return (
      <div className="text-center py-12">
        <div className="text-[hsl(var(--carbon-70))] mb-4">
          Submit your use case configuration to see the agent architecture
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'active': return <Activity className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getAgentIcon = (agentId: string) => {
    switch (agentId) {
      case 'input': return <MessageSquare className="w-6 h-6" />;
      case 'analysis': return <Zap className="w-6 h-6" />;
      case 'output': return <CheckCircle className="w-6 h-6" />;
      case 'memory': return <Database className="w-6 h-6" />;
      default: return <Activity className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[hsl(var(--carbon-100))] mb-2">
          AI Agent Architecture
        </h3>
        <p className="text-sm text-[hsl(var(--carbon-70))]">
          Intelligent agent workflow designed based on your use case requirements
        </p>
      </div>

      {/* Architecture Diagram */}
      <div className="relative bg-gradient-to-br from-[hsl(var(--ibm-blue-50))] to-[hsl(var(--carbon-10))] rounded-lg p-8 min-h-[400px] overflow-hidden">
        {/* Agent Nodes */}
        {analysis.agents.map((agent, index) => (
          <div
            key={agent.id}
            className="absolute bg-white border-2 rounded-xl p-4 w-48 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer hover:scale-105"
            style={{
              left: `${agent.position.x}px`,
              top: `${agent.position.y}px`,
              borderColor: getStatusColor(agent.status),
            }}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${getStatusColor(agent.status)}20` }}
              >
                <div style={{ color: getStatusColor(agent.status) }}>
                  {getAgentIcon(agent.id)}
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-[hsl(var(--carbon-100))]">
                  {agent.name}
                </h4>
                <div className="flex items-center space-x-1 mt-1">
                  <div style={{ color: getStatusColor(agent.status) }}>
                    {getStatusIcon(agent.status)}
                  </div>
                  <span className="text-xs text-[hsl(var(--carbon-70))] capitalize">
                    {agent.status}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-[hsl(var(--carbon-70))] mb-3 leading-relaxed">
              {agent.description}
            </p>
            
            <div className="flex justify-between items-center">
              <Badge 
                variant="secondary" 
                className="text-xs bg-[hsl(var(--carbon-10))] text-[hsl(var(--carbon-70))]"
              >
                ${agent.cost.toFixed(4)}/req
              </Badge>
              <div className="text-xs font-medium text-[hsl(var(--ibm-blue-60))]">
                Agent {index + 1}
              </div>
            </div>
          </div>
        ))}

        {/* Connection Lines - SVG overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--ibm-blue-60))" />
            </marker>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Dynamic connections based on agent positions */}
          {analysis.agents.length > 1 && (
            <>
              <path 
                d="M 242 70 L 260 70" 
                stroke="hsl(var(--ibm-blue-60))" 
                strokeWidth="3" 
                markerEnd="url(#arrowhead)" 
                filter="url(#glow)"
                opacity="0.8"
              />
              {analysis.agents.length > 2 && (
                <path 
                  d="M 492 70 L 510 70" 
                  stroke="hsl(var(--ibm-blue-60))" 
                  strokeWidth="3" 
                  markerEnd="url(#arrowhead)" 
                  filter="url(#glow)"
                  opacity="0.8"
                />
              )}
              {analysis.agents.some(a => a.id === 'memory') && (
                <path 
                  d="M 360 110 L 360 160" 
                  stroke="hsl(var(--status-info))" 
                  strokeWidth="2" 
                  markerEnd="url(#arrowhead)" 
                  strokeDasharray="8,4"
                  opacity="0.7"
                />
              )}
            </>
          )}
        </svg>

        {/* Performance Metrics Overlay */}
        <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-[hsl(var(--carbon-20))]">
          <div className="text-sm font-semibold text-[hsl(var(--carbon-100))] mb-3 flex items-center">
            <Zap className="w-4 h-4 mr-2 text-[hsl(var(--status-success))]" />
            Performance Metrics
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[hsl(var(--carbon-70))]">Latency:</span>
              <span className="font-medium text-[hsl(var(--status-success))]">
                {analysis.performance.latency}ms
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[hsl(var(--carbon-70))]">Throughput:</span>
              <span className="font-medium text-[hsl(var(--status-success))]">
                {analysis.performance.throughput} req/s
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[hsl(var(--carbon-70))]">Accuracy:</span>
              <span className="font-medium text-[hsl(var(--status-success))]">
                {analysis.performance.accuracy}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Architecture Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 bg-[hsl(var(--status-success)/0.05)] border-[hsl(var(--status-success)/0.3)]">
          <div className="flex items-center space-x-2 mb-3">
            <CheckCircle className="w-5 h-5 text-[hsl(var(--status-success))]" />
            <h4 className="font-medium text-[hsl(var(--carbon-100))]">
              Architecture Strengths
            </h4>
          </div>
          <ul className="text-sm text-[hsl(var(--carbon-70))] space-y-2">
            <li>• Scalable multi-agent design</li>
            <li>• Optimized for your use case complexity</li>
            <li>• Built-in redundancy and fault tolerance</li>
            <li>• Cost-efficient resource allocation</li>
          </ul>
        </Card>

        <Card className="p-4 bg-[hsl(var(--status-info)/0.05)] border-[hsl(var(--status-info)/0.3)]">
          <div className="flex items-center space-x-2 mb-3">
            <Activity className="w-5 h-5 text-[hsl(var(--status-info))]" />
            <h4 className="font-medium text-[hsl(var(--carbon-100))]">
              Optimization Opportunities
            </h4>
          </div>
          <ul className="text-sm text-[hsl(var(--carbon-70))] space-y-2">
            <li>• Consider caching for frequent queries</li>
            <li>• Implement load balancing for peak traffic</li>
            <li>• Add monitoring for proactive scaling</li>
            <li>• Optimize agent communication protocols</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}