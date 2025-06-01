import { optimizationRequests, type OptimizationRequest, type InsertOptimizationRequest, type OptimizationResult, type AgentNode, type CostBreakdown, type ModelRecommendation, type WorkflowRecommendation } from "@shared/schema";

export interface IStorage {
  createOptimizationRequest(request: InsertOptimizationRequest): Promise<OptimizationRequest>;
  getOptimizationRequest(id: number): Promise<OptimizationRequest | undefined>;
  optimizeConfiguration(request: InsertOptimizationRequest): Promise<OptimizationResult>;
}

interface LyzrResponse {
  response: string;
  [key: string]: any;
}

export class MemStorage implements IStorage {
  private requests: Map<number, OptimizationRequest>;
  private currentId: number;

  constructor() {
    this.requests = new Map();
    this.currentId = 1;
  }

  async createOptimizationRequest(insertRequest: InsertOptimizationRequest): Promise<OptimizationRequest> {
    const id = this.currentId++;
    const optimizationResult = await this.optimizeConfiguration(insertRequest);
    
    const request: OptimizationRequest = {
      id,
      userDescription: insertRequest.userDescription,
      useCaseType: insertRequest.useCaseType || null,
      complexity: insertRequest.complexity || null,
      users: insertRequest.users || null,
      dailyRequests: insertRequest.dailyRequests || null,
      responseTime: insertRequest.responseTime || null,
      budget: insertRequest.budget || null,
      recommendations: optimizationResult.recommendations,
      costEstimate: optimizationResult,
      modelRecommendations: optimizationResult.models,
    };
    
    this.requests.set(id, request);
    return request;
  }

  async getOptimizationRequest(id: number): Promise<OptimizationRequest | undefined> {
    return this.requests.get(id);
  }

  async optimizeConfiguration(request: InsertOptimizationRequest): Promise<OptimizationResult> {
    try {
      // Call Lyzr agent API
      const lyzrResponse = await this.callLyzrAgent(request.userDescription);
      
      // Parse the response and extract optimization data
      return this.parseOptimizationFromLyzr(lyzrResponse, request);
    } catch (error) {
      console.error('Lyzr API call failed:', error);
      throw new Error('Failed to get optimization analysis from AI agent');
    }
  }

