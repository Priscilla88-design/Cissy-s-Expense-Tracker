/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Wallet, Activity, TrendingUp, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Analytics from './components/Analytics';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Expense } from './types';

export default function App() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('spendwise-expenses', []);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'add'>('dashboard');

  const handleAddExpense = (newExpense: Omit<Expense, 'id'>) => {
    const expense: Expense = {
      ...newExpense,
      id: crypto.randomUUID(),
    };
    setExpenses([expense, ...expenses]);
    setActiveTab('dashboard');
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const monthlySpending = expenses
    .filter(e => new Date(e.date).getMonth() === new Date().getMonth())
    .reduce((sum, e) => sum + e.amount, 0);

  return (
    <div id="app-container" className="flex h-screen w-full bg-brand-bg text-slate-800 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-sidebar text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-700 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center">
            <Wallet className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold tracking-tight text-lg">Ledger.ai</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'dashboard' 
                ? 'bg-indigo-600/20 text-indigo-400 border-l-2 border-indigo-500' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800 border-l-2 border-transparent'
            }`}
          >
            <Activity className="w-4 h-4" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'history' 
                ? 'bg-indigo-600/20 text-indigo-400 border-l-2 border-indigo-500' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800 border-l-2 border-transparent'
            }`}
          >
            <History className="w-4 h-4" />
            Transactions
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'add' 
                ? 'bg-indigo-600/20 text-indigo-400 border-l-2 border-indigo-500' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800 border-l-2 border-transparent'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Add Expense
          </button>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-500 flex items-center justify-center text-[10px] font-bold">SJ</div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold">Sarah Jenkins</span>
              <span className="text-[10px] text-slate-400">Pro Plan</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-xl font-bold text-slate-800">
            {activeTab === 'dashboard' && 'Financial Overview'}
            {activeTab === 'history' && 'Transaction History'}
            {activeTab === 'add' && 'New Transaction'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-md border border-slate-200">
              <span className="text-xs font-medium text-slate-500">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' })} — {new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
              </span>
            </div>
            {activeTab !== 'add' && (
              <button 
                onClick={() => setActiveTab('add')}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded shadow-sm hover:bg-indigo-700 uppercase tracking-wider"
              >
                Add Transaction
              </button>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Top Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Spent</div>
                    <div className="text-2xl font-mono font-bold text-slate-900">${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <div className="text-[10px] text-emerald-500 mt-1 flex items-center gap-1 font-bold">+0.0% <span className="text-slate-400 font-normal">vs last month</span></div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Monthly Spending</div>
                    <div className="text-2xl font-mono font-bold text-slate-900">${monthlySpending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <div className="text-[10px] text-rose-500 mt-1 flex items-center gap-1 font-bold">+0.0% <span className="text-slate-400 font-normal">vs budget</span></div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Savings Goal</div>
                    <div className="text-2xl font-mono font-bold text-slate-900">$840.15</div>
                    <div className="w-full bg-slate-100 h-1 rounded-full mt-3 overflow-hidden"><div className="bg-indigo-500 h-full w-3/4"></div></div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Credit Score</div>
                    <div className="text-2xl font-mono font-bold text-slate-900">748</div>
                    <div className="text-[10px] text-slate-400 mt-1">Excellent health</div>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-8 flex flex-col gap-6">
                    <Analytics expenses={expenses} />
                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-sm font-bold text-slate-700">Recent Transactions</h3>
                        <button onClick={() => setActiveTab('history')} className="text-[10px] font-bold text-indigo-600 hover:underline">VIEW ALL</button>
                      </div>
                      <ExpenseList expenses={expenses.slice(0, 7)} onDelete={handleDeleteExpense} isCompact />
                    </div>
                  </div>

                  <div className="col-span-4 space-y-6">
                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                      <h3 className="text-sm font-bold text-slate-700 mb-4">Budget Tracking</h3>
                      <div className="space-y-4">
                        {[
                          { label: 'Food', spent: 420, total: 500, color: 'bg-orange-400' },
                          { label: 'Transport', spent: 210, total: 400, color: 'bg-emerald-500' },
                          { label: 'Shopping', spent: 650, total: 450, color: 'bg-rose-500' }
                        ].map(b => (
                          <div key={b.label}>
                            <div className="flex justify-between text-[10px] font-bold mb-1">
                              <span className="text-slate-500 uppercase">{b.label}</span>
                              <span className="text-slate-900">${b.spent} / ${b.total}</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div className={`${b.color} h-full transition-all`} style={{ width: `${Math.min((b.spent/b.total)*100, 100)}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'add' && (
              <motion.div
                key="add"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="max-w-xl mx-auto"
              >
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 italic font-serif text-slate-400 text-xs">Ledger / Add Transaction</div>
                  <div className="p-6">
                    <ExpenseForm onAddExpense={handleAddExpense} />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden"
              >
                 <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-700 font-serif italic">Full Audit Log</h3>
                </div>
                <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

