'use client';

import React, { useState } from 'react';
import { 
  Bot, ShieldCheck, AlertTriangle, CreditCard, CheckCircle2, 
  Terminal, Sparkles, RefreshCcw, ArrowRight, Lock
} from 'lucide-react';
import { 
  DEFAULT_GUARDRAILS, MOCK_CATALOG, DEMO_PROMPTS, 
  CatalogItem, AgentActionStep, ProcurementOrder 
} from '@/lib/agentEngine';

export default function PayAgentDashboard() {
  const [promptInput, setPromptInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [actionSteps, setActionSteps] = useState<AgentActionStep[]>([]);
  const [currentOrder, setCurrentOrder] = useState<ProcurementOrder | null>(null);
  const [walletBalance, setWalletBalance] = useState(2500.00);
  const [dailySpent, setDailySpent] = useState(384.50);

  const appendStep = (title: string, detail: string, status: AgentActionStep['status']) => {
    const newStep: AgentActionStep = {
      step: Date.now(),
      title,
      detail,
      status,
      timestamp: new Date().toLocaleTimeString(),
    };
    setActionSteps((prev) => [...prev, newStep]);
  };

  const executeAgentCommercePipeline = async (customPrompt?: string) => {
    const rawQuery = customPrompt || promptInput;
    if (!rawQuery.trim() || isRunning) return;

    setIsRunning(true);
    setActionSteps([]);
    setCurrentOrder(null);

    appendStep('Intent Parsing & Tool Calling', `Deconstructing natural language instructions: "${rawQuery}"`, 'running');
    await new Promise((r) => setTimeout(r, 900));

    let matched: CatalogItem | null = null;
    let qty = 1;

    if (rawQuery.toLowerCase().includes('backup')) {
      matched = MOCK_CATALOG[0];
      qty = rawQuery.includes('2') ? 2 : 1;
    } else if (rawQuery.toLowerCase().includes('copilot') || rawQuery.toLowerCase().includes('seat')) {
      matched = MOCK_CATALOG[1];
      qty = 1;
    } else if (rawQuery.toLowerCase().includes('monitor') || rawQuery.toLowerCase().includes('hardware')) {
      matched = MOCK_CATALOG[3];
      qty = 1;
    } else {
      matched = MOCK_CATALOG[2];
      qty = 1;
    }

    const totalCost = (matched?.price || 50) * qty;
    appendStep('Catalog Match & Supplier Verification', `Found verified vendor "${matched.vendor}" for ${matched.name} @ $${matched.price} x ${qty} = $${totalCost}`, 'completed');
    await new Promise((r) => setTimeout(r, 800));

    appendStep('Autonomous Guardrail Evaluation', `Checking against Enterprise Policies (Per-Tx Limit: $${DEFAULT_GUARDRAILS.maxTransactionLimit})`, 'running');
    await new Promise((r) => setTimeout(r, 700));

    if (totalCost > DEFAULT_GUARDRAILS.maxTransactionLimit) {
      appendStep('Policy Breach: Transaction Blocked', `Transaction $${totalCost} exceeds hard limit ($${DEFAULT_GUARDRAILS.maxTransactionLimit}). Order rejected by PayAgent.`, 'failed');
      setCurrentOrder({
        orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        userPrompt: rawQuery,
        matchedItem: matched,
        quantity: qty,
        totalCost,
        status: 'declined',
        policyBreachReason: `Exceeds single transaction cap ($${DEFAULT_GUARDRAILS.maxTransactionLimit}).`,
      });
      setIsRunning(false);
      return;
    }

    if (totalCost > DEFAULT_GUARDRAILS.requireHumanApprovalAbove) {
      appendStep('Escalated: Dual-Sign Authorization Required', `Amount $${totalCost} > $${DEFAULT_GUARDRAILS.requireHumanApprovalAbove}. Awaiting manual approval before PayPal capture.`, 'warning');
      setCurrentOrder({
        orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        userPrompt: rawQuery,
        matchedItem: matched,
        quantity: qty,
        totalCost,
        status: 'awaiting_approval',
      });
      setIsRunning(false);
      return;
    }

    appendStep('Autonomous PayPal Sandbox Dispatch', `Initiating pre-authorized checkout payload with PayPal Orders API v2`, 'running');
    await new Promise((r) => setTimeout(r, 1000));

    const simulatedPaypalId = `PAYPAL-CAPTURE-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    appendStep('Payment Settled & Cryptographically Verified', `Captured successfully via PayPal Sandbox ID: ${simulatedPaypalId}`, 'completed');

    setWalletBalance((prev) => prev - totalCost);
    setDailySpent((prev) => prev + totalCost);

    setCurrentOrder({
      orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      userPrompt: rawQuery,
      matchedItem: matched,
      quantity: qty,
      totalCost,
      status: 'settled',
      paypalOrderId: simulatedPaypalId,
    });
    setIsRunning(false);
  };

  const handleManualAuthorize = () => {
    if (!currentOrder) return;
    const simulatedPaypalId = `PAYPAL-APPROVED-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    setWalletBalance((prev) => prev - currentOrder.totalCost);
    setDailySpent((prev) => prev + currentOrder.totalCost);
    setCurrentOrder((prev) => prev ? { ...prev, status: 'settled', paypalOrderId: simulatedPaypalId } : null);
    appendStep('Manual Dual-Sign Approval Received', `Human authorized transaction. Captured via PayPal: ${simulatedPaypalId}`, 'completed');
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30">
      <header className="border-b border-slate-800/80 bg-[#0a101d]/90 backdrop-blur sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-lg tracking-tight text-white">PayAgent Protocol</h1>
              <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs px-2 py-0.5 rounded-full font-mono">
                Agentic Commerce Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">Autonomous Intent-to-Payment Orchestrator for PayPal Sandbox</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-400 block font-mono">AUTHORIZED TREASURY</span>
            <span className="text-sm font-semibold text-emerald-400">${walletBalance.toFixed(2)} USD</span>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-400 block font-mono">24H SETTLED</span>
            <span className="text-sm font-semibold text-cyan-400">${dailySpent.toFixed(2)} USD</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span>Agentic Procurement Instruction</span>
              </label>
              <span className="text-xs text-slate-500 font-mono">Natural Language to PayPal Payload</span>
            </div>

            <div className="relative">
              <textarea
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="e.g. Procure 2 seats of Cloud Backup under $150 total with verified vendor..."
                rows={3}
                className="w-full bg-[#080d17] border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition resize-none font-mono"
              />
              <button
                onClick={() => executeAgentCommercePipeline()}
                disabled={isRunning || !promptInput.trim()}
                className="absolute right-3 bottom-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-white text-xs font-medium px-4 py-2 rounded-lg flex items-center space-x-2 shadow-lg shadow-cyan-500/20 transition cursor-pointer"
              >
                {isRunning ? (
                  <>
                    <RefreshCcw className="h-3.5 w-3.5 animate-spin" />
                    <span>Executing...</span>
                  </>
                ) : (
                  <>
                    <span>Dispatch Agent</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <span className="text-xs text-slate-400 block mb-2 font-mono">1-CLICK BENCHMARK SCENARIOS:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {DEMO_PROMPTS.map((demo, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPromptInput(demo.prompt);
                      executeAgentCommercePipeline(demo.prompt);
                    }}
                    className="text-left text-xs bg-[#131d31] hover:bg-[#1a2742] border border-slate-700/60 rounded-lg p-2.5 transition text-slate-300 hover:text-cyan-300 cursor-pointer"
                  >
                    <div className="font-semibold text-slate-200 mb-0.5">{demo.label}</div>
                    <div className="text-[11px] text-slate-400 truncate">{demo.prompt}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Active Financial Guardrails (Zero-Trust Policy)</span>
              </h2>
              <span className="text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
                ENFORCED
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="bg-[#080d17] p-3 rounded-xl border border-slate-800">
                <div className="text-slate-500 text-[10px]">MAX PER-TRANSACTION</div>
                <div className="text-sm font-bold text-slate-200 mt-1">${DEFAULT_GUARDRAILS.maxTransactionLimit}</div>
              </div>
              <div className="bg-[#080d17] p-3 rounded-xl border border-slate-800">
                <div className="text-slate-500 text-[10px]">DAILY HARD CAP</div>
                <div className="text-sm font-bold text-slate-200 mt-1">${DEFAULT_GUARDRAILS.dailyBudgetLimit}</div>
              </div>
              <div className="bg-[#080d17] p-3 rounded-xl border border-slate-800">
                <div className="text-slate-500 text-[10px]">DUAL-SIGN TRIGGER</div>
                <div className="text-sm font-bold text-amber-400 mt-1">&gt; ${DEFAULT_GUARDRAILS.requireHumanApprovalAbove}</div>
              </div>
              <div className="bg-[#080d17] p-3 rounded-xl border border-slate-800">
                <div className="text-slate-500 text-[10px]">MERCHANT DOMAIN</div>
                <div className="text-sm font-bold text-cyan-400 mt-1">Verified Only</div>
              </div>
            </div>
          </div>

          <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h2 className="text-sm font-semibold text-slate-200 flex items-center space-x-2 mb-4">
              <Terminal className="h-4 w-4 text-cyan-400" />
              <span>Agentic Reasoning & Execution Trace</span>
            </h2>

            {actionSteps.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs font-mono">
                Select a scenario or dispatch custom instructions to trigger reasoning trace.
              </div>
            ) : (
              <div className="space-y-3 font-mono text-xs">
                {actionSteps.map((s, index) => (
                  <div 
                    key={index} 
                    className="flex items-start space-x-3 p-2.5 rounded-lg bg-[#080d17] border border-slate-800/80"
                  >
                    <span className="text-[10px] text-slate-500 mt-0.5">{s.timestamp}</span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className={`h-2 w-2 rounded-full ${
                          s.status === 'completed' ? 'bg-emerald-400' :
                          s.status === 'warning' ? 'bg-amber-400' :
                          s.status === 'failed' ? 'bg-rose-400' : 'bg-cyan-400 animate-ping'
                        }`} />
                        <span className="font-semibold text-slate-200">{s.title}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] mt-1">{s.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0e1626] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-cyan-400" />
                  <span>PayPal Settlement Gateway</span>
                </span>
                <span className="text-xs text-cyan-400 font-mono">v2/checkout/orders</span>
              </div>

              {!currentOrder ? (
                <div className="text-center py-16 text-slate-500 text-xs font-mono">
                  No active settlement batch.<br />Dispatch agent instructions to review and capture.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl border ${
                    currentOrder.status === 'settled' 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : currentOrder.status === 'awaiting_approval'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      : currentOrder.status === 'declined'
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                      : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                  }`}>
                    <div className="flex items-center space-x-2 font-semibold text-sm">
                      {currentOrder.status === 'settled' && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
                      {currentOrder.status === 'awaiting_approval' && <AlertTriangle className="h-5 w-5 text-amber-400" />}
                      {currentOrder.status === 'declined' && <Lock className="h-5 w-5 text-rose-400" />}
                      <span>
                        {currentOrder.status === 'settled' && 'Autonomous Payment Captured'}
                        {currentOrder.status === 'awaiting_approval' && 'Dual-Sign Authorization Required'}
                        {currentOrder.status === 'declined' && 'Transaction Blocked by Guardrail'}
                      </span>
                    </div>
                    <p className="text-xs mt-1 text-slate-300">
                      {currentOrder.status === 'settled' && `PayPal Capture ID: ${currentOrder.paypalOrderId}`}
                      {currentOrder.status === 'awaiting_approval' && 'Amount exceeds autonomous limit ($200). Human co-sign required.'}
                      {currentOrder.status === 'declined' && currentOrder.policyBreachReason}
                    </p>
                  </div>

                  <div className="bg-[#080d17] p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Order Reference:</span>
                      <span className="font-mono text-slate-200">{currentOrder.orderId}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Vendor / Payee:</span>
                      <span className="text-slate-200">{currentOrder.matchedItem?.vendor || 'Verified Marketplace'}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Product:</span>
                      <span className="text-slate-200">{currentOrder.matchedItem?.name}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Units Procured:</span>
                      <span className="font-mono text-slate-200">{currentOrder.quantity} unit(s)</span>
                    </div>
                    <div className="border-t border-slate-800 pt-2 flex justify-between font-bold text-sm">
                      <span className="text-slate-200">Total Settlement:</span>
                      <span className="text-cyan-400 font-mono">${currentOrder.totalCost.toFixed(2)} USD</span>
                    </div>
                  </div>

                  {currentOrder.status === 'awaiting_approval' && (
                    <button
                      onClick={handleManualAuthorize}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs py-3 rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span>Co-Sign & Authorize PayPal Capture</span>
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="mt-8 pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between font-mono">
              <span>Environment: PayPal Sandbox</span>
              <span className="text-emerald-400 flex items-center space-x-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Gateway Ready</span>
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}