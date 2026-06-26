import { useState } from "react";
import { User, ToolId } from "../types";
import { TOOLS_LIST } from "../utils/toolsConfig";
import { 
  FileText, 
  Sparkles, 
  User as UserIcon, 
  Settings, 
  LogOut, 
  ChevronDown, 
  Shield, 
  Menu, 
  X, 
  CreditCard, 
  LayoutDashboard,
  Activity
} from "lucide-react";

interface NavbarProps {
  currentUser: User | null;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  setSelectedToolId: (id: ToolId | null) => void;
  onLogout: () => void;
  onOpenAuth: () => void;
  onOpenPricing: () => void;
}

export default function Navbar({
  currentUser,
  currentTab,
  setCurrentTab,
  setSelectedToolId,
  onLogout,
  onOpenAuth,
  onOpenPricing,
}: NavbarProps) {
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleToolClick = (id: ToolId) => {
    setSelectedToolId(id);
    setCurrentTab("tools");
    setToolsDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleTabClick = (tab: string) => {
    setCurrentTab(tab);
    setSelectedToolId(null);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <button
              onClick={() => handleTabClick("home")}
              className="flex items-center space-x-2.5 cursor-pointer text-left focus:outline-none"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
                <FileText className="h-5.5 w-5.5" />
              </div>
              <div>
                <span className="font-sans font-extrabold text-xl tracking-tight text-slate-900">
                  Docu<span className="text-indigo-600">Craft</span>
                </span>
                <span className="block text-[10px] text-slate-400 font-mono tracking-wider uppercase -mt-1">
                  PDF & IMAGE SaaS
                </span>
              </div>
            </button>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:ml-8 md:flex md:space-x-4">
              {/* Tools Dropdown Trigger */}
              <div className="relative">
                <button
                  onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                  onBlur={() => setTimeout(() => setToolsDropdownOpen(false), 200)}
                  className="flex items-center space-x-1 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition cursor-pointer focus:outline-none"
                >
                  <span>Tools</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${toolsDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {toolsDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-72 origin-top-left rounded-xl bg-white p-3 shadow-xl ring-1 ring-slate-900/5 focus:outline-none grid grid-cols-1 gap-1">
                    <div className="text-[10px] font-semibold text-slate-400 font-mono px-3 py-1.5 uppercase tracking-wider">
                      Popular tools
                    </div>
                    {TOOLS_LIST.map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => handleToolClick(tool.id)}
                        className="flex items-start space-x-3 p-2.5 rounded-lg text-left hover:bg-indigo-50/50 transition cursor-pointer"
                      >
                        <div className="mt-0.5 text-indigo-600">
                          {/* Fallback to simple icon since dynamically matching requires importing all */}
                          <div className="h-7 w-7 rounded-md bg-indigo-50 flex items-center justify-center">
                            <Sparkles className="h-4 w-4" />
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                            {tool.name}
                            {tool.popular && (
                              <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.5 rounded-full font-sans font-medium">
                                Pop
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                            {tool.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleTabClick("pricing")}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                  currentTab === "pricing"
                    ? "text-indigo-600 bg-indigo-50/50"
                    : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                }`}
              >
                Pricing
              </button>
            </div>
          </div>

          {/* Right Section (User Auth, Dashboard, Go Premium) */}
          <div className="hidden md:flex md:items-center md:space-x-3.5">
            {currentUser ? (
              <>
                {currentUser.subscription.planId === "free" && (
                  <button
                    onClick={onOpenPricing}
                    className="flex items-center space-x-1 px-3.5 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-sm hover:shadow transition cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                    <span>Go Premium</span>
                  </button>
                )}

                {currentUser.role === "admin" && (
                  <button
                    onClick={() => handleTabClick("admin")}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                      currentTab === "admin"
                        ? "text-indigo-600 bg-indigo-50/50"
                        : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                    }`}
                  >
                    <Shield className="h-4 w-4 text-indigo-600" />
                    <span>Admin Panel</span>
                  </button>
                )}

                <button
                  onClick={() => handleTabClick("dashboard")}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                    currentTab === "dashboard"
                      ? "text-indigo-600 bg-indigo-50/50"
                      : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    onBlur={() => setTimeout(() => setProfileDropdownOpen(false), 200)}
                    className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-50 transition cursor-pointer focus:outline-none"
                  >
                    <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-semibold text-sm">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left hidden lg:block max-w-[120px]">
                      <div className="text-xs font-semibold text-slate-800 truncate">
                        {currentUser.name}
                      </div>
                      <div className="text-[10px] text-slate-400 capitalize">
                        {currentUser.subscription.planId} account
                      </div>
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 origin-top-right rounded-xl bg-white py-1 shadow-xl ring-1 ring-slate-900/5 focus:outline-none">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">Signed in as</p>
                        <p className="text-xs font-semibold text-slate-800 truncate mt-0.5">{currentUser.email}</p>
                      </div>
                      
                      <button
                        onClick={() => handleTabClick("dashboard")}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                      >
                        <UserIcon className="h-4 w-4 text-slate-400" />
                        <span>My Account</span>
                      </button>

                      <button
                        onClick={onOpenPricing}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                      >
                        <CreditCard className="h-4 w-4 text-slate-400" />
                        <span>Subscriptions</span>
                      </button>

                      <button
                        onClick={onLogout}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50/50 transition border-t border-slate-100 cursor-pointer"
                      >
                        <LogOut className="h-4 w-4 text-rose-400" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={onOpenAuth}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-950 transition cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={onOpenAuth}
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow transition cursor-pointer"
                >
                  Create Account
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 focus:outline-none cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-2 shadow-inner">
          <div className="text-[10px] font-semibold text-slate-400 font-mono tracking-wider uppercase px-2 mb-1">
            Available Tools
          </div>
          <div className="grid grid-cols-2 gap-2">
            {TOOLS_LIST.map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleToolClick(tool.id)}
                className="flex items-center space-x-2 p-2 rounded-lg text-left hover:bg-indigo-50/50 transition cursor-pointer text-xs font-medium text-slate-700"
              >
                <Sparkles className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                <span className="truncate">{tool.name}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3 mt-2 space-y-1">
            <button
              onClick={() => handleTabClick("pricing")}
              className="flex items-center space-x-2 w-full p-2.5 rounded-lg text-left text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <CreditCard className="h-4 w-4 text-slate-400" />
              <span>Pricing Plans</span>
            </button>

            {currentUser ? (
              <>
                <button
                  onClick={() => handleTabClick("dashboard")}
                  className="flex items-center space-x-2 w-full p-2.5 rounded-lg text-left text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <LayoutDashboard className="h-4 w-4 text-slate-400" />
                  <span>Dashboard</span>
                </button>

                {currentUser.role === "admin" && (
                  <button
                    onClick={() => handleTabClick("admin")}
                    className="flex items-center space-x-2 w-full p-2.5 rounded-lg text-left text-sm font-medium text-indigo-600 hover:bg-indigo-50/50 cursor-pointer"
                  >
                    <Shield className="h-4 w-4 text-indigo-500" />
                    <span>Admin Panel</span>
                  </button>
                )}

                <div className="border-t border-slate-100 pt-3 mt-2 px-2.5 flex justify-between items-center">
                  <div>
                    <div className="text-xs font-semibold text-slate-800">{currentUser.name}</div>
                    <div className="text-[10px] text-slate-400 capitalize">{currentUser.subscription.planId} Plan</div>
                  </div>
                  <button
                    onClick={onLogout}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-rose-100 hover:bg-rose-50 text-rose-600 transition cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={onOpenAuth}
                  className="px-4 py-2.5 rounded-lg border border-slate-200 text-center text-sm font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={onOpenAuth}
                  className="px-4 py-2.5 rounded-lg bg-indigo-600 text-center text-sm font-semibold text-white hover:bg-indigo-700 transition cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
