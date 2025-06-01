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

      {/* Agent Design Flow Diagram */}
      <div className="bg-gray-50 rounded-xl p-8 min-h-[600px]">
        <div className="flex flex-col items-center">
          
          {/* Manager Agent (Top Level) */}
          {analysis.agents.length > 0 && (
            <div className="mb-8">
              <div className="bg-orange-400 rounded-2xl p-6 min-w-[300px] border-4 border-black shadow-lg">
                <h3 className="text-xl font-bold text-black text-center">{analysis.agents[0].name}</h3>
                <p className="text-black text-center text-sm mt-2">{analysis.agents[0].description}</p>
              </div>
              
              {/* Arrow Down */}
              <div className="flex justify-center mt-4">
                <div className="w-1 h-12 bg-orange-400"></div>
                <div className="absolute mt-8 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-orange-400"></div>
              </div>
            </div>
          )}

          {/* Middle Layer Agents */}
          {analysis.agents.length > 1 && (
            <div className="mb-8">
              <div className="flex justify-center items-center space-x-8 mb-4">
                {analysis.agents.slice(1, 4).map((agent, index) => (
                  <div key={agent.id} className="relative">
                    <div className="bg-teal-400 rounded-2xl p-6 w-48 border-4 border-black shadow-lg">
                      <h4 className="text-lg font-bold text-black text-center">{agent.name.replace(' Agent', '')}</h4>
                      <p className="text-black text-center text-xs mt-2 leading-tight">{agent.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Connecting Lines */}
              <div className="relative">
                <div className="flex justify-center">
                  <div className="w-96 h-1 bg-teal-400"></div>
                </div>
                <div className="flex justify-center mt-2">
                  <div className="w-1 h-12 bg-teal-400"></div>
                  <div className="absolute mt-8 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-teal-400"></div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Layer - Interface/Output */}
          {analysis.agents.length > 4 ? (
            <div className="bg-teal-400 rounded-2xl p-6 min-w-[350px] border-4 border-black shadow-lg">
              <h4 className="text-lg font-bold text-black text-center">{analysis.agents[analysis.agents.length - 1].name}</h4>
              <p className="text-black text-center text-sm mt-2">{analysis.agents[analysis.agents.length - 1].description}</p>
            </div>
          ) : (
            <div className="bg-teal-400 rounded-2xl p-6 min-w-[350px] border-4 border-black shadow-lg">
              <h4 className="text-lg font-bold text-black text-center">User Interface Module</h4>
              <p className="text-black text-center text-sm mt-2">Ensures client-friendly interaction and response delivery</p>
            </div>
          )}
        </div>
      </div>

      {/* Agent Details List */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Agent Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analysis.agents.map((agent, index) => (
            <div key={agent.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-semibold text-gray-800">{agent.name}</h5>
                <span className={`
                  px-2 py-1 rounded text-xs font-medium
                  ${agent.status === 'success' ? 'bg-green-100 text-green-800' :
                    agent.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'}
                `}>
                  {agent.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{agent.description}</p>
              <div className="text-sm font-medium text-blue-600">
                Cost: ${agent.cost.toFixed(4)}/request
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="mt-6 bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center mb-4">
          <Zap className="w-5 h-5 mr-2 text-green-500" />
          <h4 className="font-semibold text-gray-800">Performance Metrics</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {analysis.performance.latency}ms
            </div>
            <div className="text-sm text-gray-600">Latency</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {analysis.performance.throughput}
            </div>
            <div className="text-sm text-gray-600">Req/sec</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {analysis.performance.accuracy}%
            </div>
            <div className="text-sm text-gray-600">Accuracy</div>
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