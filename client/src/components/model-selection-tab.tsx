import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Brain, CheckCircle, AlertCircle, Info } from "lucide-react";
import type { OptimizationResult } from "@shared/schema";

interface ModelSelectionTabProps {
  analysis: OptimizationResult | null;
}

export default function ModelSelectionTab({ analysis }: ModelSelectionTabProps) {
  if (!analysis) {
    return (
      <div className="text-center py-12">
        <div className="text-[hsl(var(--carbon-70))] mb-4">
          Submit your use case configuration to see AI-powered model recommendations
        </div>
      </div>
    );
  }

  const getModelReasoning = (model: any) => {
    const reasoningMap: { [key: string]: string } = {
      'gpt4-turbo': 'Recommended for high-accuracy tasks requiring advanced reasoning and complex problem-solving capabilities. Best performance for your use case requirements.',
      'claude3-sonnet': 'Excellent balance of performance and cost efficiency. Strong analytical capabilities with faster response times and lower costs.',
      'llama3-70b': 'Cost-effective option for simpler tasks. Good performance for basic operations with significant cost savings.'
    };
    return reasoningMap[model.id] || 'Suitable model based on your specific requirements and constraints.';
  };

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
        <h3 className="text-lg font-semibold text-[hsl(var(--carbon-100))] mb-2 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-[hsl(var(--ibm-blue-60))]" />
          AI Model Recommendations & Reasoning
        </h3>
        <p className="text-sm text-[hsl(var(--carbon-70))]">
          Intelligent model selection based on your specific use case analysis
        </p>
      </div>

      {/* Model Cards with Reasoning */}
      <div className="space-y-4">
        {analysis.models.map((model, index) => (
          <Card key={model.id} className={`p-6 ${
            index === 0 ? 'border-[hsl(var(--status-success))] bg-[hsl(var(--status-success)/0.05)]' : 
            'border-[hsl(var(--carbon-20))]'
          }`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${
                  index === 0 ? 'bg-[hsl(var(--status-success))]' : 'bg-[hsl(var(--ibm-blue-60))]'
                }`}>
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[hsl(var(--carbon-100))] flex items-center">
                    {model.name}
                    {index === 0 && (
                      <Badge className="ml-2 bg-[hsl(var(--status-success))] text-white">
                        Recommended
                      </Badge>
                    )}
                  </h4>
                  <p className="text-sm text-[hsl(var(--carbon-70))]">{model.provider}</p>
                </div>
              </div>
              <Badge className={getFitScoreBadge(model.fitScore)}>
                {model.fitScore.charAt(0).toUpperCase() + model.fitScore.slice(1)} Fit
              </Badge>
            </div>

            {/* Reasoning Section */}
            <div className="mb-4 p-4 bg-[hsl(var(--carbon-10))] rounded-lg">
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-[hsl(var(--ibm-blue-60))] mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="text-sm font-medium text-[hsl(var(--carbon-100))] mb-1">
                    Why this model?
                  </h5>
                  <p className="text-sm text-[hsl(var(--carbon-70))] leading-relaxed">
                    {getModelReasoning(model)}
                  </p>
                </div>
              </div>
            </div>

            {/* Model Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white rounded-lg border border-[hsl(var(--carbon-20))]">
                <div className="text-lg font-bold text-[hsl(var(--carbon-100))]">
                  {model.performance}%
                </div>
                <div className="text-xs text-[hsl(var(--carbon-70))]">Performance</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-[hsl(var(--carbon-20))]">
                <div className="text-lg font-bold text-[hsl(var(--carbon-100))]">
                  ${model.costPer1K.toFixed(3)}
                </div>
                <div className="text-xs text-[hsl(var(--carbon-70))]">Cost/1K Tokens</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-[hsl(var(--carbon-20))]">
                <div className="text-lg font-bold text-[hsl(var(--carbon-100))]">
                  {model.latency}ms
                </div>
                <div className="text-xs text-[hsl(var(--carbon-70))]">Latency</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-[hsl(var(--carbon-20))]">
                <div className={`text-lg font-bold ${
                  model.fitScore === 'excellent' ? 'text-[hsl(var(--status-success))]' :
                  model.fitScore === 'good' ? 'text-[hsl(var(--status-warning))]' :
                  'text-[hsl(var(--status-error))]'
                }`}>
                  {model.fitScore === 'excellent' ? 'A+' : 
                   model.fitScore === 'good' ? 'B+' : 'C+'}
                </div>
                <div className="text-xs text-[hsl(var(--carbon-70))]">Fit Grade</div>
              </div>
            </div>
          </Card>
        ))}
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
