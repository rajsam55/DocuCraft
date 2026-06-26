import { useState, useEffect } from "react";
import { User, UsageLog, BillingHistory, AppSettings, ToolId } from "./types";
import { TOOLS_LIST } from "./utils/toolsConfig";

// Components
import Navbar from "./components/Navbar";
import ToolCard from "./components/ToolCard";
import ToolExecutor from "./components/ToolExecutor";
import UserDashboard from "./components/UserDashboard";
import AdminPanel from "./components/AdminPanel";
import PricingModal from "./components/PricingModal";
import AuthModal from "./components/AuthModal";

// Icons
import {
  Sparkles,
  Zap,
  Lock,
  ShieldCheck,
  Check,
  ChevronDown,
  ArrowRight,
  Database,
  Info,
  Layers,
  HelpCircle,
  Clock,
  LayoutDashboard
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Pre-populated default accounts
const DEFAULT_USERS: User[] = [
  {
    id: "usr_admin",
    email: "admin@pdftools.com",
    name: "Admin Controller",
    role: "admin",
    subscription: {
      planId: "enterprise",
      status: "active",
      currentPeriodEnd: "2028-12-31T23:59:59.000Z",
    },
    createdAt: "2026-01-01T12:00:00.000Z",
  },
  {
    id: "usr_premium",
    email: "premium@pdftools.com",
    name: "Sophia Vance",
    role: "user",
    subscription: {
      planId: "pro",
      status: "active",
      currentPeriodEnd: "2026-08-15T12:00:00.000Z",
      cardLast4: "4242",
    },
    createdAt: "2026-05-10T12:00:00.000Z",
  },
  {
    id: "usr_free",
    email: "free@pdftools.com",
    name: "David Miller",
    role: "user",
    subscription: {
      planId: "free",
      status: "none",
      currentPeriodEnd: "",
    },
    createdAt: "2026-06-25T08:30:00.000Z",
  },
];

// Pre-populated default logs
const DEFAULT_LOGS: UsageLog[] = [
  {
    id: "log_1",
    userId: "usr_premium",
    userEmail: "premium@pdftools.com",
    toolId: "merge-pdf",
    toolName: "Merge PDF",
    timestamp: "2026-06-24T14:30:22.000Z",
    fileName: "Invoices_Q1.pdf, Receipts_Q1.pdf",
    fileSize: "1.24 MB",
    status: "success",
  },
  {
    id: "log_2",
    userId: "usr_premium",
    userEmail: "premium@pdftools.com",
    toolId: "compress-pdf",
    toolName: "Compress PDF",
    timestamp: "2026-06-25T10:15:00.000Z",
    fileName: "Annual_Report_2025.pdf",
    fileSize: "14.8 MB",
    status: "success",
  },
  {
    id: "log_3",
    userId: "usr_free",
    userEmail: "free@pdftools.com",
    toolId: "image-to-pdf",
    toolName: "Image to PDF",
    timestamp: "2026-06-25T11:45:10.000Z",
    fileName: "passport_photo.jpg, license_scan.png",
    fileSize: "2.4 MB",
    status: "success",
  },
  {
    id: "log_4",
    userId: "usr_free",
    userEmail: "free@pdftools.com",
    toolId: "word-to-pdf",
    toolName: "Word to PDF",
    timestamp: "2026-06-26T04:22:00.000Z",
    fileName: "employment_contract_v2.docx",
    fileSize: "320 KB",
    status: "success",
  },
];

// Pre-populated invoices
const DEFAULT_INVOICES: BillingHistory[] = [
  {
    id: "inv_1",
    userId: "usr_premium",
    userEmail: "premium@pdftools.com",
    planName: "Pro Membership",
    amount: 9.99,
    status: "paid",
    timestamp: "2026-05-10T12:00:00.000Z",
    invoiceNumber: "INV-2026-0045",
  },
  {
    id: "inv_2",
    userId: "usr_premium",
    userEmail: "premium@pdftools.com",
    planName: "Pro Membership",
    amount: 9.99,
    status: "paid",
    timestamp: "2026-06-10T12:00:00.000Z",
    invoiceNumber: "INV-2026-0182",
  },
];

const DEFAULT_SETTINGS: AppSettings = {
  freeDailyLimit: 3,
  maintenanceMode: false,
  allowGuestTrial: true,
};

export default function App() {
  // Navigation states
  const [currentTab, setCurrentTab] = useState<"home" | "pricing" | "dashboard" | "admin" | "tools">("home");
  const [selectedToolId, setSelectedToolId] = useState<ToolId | null>(null);
  const [activeCategory, setActiveCategory] = useState<"all" | "pdf" | "image" | "converter">("all");

  // Models database states (synchronized with localStorage)
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [usageLogs, setUsageLogs] = useState<UsageLog[]>([]);
  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([]);
  const [appSettings, setAppSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // Modals visibility states
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pricingModalOpen, setPricingModalOpen] = useState(false);

  // FAQ Expand state
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  // Load and initialize persistent states on mount
  useEffect(() => {
    // 1. App configurations
    const savedSettings = localStorage.getItem("docucraft_settings");
    if (savedSettings) {
      setAppSettings(JSON.parse(savedSettings));
    } else {
      localStorage.setItem("docucraft_settings", JSON.stringify(DEFAULT_SETTINGS));
      setAppSettings(DEFAULT_SETTINGS);
    }

    // 2. Users database
    const savedUsers = localStorage.getItem("docucraft_users");
    let currentUsersList = DEFAULT_USERS;
    if (savedUsers) {
      currentUsersList = JSON.parse(savedUsers);
      setUsers(currentUsersList);
    } else {
      localStorage.setItem("docucraft_users", JSON.stringify(DEFAULT_USERS));
      setUsers(DEFAULT_USERS);
    }

    // 3. User session
    const savedSession = localStorage.getItem("docucraft_session");
    if (savedSession) {
      setCurrentUser(JSON.parse(savedSession));
    } else {
      // Auto login standard free member for initial visual layout onboarding
      localStorage.setItem("docucraft_session", JSON.stringify(currentUsersList[2]));
      setCurrentUser(currentUsersList[2]);
    }

    // 4. Processing logs
    const savedLogs = localStorage.getItem("docucraft_logs");
    if (savedLogs) {
      setUsageLogs(JSON.parse(savedLogs));
    } else {
      localStorage.setItem("docucraft_logs", JSON.stringify(DEFAULT_LOGS));
      setUsageLogs(DEFAULT_LOGS);
    }

    // 5. Invoices
    const savedInvoices = localStorage.getItem("docucraft_invoices");
    if (savedInvoices) {
      setBillingHistory(JSON.parse(savedInvoices));
    } else {
      localStorage.setItem("docucraft_invoices", JSON.stringify(DEFAULT_INVOICES));
      setBillingHistory(DEFAULT_INVOICES);
    }
  }, []);

  // Sync session changes back to localStorage
  const handleSessionChange = (sessionUser: User | null) => {
    setCurrentUser(sessionUser);
    if (sessionUser) {
      localStorage.setItem("docucraft_session", JSON.stringify(sessionUser));
    } else {
      localStorage.removeItem("docucraft_session");
    }
  };

  // Sync users list change to database
  const handleUsersListChange = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    localStorage.setItem("docucraft_users", JSON.stringify(updatedUsers));
  };

  // User Actions handlers
  const handleLoginSuccess = (user: User) => {
    handleSessionChange(user);
    // Refresh the user data from master list in case changed in admin
    const freshUser = users.find((u) => u.id === user.id) || user;
    handleSessionChange(freshUser);
  };

  const handleRegisterSuccess = (newUser: User) => {
    const updated = [...users, newUser];
    handleUsersListChange(updated);
    handleSessionChange(newUser);
  };

  const handleLogout = () => {
    handleSessionChange(null);
    setCurrentTab("home");
  };

  // Calculates the user's daily conversions count today
  const getTodayUsageCount = (): number => {
    if (!currentUser) return 0;
    const todayStr = new Date().toISOString().split("T")[0];
    const userTodayLogs = usageLogs.filter(
      (log) => log.userId === currentUser.id && log.timestamp.startsWith(todayStr)
    );
    return userTodayLogs.length;
  };

  // Callback when tool compiles files successfully
  const handleSuccessExecution = (newLogMeta: Omit<UsageLog, "id" | "userId" | "userEmail" | "timestamp">) => {
    const today = new Date().toISOString();
    
    // Create new log record
    const newLog: UsageLog = {
      ...newLogMeta,
      id: `log_${Date.now()}`,
      userId: currentUser?.id || "guest",
      userEmail: currentUser?.email || "anonymous_visitor",
      timestamp: today,
    };

    const updatedLogs = [newLog, ...usageLogs];
    setUsageLogs(updatedLogs);
    localStorage.setItem("docucraft_logs", JSON.stringify(updatedLogs));
  };

  // Checkout Upgrade Premium Plan execution handler
  const handleUpgradePlan = (planId: "pro" | "enterprise", cardLast4: string) => {
    if (!currentUser) return;

    // 1. Update master users list
    const updatedUsers = users.map((u) => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          subscription: {
            planId,
            status: "active" as const,
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            cardLast4,
          },
        };
      }
      return u;
    });

    handleUsersListChange(updatedUsers);

    // 2. Update active session
    const updatedSession = updatedUsers.find((u) => u.id === currentUser.id);
    if (updatedSession) {
      handleSessionChange(updatedSession);
    }

    // 3. Generate Billing Receipt
    const newInvoice: BillingHistory = {
      id: `inv_${Date.now()}`,
      userId: currentUser.id,
      userEmail: currentUser.email,
      planName: `${planId.toUpperCase()} Subscription`,
      amount: planId === "pro" ? 9.99 : 49.99,
      status: "paid",
      timestamp: new Date().toISOString(),
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    const updatedInvoices = [newInvoice, ...billingHistory];
    setBillingHistory(updatedInvoices);
    localStorage.setItem("docucraft_invoices", JSON.stringify(updatedInvoices));
  };

  // Subscription cancel auto renewal
  const handleCancelSubscription = () => {
    if (!currentUser) return;

    const updatedUsers = users.map((u) => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          subscription: {
            ...u.subscription,
            status: "canceled" as const,
          },
        };
      }
      return u;
    });

    handleUsersListChange(updatedUsers);

    const updatedSession = updatedUsers.find((u) => u.id === currentUser.id);
    if (updatedSession) {
      handleSessionChange(updatedSession);
    }
  };

  // ADMIN ACTIONS HANDLERS
  const handleAdminUpdateUserPlan = (userId: string, planId: "free" | "pro" | "enterprise") => {
    const updated = users.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          subscription: {
            planId,
            status: planId === "free" ? ("none" as const) : ("active" as const),
            currentPeriodEnd: planId === "free" ? "" : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
        };
      }
      return u;
    });

    handleUsersListChange(updated);
    
    // If updating currently logged in user
    if (currentUser && currentUser.id === userId) {
      const refreshed = updated.find((u) => u.id === userId);
      if (refreshed) handleSessionChange(refreshed);
    }
  };

  const handleAdminUpdateUserRole = (userId: string, role: "user" | "admin") => {
    const updated = users.map((u) => {
      if (u.id === userId) {
        return { ...u, role };
      }
      return u;
    });

    handleUsersListChange(updated);

    if (currentUser && currentUser.id === userId) {
      const refreshed = updated.find((u) => u.id === userId);
      if (refreshed) handleSessionChange(refreshed);
    }
  };

  const handleAdminDeleteUser = (userId: string) => {
    const updated = users.filter((u) => u.id !== userId);
    handleUsersListChange(updated);

    if (currentUser && currentUser.id === userId) {
      handleSessionChange(null);
      setCurrentTab("home");
    }
  };

  const handleAdminUpdateSettings = (newSettings: AppSettings) => {
    setAppSettings(newSettings);
    localStorage.setItem("docucraft_settings", JSON.stringify(newSettings));
  };

  // Filtering list logic for tools catalog
  const filteredTools = TOOLS_LIST.filter((tool) => {
    if (activeCategory === "all") return true;
    return tool.category === activeCategory;
  });

  const handleSelectTool = (id: ToolId) => {
    setSelectedToolId(id);
    setCurrentTab("tools");
  };

  // Pre-configured elegant FAQs
  const faqList = [
    {
      q: "Are my uploaded files and private data secure?",
      a: "Yes, absolutely! DocuCraft utilizes a fully local WebAssembly and Canvas compilation pipeline. Your file contents, documents, and images are processed 100% inside your browser sandbox. We never stream or upload your source binary files to external databases, guaranteeing maximum corporate safety."
    },
    {
      q: "How does the free limit tracking work?",
      a: "Our free allowance grants any user 3 full conversions every single day. A dynamic logger logs your trials and automatically resets at midnight. Upgrading to our premium subscription removes all usage limitations."
    },
    {
      q: "Can I cancel my subscription anytime?",
      a: "Yes! There are absolutely no lock-in periods or contracts. You can easily manage, cancel, or modify your premium tier settings in one click right from your personal User Dashboard."
    },
    {
      q: "Does DocuCraft preserve layout and text quality?",
      a: "Our core compiling engine uses high-precision vectors to ensure that merged, split, or optimized files remain crisp and high-contrast, matching industry-leading professional publication guidelines."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col antialiased">
      {/* Navbar section */}
      <Navbar
        currentUser={currentUser}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        setSelectedToolId={setSelectedToolId}
        onLogout={handleLogout}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenPricing={() => setPricingModalOpen(true)}
      />

      {/* Main Content routing based on currentTab */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {currentTab === "home" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12 pb-16"
            >
              {/* Emergency system-wide maintenance banner */}
              {appSettings.maintenanceMode && (
                <div className="bg-amber-500 text-white py-3 text-center px-4 font-bold text-xs">
                  ⚠️ SYSTEM UPDATE: Some image rasterization workflows might experience higher delays. High premium pipelines remain fully optimized.
                </div>
              )}

              {/* Spectacular Minimal Hero Block */}
              <div className="relative pt-16 pb-12 sm:pt-24 sm:pb-16 text-center max-w-5xl mx-auto px-4">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.08),transparent)] pointer-events-none" />
                <div className="space-y-6">
                  {/* Floating badge */}
                  <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-widest animate-fade-in mx-auto">
                    <Sparkles className="h-3 w-3 animate-spin" />
                    <span>In-Browser Private Engine</span>
                  </div>

                  <h1 className="text-4xl font-extrabold sm:text-6xl text-slate-900 tracking-tight leading-none">
                    Unify Your Document <br />
                    <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
                      And Image Workflows
                    </span>
                  </h1>

                  <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
                    Merge, split, compress, and convert your file assets instantly. Experience enterprise-grade speeds combined with 100% private client-side sandboxed security.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <a
                      href="#catalog"
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition text-center cursor-pointer"
                    >
                      Browse PDF Tools
                    </a>
                    <button
                      onClick={() => setPricingModalOpen(true)}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm bg-white transition text-center cursor-pointer"
                    >
                      Explore Premium Pro
                    </button>
                  </div>
                </div>
              </div>

              {/* Value Props Grid */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
                {[
                  {
                    title: "100% Safe & Private",
                    desc: "Files are compiled completely in memory inside your browser. Your documents never reach external networks.",
                    icon: ShieldCheck,
                    color: "text-emerald-500 bg-emerald-50",
                  },
                  {
                    title: "Multi-Format Pipeline",
                    desc: "Supports merging, splitting, high-ratio compression, Word exports, and actual image conversions.",
                    icon: Layers,
                    color: "text-indigo-500 bg-indigo-50",
                  },
                  {
                    title: "Lightning Speed",
                    desc: "Powered by custom high-speed rendering threads to deliver optimized and clean file results in seconds.",
                    icon: Zap,
                    color: "text-amber-500 bg-amber-50",
                  },
                ].map((val, idx) => (
                  <div key={idx} className="p-6 bg-white rounded-2xl border border-slate-100/80 shadow-sm flex items-start space-x-4">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${val.color}`}>
                      <val.icon className="h-5.5 w-5.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{val.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">{val.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Tools Catalog Catalog Section */}
              <div id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-100 pb-4 gap-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-950 tracking-tight">Available SaaS Utilities</h2>
                    <p className="text-xs text-slate-400 mt-1">Select any tool below to launch your dedicated secure workspace.</p>
                  </div>

                  {/* Filter category pills */}
                  <div className="flex space-x-1.5 bg-slate-100 p-1.5 rounded-xl self-start sm:self-center">
                    {[
                      { id: "all", label: "All Utilities" },
                      { id: "pdf", label: "PDF Only" },
                      { id: "image", label: "Image Only" },
                      { id: "converter", label: "Converters" },
                    ].map((pill) => (
                      <button
                        key={pill.id}
                        onClick={() => setActiveCategory(pill.id as any)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                          activeCategory === pill.id
                            ? "bg-white text-slate-950 shadow-sm"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredTools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} onSelect={handleSelectTool} />
                  ))}
                </div>
              </div>

              {/* Dynamic upsell promo block */}
              {(!currentUser || currentUser.subscription.planId === "free") && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                  <div className="rounded-3xl bg-gradient-to-tr from-indigo-900 via-indigo-950 to-slate-950 p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 text-left">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(99,102,241,0.1),transparent)] pointer-events-none" />
                    <div className="space-y-2 z-10 max-w-xl">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-white/10 text-indigo-300 uppercase tracking-widest">
                        Unlimited Operations
                      </span>
                      <h3 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Unlock Unlimited SaaS Access Today</h3>
                      <p className="text-xs text-slate-300 leading-relaxed mt-1">
                        Upgrade your account to remove the 3 daily file processing limit. Unlock 10x speeds, dynamic batch files, secure OCR extraction engines, and premium prioritized pipelines.
                      </p>
                    </div>

                    <button
                      onClick={() => setPricingModalOpen(true)}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/10 transition shrink-0 z-10 cursor-pointer"
                    >
                      Get Premium Pro
                    </button>
                  </div>
                </div>
              )}

              {/* Interactive FAQ Section */}
              <div className="max-w-3xl mx-auto px-4 pt-8 text-left space-y-6">
                <div className="text-center">
                  <HelpCircle className="h-8 w-8 text-indigo-500 mx-auto mb-2" />
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</h3>
                  <p className="text-xs text-slate-400 mt-1">Quick summaries of system operations and security guidelines.</p>
                </div>

                <div className="space-y-3 pt-2">
                  {faqList.map((faq, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm"
                    >
                      <button
                        onClick={() => setExpandedFaqIndex(expandedFaqIndex === idx ? null : idx)}
                        className="w-full px-5 py-4 text-left flex justify-between items-center hover:bg-slate-50/50 transition cursor-pointer"
                      >
                        <span className="text-xs font-bold text-slate-800">{faq.q}</span>
                        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${expandedFaqIndex === idx ? "rotate-180" : ""}`} />
                      </button>

                      {expandedFaqIndex === idx && (
                        <div className="px-5 pb-4 text-[11px] text-slate-500 leading-relaxed border-t border-slate-50 pt-2.5">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {currentTab === "tools" && selectedToolId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ToolExecutor
                toolId={selectedToolId}
                currentUser={currentUser}
                dailyUsageCount={getTodayUsageCount()}
                freeLimit={appSettings.freeDailyLimit}
                onSuccessExecution={handleSuccessExecution}
                onOpenPricing={() => setPricingModalOpen(true)}
                onOpenAuth={() => setAuthModalOpen(true)}
                onBackToHome={() => {
                  setSelectedToolId(null);
                  setCurrentTab("home");
                }}
              />
            </motion.div>
          )}

          {currentTab === "pricing" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12"
            >
              <PricingModal
                isOpen={true}
                onClose={() => setCurrentTab("home")}
                currentUser={currentUser}
                onUpgradePlan={handleUpgradePlan}
                onOpenAuth={() => setAuthModalOpen(true)}
              />
            </motion.div>
          )}

          {currentTab === "dashboard" && currentUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <UserDashboard
                currentUser={currentUser}
                usageLogs={usageLogs}
                billingHistory={billingHistory}
                onUpgradePlan={(plan) => plan !== "free" && handleUpgradePlan(plan, "1111")}
                onCancelSubscription={handleCancelSubscription}
                onOpenPricing={() => setPricingModalOpen(true)}
              />
            </motion.div>
          )}

          {currentTab === "admin" && currentUser?.role === "admin" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AdminPanel
                users={users}
                usageLogs={usageLogs}
                billingHistory={billingHistory}
                settings={appSettings}
                onUpdateUserPlan={handleAdminUpdateUserPlan}
                onUpdateUserRole={handleAdminUpdateUserRole}
                onDeleteUser={handleAdminDeleteUser}
                onUpdateSettings={handleAdminUpdateSettings}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Premium minimal Footer block */}
      <footer className="bg-white border-t border-slate-100 py-10 mt-16 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <span className="font-extrabold text-sm">D</span>
            </div>
            <span className="font-bold text-slate-800 tracking-tight">DocuCraft Suite</span>
          </div>

          <p className="font-sans">
            &copy; 2026 DocuCraft Inc. All client-side file data operations compiled locally inside sandbox memory.
          </p>

          <div className="flex space-x-4">
            <span className="hover:text-slate-700">Security Policy</span>
            <span>•</span>
            <span className="hover:text-slate-700">Terms of Use</span>
          </div>
        </div>
      </footer>

      {/* Persistent global modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onRegisterSuccess={handleRegisterSuccess}
        allUsers={users}
      />

      <PricingModal
        isOpen={pricingModalOpen}
        onClose={() => setPricingModalOpen(false)}
        currentUser={currentUser}
        onUpgradePlan={handleUpgradePlan}
        onOpenAuth={() => setAuthModalOpen(true)}
      />
    </div>
  );
}
