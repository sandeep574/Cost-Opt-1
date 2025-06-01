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

      {/* Agent Importance Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {analysis.agents.slice(0, 3).map((agent, index) => (
          <div key={agent.id} className="relative">
            <div className={`
              bg-white rounded-xl p-6 shadow-lg border-2 transition-all duration-300 hover:shadow-xl
              ${index === 0 ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50' :
                index === 1 ? 'border-gray-400 bg-gradient-to-br from-gray-50 to-slate-50' :
                'border-amber-600 bg-gradient-to-br from-amber-50 to-yellow-50'}
            `}>
              {/* Importance Badge */}
              <div className="absolute -top-3 -right-3">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm
                  ${index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-500' :
                    'bg-amber-600'}
                `}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className={`
                  p-4 rounded-xl
                  ${index === 0 ? 'bg-yellow-100' :
                    index === 1 ? 'bg-gray-100' :
                    'bg-amber-100'}
                `}>
                  <div className={`
                    text-2xl
                    ${index === 0 ? 'text-yellow-600' :
                      index === 1 ? 'text-gray-600' :
                      'text-amber-600'}
                  `}>
                    {getAgentIcon(agent.id)}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{agent.name}</h3>
                  <p className="text-sm text-slate-600">{agent.description}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <span className="font-medium text-slate-700">Cost: </span>
                  <span className="text-blue-600 font-semibold">${agent.cost.toFixed(4)}/req</span>
                </div>
                <div className={`
                  px-3 py-1 rounded-full text-xs font-medium
                  ${agent.status === 'success' ? 'bg-green-100 text-green-800' :
                    agent.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'}
                `}>
                  {agent.status}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Agent Flow Diagram */}
      <div className="relative bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-8 min-h-[400px] border border-slate-200">
        {/* Flow Direction Indicator */}
        <div className="absolute top-4 left-4 flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-slate-200">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-slate-700">Data Flow</span>
        </div>

        {/* Agent Flow */}
        <div className="flex justify-center items-center h-full">
          <div className="flex items-center space-x-6">
            {analysis.agents.map((agent, index) => (
              <div key={agent.id} className="flex items-center">
                {/* Agent Node */}
                <div className="relative group">
                  <div className={`
                    w-24 h-24 rounded-xl shadow-lg bg-white border-2 transition-all duration-300 
                    hover:scale-110 hover:shadow-xl cursor-pointer
                    ${agent.status === 'success' ? 'border-green-400' : 
                      agent.status === 'warning' ? 'border-yellow-400' : 
                      'border-blue-400'}
                  `}>
                    <div className="flex flex-col items-center justify-center h-full p-2">
                      <div className={`
                        p-2 rounded-lg mb-1
                        ${agent.status === 'success' ? 'bg-green-100 text-green-600' : 
                          agent.status === 'warning' ? 'bg-yellow-100 text-yellow-600' : 
                          'bg-blue-100 text-blue-600'}
                      `}>
                        {getAgentIcon(agent.id)}
                      </div>
                      <span className="text-xs font-semibold text-slate-800 text-center leading-tight">
                        {agent.name.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs rounded-lg px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                    {agent.description}
                  </div>
                </div>

                {/* Arrow */}
                {index < analysis.agents.length - 1 && (
                  <div className="flex items-center mx-2">
                    <div className="w-6 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 relative">
                      <div className="absolute -right-1 -top-1 w-0 h-0 border-l-3 border-l-blue-600 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Performance Dashboard */}
        <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-slate-200 min-w-[200px]">
          <div className="flex items-center mb-3">
            <Zap className="w-5 h-5 mr-2 text-green-500" />
            <h4 className="font-semibold text-slate-800">Performance</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Latency</span>
              <div className="flex items-center">
                <div className="w-16 h-2 bg-slate-200 rounded-full mr-2">
                  <div 
                    className="h-2 bg-green-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(10, 100 - (analysis.performance.latency / 10))}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-slate-800">
                  {analysis.performance.latency}ms
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Throughput</span>
              <span className="text-sm font-medium text-slate-800">
                {analysis.performance.throughput} req/s
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Accuracy</span>
              <span className="text-sm font-medium text-green-600">
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