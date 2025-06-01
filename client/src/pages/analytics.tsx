import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, TrendingDown, Users, DollarSign, Clock, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Analytics() {
  const analyticsData = {
    totalAnalyses: 1247,
    avgMonthlyCost: 8450,
    avgEfficiency: 89.2,
    costSavings: 245600,
    popularModels: [
      { name: "GPT-4 Turbo", usage: 45, trend: "up" },
      { name: "Claude-3 Sonnet", usage: 32, trend: "up" },
      { name: "Llama 3 70B", usage: 23, trend: "down" }
    ],
    useCaseDistribution: [
      { type: "Customer Service", percentage: 35, count: 436 },
      { type: "Content Generation", percentage: 28, count: 349 },
      { type: "Data Analysis", percentage: 22, count: 274 },
      { type: "Process Automation", percentage: 15, count: 188 }
    ],
    monthlyTrends: [
      { month: "Jan", cost: 7200, requests: 125000 },
      { month: "Feb", cost: 7800, requests: 138000 },
      { month: "Mar", cost: 8450, requests: 145000 },
      { month: "Apr", cost: 8200, requests: 142000 },
      { month: "May", cost: 8900, requests: 155000 },
      { month: "Jun", cost: 9100, requests: 162000 }
    ]
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--carbon-10))]">
      {/* Header */}
      <header className="bg-white border-b border-[hsl(var(--carbon-20))] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button variant="ghost" size="sm" className="p-2">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div className="w-8 h-8 bg-[hsl(var(--ibm-blue-60))] rounded-lg flex items-center justify-center">
                <Brain className="text-white w-4 h-4" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-[hsl(var(--carbon-100))]">
                  Analytics Dashboard
                </h1>
                <p className="text-xs text-[hsl(var(--carbon-70))]">AI Cost Optimization Insights</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--carbon-70))]">Total Analyses</p>
                  <p className="text-2xl font-bold text-[hsl(var(--carbon-100))]">
                    {analyticsData.totalAnalyses.toLocaleString()}
                  </p>
                </div>
                <Users className="w-8 h-8 text-[hsl(var(--ibm-blue-60))]" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-[hsl(var(--status-success))] mr-1" />
                <span className="text-sm text-[hsl(var(--status-success))]">+12.5% this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--carbon-70))]">Avg Monthly Cost</p>
                  <p className="text-2xl font-bold text-[hsl(var(--carbon-100))]">
                    ${analyticsData.avgMonthlyCost.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-[hsl(var(--status-success))]" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingDown className="w-4 h-4 text-[hsl(var(--status-success))] mr-1" />
                <span className="text-sm text-[hsl(var(--status-success))]">-8.3% optimized</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--carbon-70))]">Avg Efficiency</p>
                  <p className="text-2xl font-bold text-[hsl(var(--carbon-100))]">
                    {analyticsData.avgEfficiency}%
                  </p>
                </div>
                <Clock className="w-8 h-8 text-[hsl(var(--status-warning))]" />
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-[hsl(var(--status-success))] mr-1" />
                <span className="text-sm text-[hsl(var(--status-success))]">+4.2% improvement</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--carbon-70))]">Total Savings</p>
                  <p className="text-2xl font-bold text-[hsl(var(--carbon-100))]">
                    ${analyticsData.costSavings.toLocaleString()}
                  </p>
                </div>
                <TrendingDown className="w-8 h-8 text-[hsl(var(--status-success))]" />
              </div>
              <div className="flex items-center mt-2">
                <span className="text-sm text-[hsl(var(--carbon-70))]">Since implementation</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Popular Models */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="w-5 h-5 mr-2 text-[hsl(var(--ibm-blue-60))]" />
                Popular AI Models
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.popularModels.map((model, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-[hsl(var(--carbon-10))] rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[hsl(var(--ibm-blue-60))] rounded-lg flex items-center justify-center text-white text-sm font-semibold">
                        {index + 1}
                      </div>
                      <span className="font-medium text-[hsl(var(--carbon-100))]">{model.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{model.usage}% usage</Badge>
                      {model.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-[hsl(var(--status-success))]" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-[hsl(var(--status-error))]" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Use Case Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Use Case Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.useCaseDistribution.map((useCase, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-[hsl(var(--carbon-100))]">
                        {useCase.type}
                      </span>
                      <span className="text-sm text-[hsl(var(--carbon-70))]">
                        {useCase.count} analyses
                      </span>
                    </div>
                    <div className="w-full bg-[hsl(var(--carbon-20))] rounded-full h-2">
                      <div 
                        className="bg-[hsl(var(--ibm-blue-60))] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${useCase.percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-[hsl(var(--carbon-70))]">
                      {useCase.percentage}% of total
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trends */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Monthly Cost & Request Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {analyticsData.monthlyTrends.map((month, index) => (
                <div key={index} className="text-center p-4 bg-[hsl(var(--carbon-10))] rounded-lg">
                  <div className="text-sm font-medium text-[hsl(var(--carbon-100))] mb-2">
                    {month.month}
                  </div>
                  <div className="text-lg font-bold text-[hsl(var(--ibm-blue-60))] mb-1">
                    ${month.cost.toLocaleString()}
                  </div>
                  <div className="text-xs text-[hsl(var(--carbon-70))]">
                    {(month.requests / 1000).toFixed(0)}K requests
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}