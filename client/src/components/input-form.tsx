import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InsertOptimizationRequest } from "@shared/schema";

interface InputFormProps {
  onSubmit: (data: InsertOptimizationRequest) => Promise<void>;
  isLoading: boolean;
  initialData: InsertOptimizationRequest;
}

export default function InputForm({ onSubmit, isLoading, initialData }: InputFormProps) {
  const [formData, setFormData] = useState<InsertOptimizationRequest>(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleComplexityChange = (complexity: string) => {
    setFormData(prev => ({ ...prev, complexity }));
  };

  return (
    <Card className="border-[hsl(var(--carbon-20))]">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          <Settings className="w-5 h-5 text-[hsl(var(--ibm-blue-60))]" />
          <span>Use Case Configuration</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-sm font-medium text-[hsl(var(--carbon-100))] mb-2">
              Use Case Type
            </Label>
            <Select 
              value={formData.useCase} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, useCase: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select use case..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chatbot">Customer Service Chatbot</SelectItem>
                <SelectItem value="analysis">Data Analysis & Insights</SelectItem>
                <SelectItem value="content">Content Generation</SelectItem>
                <SelectItem value="automation">Process Automation</SelectItem>
                <SelectItem value="prediction">Predictive Analytics</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium text-[hsl(var(--carbon-100))] mb-2">
              Complexity Level
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as const).map((level) => (
                <Button
                  key={level}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleComplexityChange(level)}
                  className={cn(
                    "text-xs font-medium transition-colors",
                    formData.complexity === level
                      ? "border-[hsl(var(--ibm-blue-60))] bg-[hsl(var(--ibm-blue-50))] text-[hsl(var(--ibm-blue-60))]"
                      : "border-[hsl(var(--carbon-30))] text-[hsl(var(--carbon-70))] hover:border-[hsl(var(--ibm-blue-60))] hover:text-[hsl(var(--ibm-blue-60))]"
                  )}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-[hsl(var(--carbon-100))] mb-2">
              Expected Users
            </Label>
            <Input
              type="number"
              placeholder="e.g., 1000"
              value={formData.users}
              onChange={(e) => setFormData(prev => ({ ...prev, users: parseInt(e.target.value) || 0 }))}
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-[hsl(var(--carbon-100))] mb-2">
              Daily Requests
            </Label>
            <Input
              type="number"
              placeholder="e.g., 10000"
              value={formData.dailyRequests}
              onChange={(e) => setFormData(prev => ({ ...prev, dailyRequests: parseInt(e.target.value) || 0 }))}
              className="w-full"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-[hsl(var(--carbon-100))] mb-2">
              Response Time Requirement
            </Label>
            <Select 
              value={formData.responseTime} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, responseTime: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time (&lt; 100ms)</SelectItem>
                <SelectItem value="fast">Fast (&lt; 1s)</SelectItem>
                <SelectItem value="standard">Standard (&lt; 5s)</SelectItem>
                <SelectItem value="batch">Batch Processing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium text-[hsl(var(--carbon-100))] mb-2">
              Budget Range (Monthly)
            </Label>
            <Select 
              value={formData.budget} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">$1K - $5K</SelectItem>
                <SelectItem value="medium">$5K - $25K</SelectItem>
                <SelectItem value="large">$25K - $100K</SelectItem>
                <SelectItem value="enterprise">$100K+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[hsl(var(--ibm-blue-60))] text-white py-3 hover:bg-[hsl(var(--ibm-blue-70))]"
            disabled={isLoading || !formData.useCase}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 mr-2" />
                Analyze & Optimize
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
