import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Brain, Download, BarChart3, FileText, Network } from "lucide-react";
import { Link } from "wouter";
import InputForm from "@/components/input-form";
import AgentArchitectureTab from "@/components/agent-architecture-tab";
import CostAnalysisTab from "@/components/cost-analysis-tab";
import ModelSelectionTab from "@/components/model-selection-tab";
import { useOptimization } from "@/hooks/use-optimization";
import type { InsertOptimizationRequest } from "@shared/schema";

export default function Dashboard() {
  const [formData, setFormData] = useState<InsertOptimizationRequest>({
    userDescription: "",
    useCaseType: undefined,
    complexity: undefined,
    users: undefined,
    dailyRequests: undefined,
    responseTime: undefined,
    budget: undefined,
  });

  const { analysis, isAnalyzing, analyze } = useOptimization();

  const handleFormSubmit = async (data: InsertOptimizationRequest) => {
    setFormData(data);
    await analyze(data);
  };

  const handleExportPDF = async () => {
    if (analysis) {
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');
      
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(15, 98, 254); // IBM Blue
      doc.text('AI Cost Optimization Report', 20, 30);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
      
      // Use Case Description
      doc.setFontSize(16);
      doc.text('Use Case Overview', 20, 65);
      doc.setFontSize(11);
      const splitDescription = doc.splitTextToSize(formData.userDescription, 170);
      doc.text(splitDescription, 20, 75);
      
      let yPosition = 75 + (splitDescription.length * 6) + 15;
      
      // Cost Summary
      doc.setFontSize(16);
      doc.text('Cost Analysis Summary', 20, yPosition);
      yPosition += 15;
      
      doc.setFontSize(11);
      doc.text(`Total Monthly Cost: $${analysis.totalMonthlyCost.toLocaleString()}`, 20, yPosition);
      doc.text(`Cost per Request: $${analysis.costPerRequest}`, 20, yPosition + 10);
      doc.text(`Efficiency Score: ${analysis.efficiency}%`, 20, yPosition + 20);
      
      yPosition += 40;
      
      // Model Recommendations Table
      doc.setFontSize(16);
      doc.text('Recommended Models', 20, yPosition);
      yPosition += 10;
      
      const modelData = analysis.models.map(model => [
        model.name,
        model.provider,
        `$${model.costPer1K}`,
        `${model.latency}ms`,
        model.fitScore
      ]);
      
      (doc as any).autoTable({
        head: [['Model', 'Provider', 'Cost/1K', 'Latency', 'Fit Score']],
        body: modelData,
        startY: yPosition,
        theme: 'striped',
        headStyles: { fillColor: [15, 98, 254] }
      });
      
      yPosition = (doc as any).lastAutoTable.finalY + 20;
      
      // Cost Breakdown
      doc.setFontSize(16);
      doc.text('Cost Breakdown', 20, yPosition);
      yPosition += 10;
      
      const costData = analysis.costBreakdown.map(item => [
        item.component,
        `$${item.cost.toLocaleString()}`,
        `${item.percentage}%`
      ]);
      
      (doc as any).autoTable({
        head: [['Component', 'Cost', 'Percentage']],
        body: costData,
        startY: yPosition,
        theme: 'striped',
        headStyles: { fillColor: [15, 98, 254] }
      });
      
      // Save the PDF
      doc.save(`ai-cost-optimization-report-${new Date().toISOString().split('T')[0]}.pdf`);
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
              <Link href="/" className="text-[hsl(var(--carbon-70))] hover:text-[hsl(var(--carbon-100))] text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/analytics" className="text-[hsl(var(--carbon-70))] hover:text-[hsl(var(--carbon-100))] text-sm font-medium">
                Analytics
              </Link>
            </nav>
            <Button 
              onClick={handleExportPDF}
              disabled={!analysis}
              className="bg-[hsl(var(--ibm-blue-60))] text-white hover:bg-[hsl(var(--ibm-blue-70))]"
            >
              <FileText className="w-4 h-4 mr-2" />
              Export PDF
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
              <Tabs defaultValue="models" className="w-full">
                <TabsList className="w-full grid grid-cols-3 bg-[hsl(var(--carbon-10))] border-b border-[hsl(var(--carbon-20))] rounded-t-lg rounded-b-none h-auto p-0">
                  <TabsTrigger 
                    value="models"
                    className="flex items-center justify-center px-6 py-4 text-sm font-medium data-[state=active]:bg-[hsl(var(--ibm-blue-50))] data-[state=active]:text-[hsl(var(--ibm-blue-60))] data-[state=active]:border-b-2 data-[state=active]:border-[hsl(var(--ibm-blue-60))] rounded-none"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Model Selection
                  </TabsTrigger>
                  <TabsTrigger 
                    value="cost"
                    className="flex items-center justify-center px-6 py-4 text-sm font-medium data-[state=active]:bg-[hsl(var(--ibm-blue-50))] data-[state=active]:text-[hsl(var(--ibm-blue-60))] data-[state=active]:border-b-2 data-[state=active]:border-[hsl(var(--ibm-blue-60))] rounded-none"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Cost Analysis
                  </TabsTrigger>
                  <TabsTrigger 
                    value="architecture" 
                    className="flex items-center justify-center px-6 py-4 text-sm font-medium data-[state=active]:bg-[hsl(var(--ibm-blue-50))] data-[state=active]:text-[hsl(var(--ibm-blue-60))] data-[state=active]:border-b-2 data-[state=active]:border-[hsl(var(--ibm-blue-60))] rounded-none"
                  >
                    <Network className="w-4 h-4 mr-2" />
                    Agent Architecture
                  </TabsTrigger>
                </TabsList>

                <div className="p-6">
                  <TabsContent value="models" className="mt-0">
                    <ModelSelectionTab analysis={analysis} />
                  </TabsContent>
                  
                  <TabsContent value="cost" className="mt-0">
                    <CostAnalysisTab analysis={analysis} />
                  </TabsContent>
                  
                  <TabsContent value="architecture" className="mt-0">
                    <AgentArchitectureTab analysis={analysis} />
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