  private async callLyzrAgent(userDescription: string): Promise<LyzrResponse> {
    const response = await fetch('https://agent-prod.studio.lyzr.ai/v3/inference/chat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.LYZR_API_KEY || '',
      },
      body: JSON.stringify({
        user_id: "sandeep.k.kandala@gmail.com",
        agent_id: "683ae87706e05ef78261aa66",
        session_id: "683ae87706e05ef78261aa66-fksyq6kkgud",
        message: userDescription
      })
    });

    if (!response.ok) {
      throw new Error(`Lyzr API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  private parseOptimizationFromLyzr(lyzrResponse: LyzrResponse, request: InsertOptimizationRequest): OptimizationResult {
    const responseText = lyzrResponse.response;
    
    // Extract numerical values from the response using regex patterns
    const costMatch = responseText.match(/\$?(\d+,?\d*\.?\d*)\s*(?:per month|monthly|\/month)/i);
    const totalMonthlyCost = costMatch ? parseFloat(costMatch[1].replace(/,/g, '')) : 5000;
    
    const perRequestMatch = responseText.match(/\$?(\d*\.?\d+)\s*(?:per request|\/request)/i);
    const costPerRequest = perRequestMatch ? parseFloat(perRequestMatch[1]) : 0.025;
    
    const efficiencyMatch = responseText.match(/(\d+)%?\s*(?:efficiency|efficient)/i);
    const efficiency = efficiencyMatch ? parseInt(efficiencyMatch[1]) : 85;

    // Extract model mentions
    const models = this.extractModelsFromResponse(responseText);
    
    // Extract agent workflow from response
    const agents = this.extractAgentsFromResponse(responseText);
    
    // Generate cost breakdown based on response
    const costBreakdown = this.generateCostBreakdownFromResponse(responseText, totalMonthlyCost);
    
    // Extract recommendations
    const recommendations = this.extractRecommendationsFromResponse(responseText);
    
    // Calculate hybrid strategy
    const hybridStrategy = this.calculateHybridStrategyFromResponse(responseText, totalMonthlyCost);
    
    // Calculate performance metrics
    const performance = this.calculatePerformanceFromResponse(responseText);

    return {
      totalMonthlyCost: Math.round(totalMonthlyCost),
      costPerRequest: Math.round(costPerRequest * 1000) / 1000,
      efficiency,
      agents,
      recommendations,
      costBreakdown,
      models,
      hybridStrategy,
      performance,
    };
  }

  private extractModelsFromResponse(responseText: string): ModelRecommendation[] {
    const models: ModelRecommendation[] = [];
    
    // Look for GPT models
    if (responseText.toLowerCase().includes('gpt-4') || responseText.toLowerCase().includes('gpt4')) {
      models.push({
        id: 'gpt4-turbo',
        name: 'GPT-4 Turbo',
        provider: 'OpenAI',
        performance: 94,
        costPer1K: 0.03,
        latency: 180,
        fitScore: 'excellent',
        status: 'active'
      });
    }
    
    // Look for Claude models
    if (responseText.toLowerCase().includes('claude')) {
      models.push({
        id: 'claude3-sonnet',
        name: 'Claude-3 Sonnet',
        provider: 'Anthropic',
        performance: 89,
        costPer1K: 0.015,
        latency: 145,
        fitScore: 'good',
        status: 'warning'
      });
    }
    
    // Look for Llama models
    if (responseText.toLowerCase().includes('llama')) {
      models.push({
        id: 'llama3-70b',
        name: 'Llama 3 70B',
        provider: 'Meta',
        performance: 82,
        costPer1K: 0.008,
        latency: 120,
        fitScore: 'fair',
        status: 'info'
      });
    }
    
    // Default models if none detected
    if (models.length === 0) {
      models.push(
        {
          id: 'gpt4-turbo',
          name: 'GPT-4 Turbo',
          provider: 'OpenAI',
          performance: 94,
          costPer1K: 0.03,
          latency: 180,
          fitScore: 'excellent',
          status: 'active'
        },
        {
          id: 'claude3-sonnet',
          name: 'Claude-3 Sonnet',
          provider: 'Anthropic',
          performance: 89,
          costPer1K: 0.015,
          latency: 145,
          fitScore: 'good',
          status: 'warning'
        }
      );
    }
    
    return models;
  }

  private extractAgentsFromResponse(responseText: string): AgentNode[] {
    const agents: AgentNode[] = [
      {
        id: 'input',
        name: 'Input Processing',
        description: 'Request validation & preprocessing',
        cost: 0.002,
        status: 'success',
        position: { x: 50, y: 50 }
      },
      {
        id: 'analysis',
        name: 'AI Analysis',
        description: 'Core AI model processing',
        cost: 0.015,
        status: 'success',
        position: { x: 300, y: 50 }
      },
      {
        id: 'output',
        name: 'Output Generation',
        description: 'Response formatting & delivery',
        cost: 0.001,
        status: 'success',
        position: { x: 550, y: 50 }
      }
    ];

    // Add memory agent if caching is mentioned
    if (responseText.toLowerCase().includes('cache') || responseText.toLowerCase().includes('memory')) {
      agents.push({
        id: 'memory',
        name: 'Memory Agent',
        description: 'Context & caching optimization',
        cost: 0.0005,
        status: 'active',
        position: { x: 300, y: 200 }
      });
    }

    // Add orchestrator if workflow coordination is mentioned
    if (responseText.toLowerCase().includes('orchestrat') || responseText.toLowerCase().includes('workflow')) {
      agents.push({
        id: 'orchestrator',
        name: 'Workflow Orchestrator',
        description: 'Multi-agent coordination',
        cost: 0.003,
        status: 'warning',
        position: { x: 400, y: 150 }
      });
    }

    return agents;
  }

  private generateCostBreakdownFromResponse(responseText: string, totalCost: number): CostBreakdown[] {
    return [
      {
        component: 'LLM Processing',
        cost: Math.round(totalCost * 0.7),
        percentage: 70,
        color: '#0F62FE'
      },
      {
        component: 'Infrastructure',
        cost: Math.round(totalCost * 0.18),
        percentage: 18,
        color: '#42BE65'
      },
      {
        component: 'Data Processing',
        cost: Math.round(totalCost * 0.08),
        percentage: 8,
        color: '#FF832B'
      },
      {
        component: 'Monitoring',
        cost: Math.round(totalCost * 0.04),
        percentage: 4,
        color: '#8A3FFC'
      }
    ];
  }

  private extractRecommendationsFromResponse(responseText: string): WorkflowRecommendation[] {
    const recommendations: WorkflowRecommendation[] = [];
    
    // Extract key recommendations from the response
    const lines = responseText.split('\n');
    for (const line of lines) {
      if (line.toLowerCase().includes('recommend') || line.toLowerCase().includes('suggest')) {
        recommendations.push({
          type: 'recommended',
          title: 'AI-Recommended Optimization',
          description: line.trim()
        });
      } else if (line.toLowerCase().includes('alternative') || line.toLowerCase().includes('consider')) {
        recommendations.push({
          type: 'alternative',
          title: 'Alternative Approach',
          description: line.trim()
        });
      }
    }
    
    // Default recommendations if none extracted
    if (recommendations.length === 0) {
      recommendations.push(
        {
          type: 'recommended',
          title: 'Optimized AI Architecture',
          description: 'Based on your requirements, using a multi-agent approach for best results'
        },
        {
          type: 'alternative',
          title: 'Cost-Optimized Alternative',
          description: 'Consider hybrid model strategy for significant cost savings'
        }
      );
    }
    
    return recommendations.slice(0, 4); // Limit to 4 recommendations
  }

  private calculateHybridStrategyFromResponse(responseText: string, totalCost: number) {
    const optimizedCost = totalCost * 0.8; // 20% savings
    const savings = totalCost - optimizedCost;
    
    return {
      highComplexity: {
        percentage: 30,
        cost: Math.round(optimizedCost * 0.4),
        model: 'GPT-4 Turbo'
      },
      standard: {
        percentage: 70,
        cost: Math.round(optimizedCost * 0.6),
        model: 'Claude-3 Sonnet'
      },
      totalOptimizedCost: Math.round(optimizedCost),
      savings: Math.round(savings),
      savingsPercentage: 20
    };
  }

  private calculatePerformanceFromResponse(responseText: string) {
    // Extract performance metrics from response or use intelligent defaults
    const latencyMatch = responseText.match(/(\d+)\s*ms/i);
    const latency = latencyMatch ? parseInt(latencyMatch[1]) : 200;
    
    return {
      latency,
      throughput: Math.round(1000 / latency * 100),
      accuracy: 92
    };
  }


}

export const storage = new MemStorage();
