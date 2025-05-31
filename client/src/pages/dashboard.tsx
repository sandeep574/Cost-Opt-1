import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Brain, Download, Settings, BarChart3 } from "lucide-react";
import InputForm from "@/components/input-form";
import WorkflowTab from "@/components/workflow-tab";
import CostAnalysisTab from "@/components/cost-analysis-tab";
import ModelSelectionTab from "@/components/model-selection-tab";
import { useOptimization } from "@/hooks/use-optimization";
import type { InsertOptimizationRequest } from "@shared/schema";

export default function Dashboard() {
  const [formData, setFormData] = useState<InsertOptimizationRequest>({
    useCase: "",
    complexity: "medium",
    users: 1000,
    dailyRequests: 10000,
    responseTime: "standard",
    budget: "medium",
  });

  const { analysis, isAnalyzing, analyze } = useOptimization();

  const handleFormSubmit = async (data: InsertOptimizationRequest) => {
    setFormData(data);
    await analyze(data);
  };

  const handleExportReport = () => {
    if (analysis) {
      const reportData = {
        configuration: formData,
        analysis,
        timestamp: new Date().toISOString(),
      };
      
      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-cost-optimization-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--carbon-10))]">
      {/* Header */}
      <header className="bg-white border-b border-[hsl(var(--carbon-20))] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[hsl(var(--ibm-blue-60))] rounded-lg flex items-center justify-center">
                <Brain className="text-white w-4 h-4" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-[hsl(var(--carbon-100))]">
                  AI Cost Optimizer
                </h1>
                <p className="text-xs text-[hsl(var(--carbon-70))]">Enterprise Edition</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-[hsl(var(--carbon-70))] hover:text-[hsl(var(--carbon-100))] text-sm font-medium">
                Dashboard
              </a>
              <a href="#" className="text-[hsl(var(--carbon-70))] hover:text-[hsl(var(--carbon-100))] text-sm font-medium">
                Analytics
              </a>
              <a href="#" className="text-[hsl(var(--carbon-70))] hover:text-[hsl(var(--carbon-100))] text-sm font-medium">
                Settings
              </a>
            </nav>
            <Button 
              onClick={handleExportReport}
              disabled={!analysis}
              className="bg-[hsl(var(--ibm-blue-60))] text-white hover:bg-[hsl(var(--ibm-blue-70))]"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <InputForm 
              onSubmit={handleFormSubmit}
              isLoading={isAnalyzing}
              initialData={formData}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="border-[hsl(var(--carbon-20))]">
              <Tabs defaultValue="workflow" className="w-full">
                <TabsList className="w-full grid grid-cols-3 bg-[hsl(var(--carbon-10))] border-b border-[hsl(var(--carbon-20))] rounded-t-lg rounded-b-none h-auto p-0">
                  <TabsTrigger 
                    value="workflow" 
                    className="flex items-center justify-center px-6 py-4 text-sm font-medium data-[state=active]:bg-[hsl(var(--ibm-blue-50))] data-[state=active]:text-[hsl(var(--ibm-blue-60))] data-[state=active]:border-b-2 data-[state=active]:border-[hsl(var(--ibm-blue-60))] rounded-none"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Agent Workflow
                  </TabsTrigger>
                  <TabsTrigger 
                    value="cost"
                    className="flex items-center justify-center px-6 py-4 text-sm font-medium data-[state=active]:bg-[hsl(var(--ibm-blue-50))] data-[state=active]:text-[hsl(var(--ibm-blue-60))] data-[state=active]:border-b-2 data-[state=active]:border-[hsl(var(--ibm-blue-60))] rounded-none"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Cost Analysis
                  </TabsTrigger>
                  <TabsTrigger 
                    value="models"
                    className="flex items-center justify-center px-6 py-4 text-sm font-medium data-[state=active]:bg-[hsl(var(--ibm-blue-50))] data-[state=active]:text-[hsl(var(--ibm-blue-60))] data-[state=active]:border-b-2 data-[state=active]:border-[hsl(var(--ibm-blue-60))] rounded-none"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Model Selection
                  </TabsTrigger>
                </TabsList>

                <div className="p-6">
                  <TabsContent value="workflow" className="mt-0">
                    <WorkflowTab analysis={analysis} />
                  </TabsContent>
                  
                  <TabsContent value="cost" className="mt-0">
                    <CostAnalysisTab analysis={analysis} />
                  </TabsContent>
                  
                  <TabsContent value="models" className="mt-0">
                    <ModelSelectionTab analysis={analysis} />
                  </TabsContent>
                </div>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
