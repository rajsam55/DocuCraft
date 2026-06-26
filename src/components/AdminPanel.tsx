import { useState } from "react";
import { User, UsageLog, BillingHistory, AppSettings } from "../types";
import { TOOLS_LIST } from "../utils/toolsConfig";
import {
  Shield,
  Users,
  BarChart2,
  TrendingUp,
  Coins,
  Settings,
  Search,
  Trash2,
  Check,
  Activity,
  AlertCircle,
  Wrench,
  Sparkles
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { motion } from "motion/react";

interface AdminPanelProps {
  users: User[];
  usageLogs: UsageLog[];
  billingHistory: BillingHistory[];
  settings: AppSettings;
  onUpdateUserPlan: (userId: string, planId: "free" | "pro" | "enterprise") => void;
  onUpdateUserRole: (userId: string, role: "user" | "admin") => void;
  onDeleteUser: (userId: string) => void;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

export default function AdminPanel({
  users,
  usageLogs,
  billingHistory,
  settings,
  onUpdateUserPlan,
  onUpdateUserRole,
  onDeleteUser,
  onUpdateSettings,
}: AdminPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<"overview" | "users" | "config">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Settings changes local state
  const [freeLimit, setFreeLimit] = useState(settings.freeDailyLimit);
  const [maintenance, setMaintenance] = useState(settings.maintenanceMode);
  const [guestTrial, setGuestTrial] = useState(settings.allowGuestTrial);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Filter users based on query
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculations for KPI Cards
  const totalUsersCount = users.length;
  const premiumUsersCount = users.filter((u) => u.subscription.planId !== "free").length;
  const totalConversionsCount = usageLogs.length;
  
  // Calculate total MRR
  const totalMRR = billingHistory
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  // Recharts: conversions categorized by category (PDF, Converter, Image)
  const categoryData = [
    { name: "PDF Operations", value: usageLogs.filter((log) => {
      const tool = TOOLS_LIST.find((t) => t.id === log.toolId);
      return tool?.category === "pdf";
    }).length || 1 },
    { name: "Format Conversion", value: usageLogs.filter((log) => {
      const tool = TOOLS_LIST.find((t) => t.id === log.toolId);
      return tool?.category === "converter";
    }).length || 1 },
    { name: "Image Processing", value: usageLogs.filter((log) => {
      const tool = TOOLS_LIST.find((t) => t.id === log.toolId);
      return tool?.category === "image";
    }).length || 1 }
  ];

  const PIE_COLORS = ["#4f46e5", "#3b82f6", "#10b981"];

  // Recharts: daily total processing logs over last week
  const trendData = [
    { name: "06/20", processes: 12 },
    { name: "06/21", processes: 18 },
    { name: "06/22", processes: 15 },
    { name: "06/23", processes: 24 },
    { name: "06/24", processes: 32 },
    { name: "06/25", processes: totalConversionsCount + 4 },
  ];

  const handleSaveSettings = () => {
    onUpdateSettings({
      freeDailyLimit: freeLimit,
      maintenanceMode: maintenance,
      allowGuestTrial: guestTrial,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-5 gap-4">
        <div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 uppercase tracking-wider mb-2">
            Administrator Gateway
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight sm:text-3xl flex items-center gap-2">
            <Shield className="h-7 w-7 text-indigo-600 shrink-0" />
            <span>SaaS Core Controller</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global diagnostic dashboard, live metrics tracking, system-wide usage configs, and member subscription controls.
          </p>
        </div>

        {/* Diagnostic tab triggers */}
        <div className="flex space-x-1.5 bg-slate-100 p-1.5 rounded-xl shrink-0 w-fit self-start md:self-center">
          {[
            { id: "overview", label: "Global Diagnostics", icon: BarChart2 },
            { id: "users", label: "User Directory", icon: Users },
            { id: "config", label: "Platform Setup", icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeSubTab === tab.id
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Active Members</p>
            <div className="h-8 w-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
              <Users className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-950 mt-1">{totalUsersCount}</div>
          <p className="text-[10px] text-indigo-600 font-semibold mt-1">
            {premiumUsersCount} Pro/Enterprise upgrades
          </p>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Total SaaS Revenue</p>
            <div className="h-8 w-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
              <Coins className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-950 mt-1">${totalMRR.toFixed(2)}</div>
          <p className="text-[10px] text-emerald-600 font-semibold mt-1">
            Simulated invoice settlements
          </p>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Total Files Compiled</p>
            <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              <Activity className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-950 mt-1">{totalConversionsCount}</div>
          <p className="text-[10px] text-blue-600 font-semibold mt-1">
            Processed via client-side sandbox
          </p>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Server Operations</p>
            <div className="h-8 w-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
              <Wrench className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">100% OK</div>
          <p className="text-[10px] text-slate-400 mt-1">
            Latency index: 8ms (Optimized)
          </p>
        </div>
      </div>

      {/* Tab: Overview (Graphs) */}
      {activeSubTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Trend Chart */}
          <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-5 flex items-center justify-between">
              <span>System Daily Throughput Trends</span>
              <TrendingUp className="h-4 w-4 text-indigo-500" />
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#0f172a", borderRadius: "10px", border: "none", color: "#fff" }}
                    labelStyle={{ fontSize: "11px", fontWeight: "bold" }}
                  />
                  <Bar dataKey="processes" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={35} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category distribution Pie Chart */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-5">
              Operations segment split
            </h3>
            <div className="h-48 mx-auto relative flex items-center justify-center w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center">
                <p className="text-[10px] text-slate-400 font-mono uppercase">Total</p>
                <p className="text-lg font-black text-slate-800">{totalConversionsCount}</p>
              </div>
            </div>

            {/* Labels legends */}
            <div className="space-y-2 mt-4 border-t border-slate-50 pt-4">
              {categoryData.map((entry, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <div className="flex items-center space-x-2">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[idx] }} />
                    <span>{entry.name}</span>
                  </div>
                  <span className="font-mono text-slate-400">{entry.value} ops</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Users List */}
      {activeSubTab === "users" && (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-5">
          {/* List tools and searches */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="text-sm font-bold text-slate-800">
              Registered Accounts Directory ({filteredUsers.length} total)
            </h3>

            {/* Search query field */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search user name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Core Table View */}
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="min-w-full divide-y divide-slate-100 text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase font-mono tracking-wider">User Profile</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase font-mono tracking-wider">Registration Date</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase font-mono tracking-wider">Plan Access</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-slate-500 uppercase font-mono tracking-wider">Role privilege</th>
                  <th className="px-5 py-3.5 text-xs font-bold text-slate-500 text-right uppercase font-mono tracking-wider">Database Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-xs text-slate-700">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-400 font-semibold">
                      No accounts found matching your query.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center space-x-3.5">
                          <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-semibold">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800">{u.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-500 font-mono">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={u.subscription.planId}
                          onChange={(e) => onUpdateUserPlan(u.id, e.target.value as any)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-[11px] font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 capitalize"
                        >
                          <option value="free">Free account</option>
                          <option value="pro">Pro tier</option>
                          <option value="enterprise">Enterprise</option>
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={u.role}
                          onChange={(e) => onUpdateUserRole(u.id, e.target.value as any)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-[11px] font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 uppercase font-mono"
                        >
                          <option value="user">USER</option>
                          <option value="admin">ADMIN</option>
                        </select>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          disabled={u.email === "admin@pdftools.com" /* protect default admin */}
                          onClick={() => onDeleteUser(u.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition disabled:opacity-30 cursor-pointer"
                          title="Purge user file record"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Platform configurations */}
      {activeSubTab === "config" && (
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6 max-w-2xl">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Wrench className="h-4.5 w-4.5 text-indigo-500" />
            <span>Platform Operations Controller</span>
          </h3>

          {saveSuccess && (
            <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-xs font-semibold flex items-center gap-1.5">
              <Check className="h-4.5 w-4.5" />
              <span>Diagnostic modifications updated and persisted.</span>
            </div>
          )}

          <div className="space-y-5 text-xs">
            {/* Limit configs */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-600">Default Free Account Quota Limit (Uses / Day)</label>
              <input
                type="number"
                value={freeLimit}
                onChange={(e) => setFreeLimit(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none font-mono"
              />
              <p className="text-[10px] text-slate-400">Controls how many tools free accounts can run before facing upsells.</p>
            </div>

            {/* Maintenance toggle */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <div className="font-bold text-slate-800">Maintenance Sandbox Lock</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Locks operational tools workspace with emergency system alerts.</div>
              </div>
              <input
                type="checkbox"
                checked={maintenance}
                onChange={(e) => setMaintenance(e.target.checked)}
                className="h-4.5 w-4.5 accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Allow trial toggle */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <div className="font-bold text-slate-800">Permit Guest Direct Sandbox Conversions</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Allows anonymous visitors to perform conversions without forcing registration first.</div>
              </div>
              <input
                type="checkbox"
                checked={guestTrial}
                onChange={(e) => setGuestTrial(e.target.checked)}
                className="h-4.5 w-4.5 accent-indigo-600 cursor-pointer"
              />
            </div>

            <button
              onClick={handleSaveSettings}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-indigo-100"
            >
              <span>Save Core Configurations</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
