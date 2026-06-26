import React, { useState } from "react";
import { User, BillingHistory } from "../types";
import { 
  Sparkles, 
  Check, 
  CreditCard, 
  ShieldCheck, 
  Loader2, 
  X, 
  Lock 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onUpgradePlan: (planId: "free" | "pro" | "enterprise", cardLast4: string) => void;
  onOpenAuth: () => void;
}

export default function PricingModal({
  isOpen,
  onClose,
  currentUser,
  onUpgradePlan,
  onOpenAuth,
}: PricingModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<"pro" | "enterprise" | null>(null);
  
  // Checkout States
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStep, setPaymentStep] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectPlan = (plan: "pro" | "enterprise") => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    setSelectedPlan(plan);
    setError(null);
  };

  const handleBackToPricing = () => {
    setSelectedPlan(null);
    setError(null);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    if (!cardName.trim() || cardNumber.replace(/\s/g, "").length < 16 || !cardExpiry.includes("/") || cardCvc.length < 3) {
      setError("Please complete all credit card fields with valid formatting.");
      return;
    }

    setIsSubmitting(true);
    setPaymentStep("Contacting Stripe card gateway...");
    setError(null);

    // Multi-step processing animation
    setTimeout(() => {
      setPaymentStep("Authorizing payment token with banking network...");
      
      setTimeout(() => {
        setPaymentStep("Provisioning premium account clusters & databases...");
        
        setTimeout(() => {
          const last4 = cardNumber.slice(-4);
          onUpgradePlan(selectedPlan, last4);
          setIsSubmitting(false);
          setSelectedPlan(null);
          onClose();
        }, 1200);
      }, 1000);
    }, 1000);
  };

  const planFeatures = {
    free: [
      "3 free files processed per day",
      "Standard execution speed",
      "Single-file uploads",
      "Browser local storage",
      "Community support",
    ],
    pro: [
      "Unlimited conversions processed",
      "10x faster execution speeds",
      "Batch file uploads (up to 20 files)",
      "High-fidelity OCR extraction Engines",
      "Standard PDF tools configuration",
      "Priority customer help channel",
    ],
    enterprise: [
      "Everything included in PRO tier",
      "Dedicated secure server pipelines",
      "Team conversion tracking & logs",
      "Custom security configurations",
      "24/7 designated support team",
      "REST API keys integration access",
    ],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition cursor-pointer"
        >
          <X className="h-6 w-6" />
        </button>

        <AnimatePresence mode="wait">
          {!selectedPlan ? (
            /* PLANS LIST VIEW */
            <motion.div
              key="plans"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="text-center max-w-lg mx-auto">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wider mb-2">
                  Subscription Plans
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Maximize Your Productivity
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                  Start with our free allowance, and scale up as your work expands. No binding contracts, cancel any time.
                </p>
              </div>

              {/* Plans Cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {/* Free Tier */}
                <div className="rounded-2xl border border-slate-100 p-6 flex flex-col justify-between text-left hover:border-slate-200 transition bg-slate-50/50">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Free Tier</h3>
                    <p className="text-xs text-slate-400 mt-1">For simple trials</p>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-3xl font-extrabold text-slate-900">$0</span>
                      <span className="text-xs text-slate-400 ml-1">/ lifetime</span>
                    </div>

                    <ul className="mt-6 space-y-3">
                      {planFeatures.free.map((feat, idx) => (
                        <li key={idx} className="flex items-start text-xs text-slate-600 space-x-2">
                          <Check className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    disabled
                    className="mt-8 w-full py-2.5 rounded-xl border border-slate-200 text-slate-400 font-bold text-xs bg-slate-100 text-center"
                  >
                    Current Active Tier
                  </button>
                </div>

                {/* Pro Tier */}
                <div className="rounded-2xl border-2 border-indigo-600 p-6 flex flex-col justify-between text-left relative bg-white shadow-lg shadow-indigo-100/40">
                  <div className="absolute top-0 right-6 -translate-y-1/2 inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-indigo-600 text-white uppercase tracking-wider">
                    Most Popular
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
                      <span>Pro Member</span>
                      <Sparkles className="h-4.5 w-4.5 text-indigo-500" />
                    </h3>
                    <p className="text-xs text-indigo-600 font-medium mt-1">For creators & professionals</p>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-3xl font-extrabold text-slate-900">$9.99</span>
                      <span className="text-xs text-slate-400 ml-1">/ month</span>
                    </div>

                    <ul className="mt-6 space-y-3">
                      {planFeatures.pro.map((feat, idx) => (
                        <li key={idx} className="flex items-start text-xs text-slate-600 space-x-2">
                          <Check className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                          <span className="font-medium text-slate-800">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleSelectPlan("pro")}
                    className="mt-8 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition text-center cursor-pointer"
                  >
                    Upgrade to Pro Plan
                  </button>
                </div>

                {/* Enterprise Tier */}
                <div className="rounded-2xl border border-slate-100 p-6 flex flex-col justify-between text-left hover:border-slate-200 transition bg-slate-50/50">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Enterprise</h3>
                    <p className="text-xs text-slate-400 mt-1">For corporate scales</p>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-3xl font-extrabold text-slate-900">$49.99</span>
                      <span className="text-xs text-slate-400 ml-1">/ month</span>
                    </div>

                    <ul className="mt-6 space-y-3">
                      {planFeatures.enterprise.map((feat, idx) => (
                        <li key={idx} className="flex items-start text-xs text-slate-600 space-x-2">
                          <Check className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleSelectPlan("enterprise")}
                    className="mt-8 w-full py-2.5 rounded-xl border border-indigo-100 text-indigo-600 hover:bg-indigo-50/50 font-bold text-xs transition text-center cursor-pointer"
                  >
                    Select Enterprise
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* PAYMENT / CHECKOUT GATEWAY SCREEN */
            <motion.div
              key="checkout"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-md mx-auto text-left"
            >
              <button
                onClick={handleBackToPricing}
                className="text-xs font-semibold text-slate-400 hover:text-slate-700 mb-5 flex items-center gap-1 cursor-pointer"
              >
                ← Back to subscription plans
              </button>

              <h3 className="text-lg font-extrabold text-slate-950 flex items-center gap-2">
                <CreditCard className="h-5.5 w-5.5 text-indigo-600" />
                <span>Secure SaaS Check-Out</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                You are upgrading to the <span className="font-bold text-slate-700 capitalize">{selectedPlan}</span> Membership plan.
              </p>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl mt-4 mb-6 text-xs flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-700 capitalize">{selectedPlan} Level Access</p>
                  <p className="text-[10px] text-slate-400">Cancel easily from your Account Settings.</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-900">${selectedPlan === "pro" ? "9.99" : "49.99"}</p>
                  <p className="text-[10px] text-slate-400 font-mono">monthly billing</p>
                </div>
              </div>

              {isSubmitting ? (
                /* Checkout Processing Screen */
                <div className="py-12 text-center space-y-4">
                  <div className="relative h-12 w-12 mx-auto flex items-center justify-center">
                    <Loader2 className="h-10 w-10 text-indigo-600 animate-spin absolute" />
                    <Lock className="h-4.5 w-4.5 text-indigo-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Processing Checkout Payment...</h4>
                    <p className="text-xs text-slate-400 mt-1 font-mono">{paymentStep}</p>
                  </div>
                </div>
              ) : (
                /* Card Input form */
                <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-600 mb-1.5">Cardholder Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alexander Mercer"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-400 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 mb-1.5">Credit Card Number</label>
                    <div className="relative">
                      <CreditCard className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        maxLength={19}
                        placeholder="4242  4242  4242  4242"
                        value={cardNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
                          setCardNumber(val);
                        }}
                        className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-400 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-600 mb-1.5">Expiration Date</label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, "");
                          if (val.length > 2) {
                            val = `${val.substring(0, 2)}/${val.substring(2, 4)}`;
                          }
                          setCardExpiry(val);
                        }}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-400 font-mono text-center"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 mb-1.5">Security Code (CVC)</label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        placeholder="•••"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ""))}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-400 font-mono text-center"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-[11px] text-rose-600 font-semibold flex items-center gap-1.5 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                      <span>{error}</span>
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition flex items-center justify-center space-x-1 shadow-lg shadow-indigo-100 cursor-pointer mt-2"
                  >
                    <Lock className="h-4 w-4 shrink-0" />
                    <span>Authorize Secure Payment</span>
                  </button>

                  <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 font-sans mt-4">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span>256-bit SSL Encrypted Transaction Shield</span>
                  </div>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
