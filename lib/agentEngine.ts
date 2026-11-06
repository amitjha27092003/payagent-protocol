export interface GuardrailPolicy {
  maxTransactionLimit: number;
  dailyBudgetLimit: number;
  allowedCategories: string[];
  requireHumanApprovalAbove: number;
  autoDeclineKeywords: string[];
}

export interface CatalogItem {
  id: string;
  name: string;
  category: string;
  price: number;
  vendor: string;
  rating: number;
  inStock: boolean;
  deliveryTimeDays: number;
}

export interface AgentActionStep {
  step: number;
  title: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'warning';
  detail: string;
  timestamp: string;
}

export interface ProcurementOrder {
  orderId: string;
  userPrompt: string;
  matchedItem: CatalogItem | null;
  quantity: number;
  totalCost: number;
  status: 'analyzing' | 'policy_check' | 'awaiting_approval' | 'settled' | 'declined';
  policyBreachReason?: string;
  paypalOrderId?: string;
}

export const DEFAULT_GUARDRAILS: GuardrailPolicy = {
  maxTransactionLimit: 500,
  dailyBudgetLimit: 1200,
  allowedCategories: ['Cloud Infrastructure', 'Developer Tools', 'Office Hardware', 'API Subscriptions'],
  requireHumanApprovalAbove: 200,
  autoDeclineKeywords: ['crypto', 'gambling', 'unauthorized', 'anonymous transfer'],
};

export const MOCK_CATALOG: CatalogItem[] = [
  {
    id: 'prod-001',
    name: 'Enterprise Cloud Backup Vault (1TB / mo)',
    category: 'Cloud Infrastructure',
    price: 49.00,
    vendor: 'VaultGrid Global',
    rating: 4.9,
    inStock: true,
    deliveryTimeDays: 0,
  },
  {
    id: 'prod-002',
    name: 'GitHub Copilot Enterprise Seat (Annual Pack)',
    category: 'Developer Tools',
    price: 228.00,
    vendor: 'DevTools Direct',
    rating: 4.8,
    inStock: true,
    deliveryTimeDays: 0,
  },
  {
    id: 'prod-003',
    name: 'Synthetic API Load Testing Cluster (50M Hits)',
    category: 'API Subscriptions',
    price: 135.00,
    vendor: 'StressPulse IO',
    rating: 4.7,
    inStock: true,
    deliveryTimeDays: 0,
  },
  {
    id: 'prod-004',
    name: 'UltraWide Ergonomic Monitor 34" Curved',
    category: 'Office Hardware',
    price: 549.00,
    vendor: 'TechPro Logistics',
    rating: 4.6,
    inStock: true,
    deliveryTimeDays: 2,
  },
];

export const DEMO_PROMPTS = [
  {
    label: "Safe Automated Order",
    prompt: "Procure 2 seats of Enterprise Cloud Backup under $150 total from verified vendor."
  },
  {
    label: "Requires Human Authorization (> $200)",
    prompt: "Order 1 GitHub Copilot Enterprise Seat for Dev Team. Settle via PayPal."
  },
  {
    label: "Policy Violation Trigger",
    prompt: "Purchase 1 UltraWide Ergonomic Monitor 34\" for developer workstation ($549)."
  }
];