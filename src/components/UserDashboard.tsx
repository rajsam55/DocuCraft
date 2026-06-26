import { useState } from "react";
import { User, UsageLog, BillingHistory } from "../types";
import { 
  Sparkles, 
  Clock, 
  CreditCard, 
  Calendar, 
  User as UserIcon, 
  FileText, 
  CheckCircle, 
  Plus, 
  Check,
  AlertCircle
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { motion } from "motion/react";

interface UserDashboardProps {
  currentUser: User | null;
  usageLogs: UsageLog[];
  billingHistory: BillingHistory[];
  onUpgradePlan: (planId: "free" | "pro" | "enterprise") => void;
  onCancelSubscription: () => void;
  onOpenPricing: () => void;
}

export default function UserDashboard({
  currentUser,
  usageLogs,
  billingHistory,
  onUpgradePlan,
  onCancelSubscription,
  onOpenPricing,
}: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<"logs" | "billing" | "profile">("logs");
  const [cancelLoading, setCancelLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <UserIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-800">Access Denied</h3>
        <p className="text-sm text-slate-500 mt-1">Please log in to view your dashboard.</p>
      </div>
    );
  }

  const isPro = currentUser.subscription.planId !== "free";
  const userLogs = usageLogs.filter((log) => log.userId === currentUser.id);
  const userInvoices = billingHistory.filter((invoice) => invoice.userId === currentUser.id);

  // Generate charts data for the user's daily usage in the last 7 days
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const usageChartData = days.map((day, i) => {
    // Generate simulated daily values matching the user's logged activity
    const count = userLogs.length > 0 ? Math.floor(Math.random() * 3) + (isPro ? 2 : 1) : 0;
    return { name: day, conversions: count };
  });

  const handleCancel = () => {
    setCancelLoading(true);
    setTimeout(() => {
      onCancelSubscription();
      setCancelLoading(false);
      setSuccessMsg("Subscription successfully scheduled for cancellation.");
      setTimeout(() => setSuccessMsg(null), 4000);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent)] pointer-events-none" />
        <div className="space-y-1.5 z-10">
          <p className="text-xs font-bold text-indigo-400 font-mono tracking-wider uppercase">Welcome back,</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{currentUser.name}</h1>
          <p className="text-xs text-slate-400 max-w-lg leading-relaxed mt-1">
            Manage your conversions, track your processing history, configure subscriptions, and view billing invoices securely.
          </p>
        </div>

        {/* Subscription Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 min-w-[240px] z-10 shrink-0 w-full md:w-auto">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-300 font-mono">
              Membership State
            </span>
            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
              currentUser.subscription.planId === "free"
                ? "bg-slate-700 text-slate-300"
                : "bg-amber-400 text-amber-950 shadow-sm"
            }`}>
              {currentUser.subscription.planId}
            </span>
          </div>
          <div>
            <div className="text-xs text-slate-300">Renew date:</div>
            <div className="text-sm font-bold mt-0.5">
              {currentUser.subscription.planId === "free" 
                ? "Never (Free Tier)" 
                : new Date(currentUser.subscription.currentPeriodEnd).toLocaleDateString()}
            </div>
            
            {currentUser.subscription.planId === "free" ? (
              <button
                onClick={onOpenPricing}
                className="mt-4 w-full py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center justify-center space-x-1 cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Upgrade to Pro</span>
              </button>
            ) : (
              <div className="text-[10px] text-indigo-300 flex items-center gap-1 mt-3">
                <Check className="h-3 w-3 shrink-0" />
                <span>Premium features unlocked</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Total Converted Files</p>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{userLogs.length}</div>
          <div className="text-[10px] text-indigo-600 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>High-fidelity results archived</span>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Daily Quota Status</p>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {isPro ? "Unlimited" : `${Math.min(userLogs.length, 3)} / 3 used`}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {isPro ? "Full enterprise throughput active" : "Reset is scheduled for midnight"}
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Billing Account Type</p>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 capitalize">{currentUser.subscription.planId}</div>
          <div className="text-[10px] text-slate-400 mt-1">
            {currentUser.subscription.status === "active" ? "Payments secured via Stripe Connect" : "Trial limits enforced"}
          </div>
        </div>
      </div>

      {/* Main Container Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Dynamic Activity Chart (Col-span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">
              Weekly Tool Conversion Analytics
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={usageChartData}>
                  <defs>
                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ background: "#0f172a", borderRadius: "10px", border: "none", color: "#fff" }}
                    labelStyle={{ fontSize: "11px", fontWeight: "bold" }}
                  />
                  <Area type="monotone" dataKey="conversions" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorUsage)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Navigational Tabs & Content lists */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <div className="flex space-x-2 border-b border-slate-100 pb-3 mb-5">
              {[
                { id: "logs", label: "File Conversion Logs" },
                { id: "billing", label: "Billing Receipts" },
                { id: "profile", label: "Account Configuration" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Logs list tab */}
            {activeTab === "logs" && (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {userLogs.length === 0 ? (
                  <div className="text-center py-10">
                    <FileText className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-500 font-semibold">No conversion records</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Your processed files will be listed here.</p>
                  </div>
                ) : (
                  userLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-xl border border-slate-100 hover:border-slate-200 transition"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="h-9 w-9 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 shrink-0">
                          <Clock className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate max-w-[200px] sm:max-w-xs">
                            {log.fileName}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-sans">
                            {log.toolName} • {new Date(log.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 font-sans border border-emerald-100 uppercase tracking-wider">
                          Success
                        </span>
                        <p className="text-[10px] font-mono text-slate-400 mt-1">{log.fileSize}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Invoices list tab */}
            {activeTab === "billing" && (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {userInvoices.length === 0 ? (
                  <div className="text-center py-10">
                    <CreditCard className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-500 font-semibold">No billing history found</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Premium trial users do not accrue invoices.</p>
                  </div>
                ) : (
                  userInvoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-xl border border-slate-100"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-9 w-9 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 shrink-0">
                          <CheckCircle className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{invoice.planName} Plan Invoice</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {invoice.invoiceNumber} • {new Date(invoice.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-900">${invoice.amount.toFixed(2)}</p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[8px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider font-mono mt-0.5">
                          Paid
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Account Settings tab */}
            {activeTab === "profile" && (
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    defaultValue={currentUser.name}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    defaultValue={currentUser.email}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none bg-slate-50 text-slate-400"
                    disabled
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Contact administrators to alter login emails.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">User Role Privilege</label>
                  <input
                    type="text"
                    defaultValue={currentUser.role.toUpperCase()}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none bg-slate-50 text-slate-400 uppercase font-mono"
                    disabled
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: subscription and invoice details (Col-span 1) */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2.5">
              Active Plan Configuration
            </h3>

            {successMsg && (
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-[11px] font-semibold border border-emerald-100">
                {successMsg}
              </div>
            )}

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-left space-y-3">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Current Plan</p>
                <p className="text-base font-extrabold text-slate-800 mt-0.5 capitalize">{currentUser.subscription.planId} Pro</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Billing Interval</p>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">
                  {currentUser.subscription.planId === "free" ? "None" : "Monthly Auto-Renewal"}
                </p>
              </div>

              {currentUser.subscription.cardLast4 && (
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Credit Card File</p>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5 flex items-center gap-1">
                    <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                    <span>•••• •••• •••• {currentUser.subscription.cardLast4}</span>
                  </p>
                </div>
              )}
            </div>

            {currentUser.subscription.planId !== "free" ? (
              <button
                onClick={handleCancel}
                disabled={cancelLoading}
                className="w-full py-2.5 text-xs font-bold text-rose-600 border border-rose-100 rounded-xl hover:bg-rose-50/30 transition flex items-center justify-center space-x-1 cursor-pointer disabled:opacity-50"
              >
                {cancelLoading ? "Processing..." : "Cancel Auto-Renewal"}
              </button>
            ) : (
              <button
                onClick={onOpenPricing}
                className="w-full py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-100 transition flex items-center justify-center space-x-1 cursor-pointer"
              >
                <span>Unlock Premium Access</span>
              </button>
            )}
          </div>

          <div className="bg-gradient-to-tr from-indigo-50/50 to-violet-50/50 border border-indigo-50 rounded-2xl p-5 space-y-3 text-left">
            <h4 className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-indigo-500 animate-pulse" />
              <span>Premium Support</span>
            </h4>
            <p className="text-[11px] text-indigo-900/80 leading-relaxed">
              As a {currentUser.subscription.planId} user, you have access to prioritized support. If you experience issues, our platform staff is available to help.
            </p>
            <div className="pt-1.5">
              <span className="text-[10px] text-indigo-600 font-bold bg-white/80 border border-indigo-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Support Priority: High
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
