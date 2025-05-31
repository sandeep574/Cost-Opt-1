import { pgTable, text, serial, integer, real, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const optimizationRequests = pgTable("optimization_requests", {
  id: serial("id").primaryKey(),
  useCase: text("use_case").notNull(),
  complexity: text("complexity").notNull(),
  users: integer("users").notNull(),
  dailyRequests: integer("daily_requests").notNull(),
  responseTime: text("response_time").notNull(),
  budget: text("budget").notNull(),
  recommendations: json("recommendations"),
  costEstimate: json("cost_estimate"),
  modelRecommendations: json("model_recommendations"),
});

export const insertOptimizationRequestSchema = createInsertSchema(optimizationRequests).pick({
  useCase: true,
  complexity: true,
  users: true,
  dailyRequests: true,
  responseTime: true,
  budget: true,
});

export type InsertOptimizationRequest = z.infer<typeof insertOptimizationRequestSchema>;
export type OptimizationRequest = typeof optimizationRequests.$inferSelect;

// Types for optimization results
export type AgentNode = {
  id: string;
  name: string;
  description: string;
  cost: number;
  status: 'active' | 'warning' | 'success';
  position: { x: number; y: number };
};

export type WorkflowRecommendation = {
  type: 'recommended' | 'alternative';
  title: string;
  description: string;
  savings?: string;
};

export type CostBreakdown = {
  component: string;
  cost: number;
  percentage: number;
  color: string;
};

export type ModelRecommendation = {
  id: string;
  name: string;
  provider: string;
  performance: number;
  costPer1K: number;
  latency: number;
  fitScore: 'excellent' | 'good' | 'fair';
  status: 'active' | 'warning' | 'info';
};

export type OptimizationResult = {
  totalMonthlyCost: number;
  costPerRequest: number;
  efficiency: number;
  agents: AgentNode[];
  recommendations: WorkflowRecommendation[];
  costBreakdown: CostBreakdown[];
  models: ModelRecommendation[];
  hybridStrategy: {
    highComplexity: { percentage: number; cost: number; model: string };
    standard: { percentage: number; cost: number; model: string };
    totalOptimizedCost: number;
    savings: number;
    savingsPercentage: number;
  };
  performance: {
    latency: number;
    throughput: number;
    accuracy: number;
  };
};
