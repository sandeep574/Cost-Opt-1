import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertOptimizationRequest, OptimizationResult } from "@shared/schema";

export function useOptimization() {
  const [analysis, setAnalysis] = useState<OptimizationResult | null>(null);
  const { toast } = useToast();

  const { mutateAsync: analyze, isPending: isAnalyzing } = useMutation({
    mutationFn: async (data: InsertOptimizationRequest): Promise<OptimizationResult> => {
      const response = await apiRequest("POST", "/api/analyze", data);
      return response.json();
    },
    onSuccess: (result) => {
      setAnalysis(result);
      toast({
        title: "Analysis Complete",
        description: "Your AI cost optimization analysis is ready.",
      });
    },
    onError: (error) => {
      console.error("Analysis failed:", error);
      toast({
        title: "Analysis Failed",
        description: "Please check your configuration and try again.",
        variant: "destructive",
      });
    },
  });

  return {
    analysis,
    isAnalyzing,
    analyze,
  };
}
