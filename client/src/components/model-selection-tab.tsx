import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import type { OptimizationResult } from "@shared/schema";

interface ModelSelectionTabProps {
  analysis: OptimizationResult | null;
}

export default function ModelSelectionTab({ analysis }: ModelSelectionTabProps) {
  if (!analysis) {
    return (
      <div className="text-center py-12">
        <div className="text-[hsl(var(--carbon-70))] mb-4">
          Submit your use case configuration to see model recommendations
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'hsl(var(--status-success))';
      case 'warning': return 'hsl(var(--status-warning))';
      case 'info': return 'hsl(var(--status-info))';
      default: return 'hsl(var(--carbon-50))';
    }
  };

  const getFitScoreBadge = (score: string) => {
    const colors = {
      excellent: 'bg-[hsl(var(--status-success)/0.2)] text-[hsl(var(--status-success))]',
      good: 'bg-[hsl(var(--status-warning)/0.2)] text-[hsl(var(--status-warning))]',
      fair: 'bg-orange-100 text-orange-800'
    };
    return colors[score as keyof typeof colors] || colors.fair;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[hsl(var(--carbon-100))] mb-2">
          LLM Model Recommendations
        </h3>
        <p className="text-sm text-[hsl(var(--carbon-70))]">
          Optimized model selection based on your requirements
        </p>
      </div>

      {/* Model Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-[hsl(var(--carbon-20))] rounded-lg">
          <thead className="bg-[hsl(var(--carbon-10))]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--carbon-70))] uppercase tracking-wider">
                Model
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--carbon-70))] uppercase tracking-wider">
                Performance
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--carbon-70))] uppercase tracking-wider">
                Cost/1K Tokens
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--carbon-70))] uppercase tracking-wider">
                Latency
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--carbon-70))] uppercase tracking-wider">
                Fit Score
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-[hsl(var(--carbon-70))] uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[hsl(var(--carbon-20))]">
            {analysis.models.map((model) => (
              <tr key={model.id} className="hover:bg-[hsl(var(--carbon-10))] transition-colors">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div 
                      className="w-2 h-2 rounded-full mr-3"
                      style={{ backgroundColor: getStatusColor(model.status) }}
                    />
                    <div>
                      <div className="text-sm font-medium text-[hsl(var(--carbon-100))]">
                        {model.name}
                      </div>
                      <div className="text-xs text-[hsl(var(--carbon-70))]">
                        {model.provider}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-[hsl(var(--carbon-20))] rounded-full h-2 mr-2">
                      <div 
                        className="h-2 rounded-full"
                        style={{ 
                          width: `${model.performance}%`,
                          backgroundColor: getStatusColor(model.status)
                        }}
                      />
                    </div>
                    <span className="text-xs text-[hsl(var(--carbon-70))]">
                      {model.performance}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-[hsl(var(--carbon-100))]">
                  ${model.costPer1K.toFixed(3)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-[hsl(var(--carbon-100))]">
                  {model.latency}ms
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <Badge className={getFitScoreBadge(model.fitScore)}>
                    {model.fitScore.charAt(0).toUpperCase() + model.fitScore.slice(1)}
                  </Badge>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <Button 
                    variant="link" 
                    size="sm"
                    className="text-[hsl(var(--ibm-blue-60))] hover:text-[hsl(var(--ibm-blue-70))] p-0"
                  >
                    Select
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hybrid Model Strategy */}
      <Card className="bg-[hsl(var(--ibm-blue-50))] border border-[hsl(var(--ibm-blue-60))] p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Sparkles className="w-4 h-4 text-[hsl(var(--ibm-blue-60))]" />
          <h4 className="font-medium text-[hsl(var(--carbon-100))]">
            Recommended Hybrid Strategy
          </h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm font-medium text-[hsl(var(--carbon-100))] mb-2">
              High-Complexity Requests ({analysis.hybridStrategy.highComplexity.percentage}%)
            </div>
            <div className="text-xs text-[hsl(var(--carbon-70))]">
              Use {analysis.hybridStrategy.highComplexity.model} for maximum accuracy
            </div>
            <div className="text-xs text-[hsl(var(--ibm-blue-60))] font-medium">
              Cost: ${analysis.hybridStrategy.highComplexity.cost.toLocaleString()}/month
            </div>
          </div>
          
          <div>
            <div className="text-sm font-medium text-[hsl(var(--carbon-100))] mb-2">
              Standard Requests ({analysis.hybridStrategy.standard.percentage}%)
            </div>
            <div className="text-xs text-[hsl(var(--carbon-70))]">
              Use {analysis.hybridStrategy.standard.model} for cost efficiency
            </div>
            <div className="text-xs text-[hsl(var(--ibm-blue-60))] font-medium">
              Cost: ${analysis.hybridStrategy.standard.cost.toLocaleString()}/month
            </div>
          </div>
        </div>
        
        <div className="pt-3 border-t border-[hsl(var(--ibm-blue-60)/0.3)]">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-[hsl(var(--carbon-100))]">
              Total Optimized Cost:
            </span>
            <span className="text-lg font-semibold text-[hsl(var(--status-success))]">
              ${analysis.hybridStrategy.totalOptimizedCost.toLocaleString()}/month
            </span>
          </div>
          <div className="text-xs text-[hsl(var(--status-success))]">
            Savings: ${analysis.hybridStrategy.savings.toLocaleString()}/month 
            ({analysis.hybridStrategy.savingsPercentage}%)
          </div>
        </div>
      </Card>
    </div>
  );
}
