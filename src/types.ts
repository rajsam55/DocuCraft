export type UserRole = "user" | "admin";

export interface SubscriptionPlan {
  id: "free" | "pro" | "enterprise";
  name: string;
  price: number;
  interval: "month" | "year";
  features: string[];
  limit: number; // daily tools limit (-1 for unlimited)
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  subscription: {
    planId: "free" | "pro" | "enterprise";
    status: "active" | "canceled" | "none";
    currentPeriodEnd: string;
    cardLast4?: string;
  };
  createdAt: string;
}

export type ToolId =
  | "merge-pdf"
  | "split-pdf"
  | "compress-pdf"
  | "image-to-pdf"
  | "pdf-to-image"
  | "word-to-pdf"
  | "pdf-to-word"
  | "image-convert";

export interface ToolInfo {
  id: ToolId;
  name: string;
  description: string;
  category: "pdf" | "image" | "converter";
  iconName: string; // lucide icon name
  popular?: boolean;
}

export interface UsageLog {
  id: string;
  userId: string;
  userEmail: string;
  toolId: ToolId;
  toolName: string;
  timestamp: string;
  fileName: string;
  fileSize: string;
  status: "success" | "failed";
}

export interface BillingHistory {
  id: string;
  userId: string;
  userEmail: string;
  planName: string;
  amount: number;
  status: "paid" | "pending" | "refunded";
  timestamp: string;
  invoiceNumber: string;
}

export interface AppSettings {
  freeDailyLimit: number;
  maintenanceMode: boolean;
  allowGuestTrial: boolean;
}
