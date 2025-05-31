export const USE_CASES = {
  chatbot: "Customer Service Chatbot",
  analysis: "Data Analysis & Insights", 
  content: "Content Generation",
  automation: "Process Automation",
  prediction: "Predictive Analytics",
} as const;

export const COMPLEXITY_LEVELS = {
  low: "Low",
  medium: "Medium", 
  high: "High",
} as const;

export const RESPONSE_TIMES = {
  realtime: "Real-time (< 100ms)",
  fast: "Fast (< 1s)",
  standard: "Standard (< 5s)",
  batch: "Batch Processing",
} as const;

export const BUDGET_RANGES = {
  small: "$1K - $5K",
  medium: "$5K - $25K",
  large: "$25K - $100K", 
  enterprise: "$100K+",
} as const;

export const COLORS = {
  carbon: {
    10: "hsl(var(--carbon-10))",
    20: "hsl(var(--carbon-20))",
    30: "hsl(var(--carbon-30))",
    50: "hsl(var(--carbon-50))",
    70: "hsl(var(--carbon-70))",
    90: "hsl(var(--carbon-90))",
    100: "hsl(var(--carbon-100))",
  },
  ibmBlue: {
    50: "hsl(var(--ibm-blue-50))",
    60: "hsl(var(--ibm-blue-60))",
    70: "hsl(var(--ibm-blue-70))",
  },
  status: {
    success: "hsl(var(--status-success))",
    warning: "hsl(var(--status-warning))",
    error: "hsl(var(--status-error))",
    info: "hsl(var(--status-info))",
  },
} as const;
