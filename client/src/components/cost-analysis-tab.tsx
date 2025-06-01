import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Lightbulb, BarChart3 } from "lucide-react";
import type { OptimizationResult } from "@shared/schema";

interface CostAnalysisTabProps {
  analysis: OptimizationResult | null;
}

export default function CostAnalysisTab({ analysis }: CostAnalysisTabProps) {
  if (!analysis) {
    return (
      <div className="text-center py-12">
        <div className="text-[hsl(var(--carbon-70))] mb-4">
          Submit your use case configuration to see the cost analysis
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[hsl(var(--carbon-100))] mb-2">
          Cost Breakdown Analysis
        </h3>
        <p className="text-sm text-[hsl(var(--carbon-70))]">
          Real-time cost calculations based on your parameters
        </p>
      </div>

      {/* Cost Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="cost-card-gradient rounded-lg p-4 text-white">
          <div className="text-2xl font-semibold">
            ${analysis.totalMonthlyCost.toLocaleString()}
          </div>
          <div className="text-sm opacity-90">Monthly Total</div>
          <div className="text-xs opacity-75 mt-1">
            Based on current usage
          </div>
        </div>
        
        <div className="success-gradient rounded-lg p-4 text-white">
          <div className="text-2xl font-semibold">
            ${analysis.costPerRequest.toFixed(4)}
          </div>
          <div className="text-sm opacity-90">Cost per Request</div>
          <div className="text-xs opacity-75 mt-1">
            Per request pricing
          </div>
        </div>
        
        <div className="warning-gradient rounded-lg p-4 text-white">
          <div className="text-2xl font-semibold">
            {analysis.efficiency}%
          </div>
          <div className="text-sm opacity-90">Cost Efficiency</div>
          <div className="text-xs opacity-75 mt-1">
            Industry benchmark: 87%
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <Card className="bg-[hsl(var(--carbon-10))] p-4">
        <h4 className="font-medium text-[hsl(var(--carbon-100))] mb-4 flex items-center">
          <BarChart3 className="w-4 h-4 mr-2" />
          Cost Components
        </h4>
        <div className="space-y-3">
          {analysis.costBreakdown.map((component, index) => (
            <div 
              key={index}
              className="flex items-center justify-between py-2 border-b border-[hsl(var(--carbon-20))] last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: component.color }}
                />
                <span className="text-sm font-medium text-[hsl(var(--carbon-100))]">
                  {component.component}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-[hsl(var(--carbon-100))]">
                  ${component.cost.toLocaleString()}
                </div>
                <div className="text-xs text-[hsl(var(--carbon-70))]">
                  {component.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Optimization Suggestions */}
      <div>
        <h4 className="font-medium text-[hsl(var(--carbon-100))] mb-4 flex items-center">
          <Lightbulb className="w-4 h-4 mr-2" />
          Cost Optimization Opportunities
        </h4>
        <div className="space-y-3">
          <Card className="flex items-start space-x-3 p-3 bg-[hsl(var(--status-success)/0.1)] border-[hsl(var(--status-success))]">
            <Lightbulb className="w-4 h-4 text-[hsl(var(--status-success))] mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-[hsl(var(--carbon-100))]">
                Switch to Claude-3 for 40% of requests
              </div>
              <div className="text-xs text-[hsl(var(--carbon-70))] mt-1">
                Potential savings: $2,680/month (-21.5%)
              </div>
            </div>
          </Card>
          
          <Card className="flex items-start space-x-3 p-3 bg-[hsl(var(--status-info)/0.1)] border-[hsl(var(--status-info))]">
            <BarChart3 className="w-4 h-4 text-[hsl(var(--status-info))] mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-[hsl(var(--carbon-100))]">
                Implement intelligent caching
              </div>
              <div className="text-xs text-[hsl(var(--carbon-70))] mt-1">
                Potential savings: $1,890/month (-15.2%)
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
