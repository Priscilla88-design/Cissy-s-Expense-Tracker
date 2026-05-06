/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Wallet, Activity, TrendingUp, History, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Analytics from './components/Analytics';
import { useAuth } from './hooks/useAuth';
import { useExpenses } from './hooks/useExpenses';
import { login, logout } from './firebase';
import { Expense } from './types';

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const { expenses, addExpense, removeExpense, loading: expensesLoading } = useExpenses(user?.uid);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'add'>('dashboard');

  const handleAddExpense = async (newExpense: Omit<Expense, 'id'>) => {
    await addExpense(newExpense);
    setActiveTab('dashboard');
  };

  const handleDeleteExpense = async (id: string) => {
    await removeExpense(id);
  };

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const monthlySpending = expenses
    .filter(e => new Date(e.date).getMonth() === new Date().getMonth())
    .reduce((sum, e) => sum + e.amount, 0);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center font-serif italic text-slate-400">
        Syncing Ledger...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-lg border border-slate-200 shadow-xl overflow-hidden"
        >
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-100">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Ledger.ai</h1>
              <p className="text-slate-500 font-serif italic">Secure, AI-powered expenditure tracking.</p>
            </div>
            <button 
              onClick={login}
              className="w-full bg-indigo-600 text-white py-3 rounded font-bold text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-md"
            >
              Sign in with Google
            </button>
          </div>
          <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-[10px] text-slate-400 uppercase tracking-widest text-center">
            Encrypted • Private • Audited
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div id="app-container" className="flex h-screen w-full bg-brand-bg text-slate-800 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-sidebar text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-700 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold tracking-tight text-lg">Ledger.ai</span>
          </div>
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

        <div className="p-4 border-t border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-slate-600" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-500 flex items-center justify-center text-[10px] font-bold">
                {user.displayName?.charAt(0) || user.email?.charAt(0)}
              </div>
            )}
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-semibold truncate">{user.displayName}</span>
              <span className="text-[10px] text-slate-400 truncate">{user.email}</span>
            </div>
          </div>
          <button onClick={logout} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors" title="Logout">
            <LogOut className="w-3.5 h-3.5" />
          </button>
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
                  <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm text-sm">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Accounted</div>
                    <div className="text-2xl font-mono font-bold text-slate-900">${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm text-sm">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Monthly Burn</div>
                    <div className="text-2xl font-mono font-bold text-slate-900">${monthlySpending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm text-sm">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Account Health</div>
                    <div className="text-2xl font-mono font-bold text-slate-900">100%</div>
                    <div className="w-full bg-slate-100 h-1 rounded-full mt-3 overflow-hidden"><div className="bg-indigo-500 h-full w-full"></div></div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm text-sm">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Sync Status</div>
                    <div className="text-2xl font-mono font-bold text-emerald-600">LIVE</div>
                    <div className="text-[10px] text-slate-400 mt-1 italic">Firestore DB Active</div>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                    <Analytics expenses={expenses} />
                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-sm font-bold text-slate-700">Recent Transactions</h3>
                        <button onClick={() => setActiveTab('history')} className="text-[10px] font-bold text-indigo-600 hover:underline">VIEW ALL</button>
                      </div>
                      <ExpenseList expenses={expenses.slice(0, 10)} onDelete={handleDeleteExpense} isCompact />
                    </div>
                  </div>

                  <div className="col-span-12 lg:col-span-4 space-y-6">
                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                      <h3 className="text-sm font-bold text-slate-700 mb-4 font-serif italic">Budget Allocation</h3>
                      <div className="space-y-4">
                        {[
                          { label: 'Standard', spent: monthlySpending, total: 2500, color: 'bg-indigo-500' }
                        ].map(b => (
                          <div key={b.label}>
                            <div className="flex justify-between text-[10px] font-bold mb-1">
                              <span className="text-slate-500 uppercase">MONTHLY CAP</span>
                              <span className="text-slate-900">${b.spent.toFixed(0)} / ${b.total}</span>
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
                  <h3 className="text-sm font-bold text-slate-700 font-serif italic">Full Transaction Audit</h3>
                </div>
                <div className="overflow-x-auto">
                  <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}


