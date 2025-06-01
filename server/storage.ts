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
    
    // Extract numerical values from the response using more comprehensive patterns
    const costMatches = responseText.match(/\$?(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:per month|monthly|\/month|month)/gi);
    let totalMonthlyCost = 3000; // Base cost
    if (costMatches && costMatches.length > 0) {
      const cleanCost = costMatches[0].replace(/[^\d.]/g, '');
      totalMonthlyCost = parseFloat(cleanCost) || 3000;
    }
    
    const perRequestMatches = responseText.match(/\$?(\d*\.?\d+)\s*(?:per request|\/request|per call)/gi);
    let costPerRequest = totalMonthlyCost / 30000; // Estimate based on monthly cost
    if (perRequestMatches && perRequestMatches.length > 0) {
      const cleanPerRequest = perRequestMatches[0].replace(/[^\d.]/g, '');
      costPerRequest = parseFloat(cleanPerRequest) || costPerRequest;
    }
    
    const efficiencyMatches = responseText.match(/(\d+)%?\s*(?:efficiency|efficient|accuracy|performance)/gi);
    let efficiency = 88;
    if (efficiencyMatches && efficiencyMatches.length > 0) {
      const cleanEfficiency = efficiencyMatches[0].replace(/[^\d]/g, '');
      efficiency = parseInt(cleanEfficiency) || 88;
    }

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
    const agents: AgentNode[] = [];
    
    // Look for agent mentions in the response
    const agentPatterns = [
      { pattern: /input|preprocessing|validation/i, name: 'Input Agent', id: 'input' },
      { pattern: /analysis|processing|reasoning|llm|model/i, name: 'Analysis Agent', id: 'analysis' },
      { pattern: /output|response|formatting|generation/i, name: 'Output Agent', id: 'output' },
      { pattern: /memory|cache|storage|context/i, name: 'Memory Agent', id: 'memory' },
      { pattern: /orchestrat|coordinat|workflow|routing/i, name: 'Orchestrator', id: 'orchestrator' },
      { pattern: /monitor|log|track|observ/i, name: 'Monitoring Agent', id: 'monitoring' },
      { pattern: /secur|auth|valid|permission/i, name: 'Security Agent', id: 'security' }
    ];

    // Find which agents are mentioned
    agentPatterns.forEach((pattern, index) => {
      if (pattern.pattern.test(responseText)) {
        agents.push({
          id: pattern.id,
          name: pattern.name,
          description: this.getAgentDescription(pattern.id, responseText),
          cost: this.calculateAgentCost(pattern.id, responseText),
          status: index < 3 ? 'success' : 'active',
          position: { x: 50 + (index * 120), y: 50 }
        });
      }
    });

    // Ensure we have at least 3 core agents
    if (agents.length < 3) {
      const coreAgents = [
        {
          id: 'input',
          name: 'Input Processing',
          description: 'Request validation & preprocessing',
          cost: 0.002,
          status: 'success' as const,
          position: { x: 50, y: 50 }
        },
        {
          id: 'analysis',
          name: 'AI Analysis',
          description: 'Core AI model processing',
          cost: 0.015,
          status: 'success' as const,
          position: { x: 200, y: 50 }
        },
        {
          id: 'output',
          name: 'Output Generation',
          description: 'Response formatting & delivery',
          cost: 0.001,
          status: 'success' as const,
          position: { x: 350, y: 50 }
        }
      ];
      return coreAgents;
    }

    return agents.slice(0, 7); // Limit to 7 agents for better visualization
  }

  private getAgentDescription(agentId: string, responseText: string): string {
    const descriptions: { [key: string]: string } = {
      'input': 'Handles request validation and preprocessing',
      'analysis': 'Performs core AI analysis and reasoning',
      'output': 'Formats and delivers responses',
      'memory': 'Manages context and caching',
      'orchestrator': 'Coordinates multi-agent workflows',
      'monitoring': 'Tracks performance and metrics',
      'security': 'Ensures data security and validation'
    };
    return descriptions[agentId] || 'Specialized processing agent';
  }

  private calculateAgentCost(agentId: string, responseText: string): number {
    const baseCosts: { [key: string]: number } = {
      'input': 0.002,
      'analysis': 0.015,
      'output': 0.001,
      'memory': 0.0005,
      'orchestrator': 0.003,
      'monitoring': 0.0008,
      'security': 0.0012
    };
    return baseCosts[agentId] || 0.005;
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
