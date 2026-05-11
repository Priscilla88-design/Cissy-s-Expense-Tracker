/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Wallet, Activity, TrendingUp, History, LogOut, Filter, CheckCircle2, Calendar, User, Info } from 'lucide-react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Analytics from './components/Analytics';
import Filters from './components/Filters';
import { useAuth } from './hooks/useAuth';
import { useExpenses } from './hooks/useExpenses';
import { login, logout } from './firebase';
import { Expense, ExpenseFilters } from './types';

function OKButton({ label = "Button", onClick, type = "button" }: { label?: string; onClick?: () => void; type?: "button" | "submit" }) {
  return (
    <button 
      onClick={onClick}
      type={type}
      className="flex items-center gap-4 group hover:opacity-80 transition-all p-2 bg-white/40 rounded-2xl hover:bg-white/60"
    >
      <div className="border-[2.5px] border-[#007AFF] rounded-[12px] px-4 py-1.5 flex items-center justify-center min-w-[60px] shadow-sm">
        <span className="text-[#007AFF] font-black text-sm leading-none uppercase tracking-wider">OK</span>
      </div>
      <span className="text-[#334155] font-bold text-xl tracking-tight leading-none pr-4">{label}</span>
    </button>
  );
}

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const { expenses, addExpense, removeExpense } = useExpenses(user?.uid);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'add'>('dashboard');
  const [showFilters, setShowFilters] = useState(false);

  const maxExpenseAmount = useMemo(() => {
    return expenses.length > 0 ? Math.max(...expenses.map(e => e.amount)) : 1000;
  }, [expenses]);

  const [filters, setFilters] = useState<ExpenseFilters>({
    search: '',
    categories: [],
    dateRange: { start: '', end: '' },
    amountRange: { min: 0, max: 10000 } // Will be updated by maxExpenseAmount logic potentially or just handle in component
  });

  // Initial max amount sync
  useMemo(() => {
    setFilters(f => ({ ...f, amountRange: { ...f.amountRange, max: Math.max(maxExpenseAmount, f.amountRange.max) } }));
  }, [maxExpenseAmount]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const matchesSearch = e.description.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = filters.categories.length === 0 || filters.categories.includes(e.category);
      const matchesAmount = e.amount >= filters.amountRange.min && e.amount <= filters.amountRange.max;
      
      let matchesDate = true;
      if (filters.dateRange.start) {
        matchesDate = matchesDate && new Date(e.date) >= new Date(filters.dateRange.start);
      }
      if (filters.dateRange.end) {
        matchesDate = matchesDate && new Date(e.date) <= new Date(filters.dateRange.end);
      }

      return matchesSearch && matchesCategory && matchesAmount && matchesDate;
    });
  }, [expenses, filters]);

  const handleAddExpense = async (newExpense: Omit<Expense, 'id'>) => {
    await addExpense(newExpense);
    setActiveTab('dashboard');
  };

  const handleDeleteExpense = async (id: string) => {
    await removeExpense(id);
  };

  const totalSpent = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
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
    <div id="app-container" className="flex h-screen w-full bg-[#EBF0F6] text-slate-800 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
        {/* Logo Section */}
        <div className="p-6 flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-[#007AFF] rounded-full flex items-center justify-center shadow-lg shadow-blue-100">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="font-black tracking-tight text-[#007AFF] text-lg uppercase leading-none">Expense Tracker</span>
        </div>
        
        {/* User Profile Section */}
        <div className="px-6 py-2 flex flex-col items-center">
          <div className="relative mb-3 group">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || ''} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-300 border-4 border-white shadow-md">
                {user.displayName?.charAt(0) || user.email?.charAt(0)}
              </div>
            )}
          </div>
          <h2 className="font-bold text-slate-800 text-sm mb-4">{user.displayName || 'Nicholas Delacruz'}</h2>
          
          <div className="w-full bg-[#F8F9FA] border border-slate-100 rounded-lg p-2 px-4 flex items-center justify-between shadow-sm mb-8">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-bold text-slate-700">GH₵{totalSpent.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Navigation Sidebar */}
        <nav className="flex-1 px-4 space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-4 px-6 py-3 rounded-full transition-all duration-300 group ${
              activeTab === 'dashboard' 
                ? 'bg-[#5D85EE] text-white shadow-lg shadow-blue-100' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span className="font-bold text-sm">Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-4 px-6 py-3 rounded-full transition-all duration-300 group ${
              activeTab === 'history' 
                ? 'bg-[#5D85EE] text-white shadow-lg shadow-blue-100' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <History className="w-4 h-4" />
            <span className="font-bold text-sm">Transactions</span>
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`w-full flex items-center gap-4 px-6 py-3 rounded-full transition-all duration-300 group ${
              activeTab === 'add' 
                ? 'bg-[#5D85EE] text-white shadow-lg shadow-blue-100' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span className="font-bold text-sm">About</span>
          </button>
        </nav>

        {/* Footer Area */}
        <div className="p-6 border-t border-slate-100">
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-rose-500 transition-colors text-[10px] font-bold uppercase tracking-widest">
            <LogOut className="w-4 h-4" />
            Log Out System
          </button>
        </div>
      </aside>

      {/* Main View Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-transparent flex items-center justify-between px-8 shrink-0">
          <h1 className="text-lg font-bold text-slate-600">
            {activeTab === 'dashboard' && 'Dashboard'}
            {activeTab === 'history' && 'Transactions History'}
            {activeTab === 'add' && 'Project Information'}
          </h1>
          
          <div className="bg-white border border-slate-200 rounded-lg px-4 py-2 flex items-center gap-4 shadow-sm">
            <span className="text-xs font-bold text-slate-500">
              08/05/2026 - 11/05/2026
            </span>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          <AnimatePresence mode="wait">
            <motion.div layout className="space-y-6 max-w-[1100px]">
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Grid of Summaries */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center">
                      <div className="text-3xl font-bold text-[#4B75E5] mb-1">GH₵{(totalSpent * 1.2).toLocaleString()}</div>
                      <div className="text-xs font-bold text-slate-400">Income</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center">
                      <div className="text-3xl font-bold text-[#FF5D8F] mb-1">GH₵{totalSpent.toLocaleString()}</div>
                      <div className="text-xs font-bold text-slate-400">Expenses</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center">
                      <div className="text-3xl font-bold text-[#62C97F] mb-1">GH₵{(totalSpent * 0.2).toLocaleString()}</div>
                      <div className="text-xs font-bold text-slate-400">Balance</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center">
                      <div className="text-3xl font-bold text-[#4CC9F0] mb-1">{expenses.length}</div>
                      <div className="text-xs font-bold text-slate-400">Transactions</div>
                    </div>
                  </div>

                  <div className="bg-white p-10 rounded-xl border border-slate-100 shadow-sm min-h-[500px]">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">Financial Ledger Analysis</h3>
                        <p className="text-xs font-medium text-slate-400">Comprehensive expenditure breakdown • Aug 8 - May 11</p>
                      </div>
                      <OKButton label="Analyze Ledger" onClick={() => setActiveTab('history')} />
                    </div>
                    <Analytics expenses={filteredExpenses} />
                  </div>
                </motion.div>
              )}

              {activeTab === 'history' && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden"
                >
                  <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
                    <div>
                      <h3 className="text-lg font-bold text-slate-700">Audit Trail</h3>
                      <p className="text-xs font-medium text-slate-400">Full transaction history</p>
                    </div>
                    <button 
                      onClick={() => setShowFilters(!showFilters)}
                      className={`p-2 rounded-lg border transition-all ${showFilters ? 'bg-indigo-50 border-[#5D85EE] text-[#5D85EE]' : 'bg-white border-slate-200 text-slate-500'}`}
                    >
                      <Filter className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {showFilters && (
                    <div className="p-8 border-b border-slate-50 bg-slate-50/30">
                      <Filters filters={filters} setFilters={setFilters} maxAmount={maxExpenseAmount} />
                    </div>
                  )}
                  
                  <div className="overflow-x-auto">
                    <ExpenseList expenses={filteredExpenses} onDelete={handleDeleteExpense} />
                  </div>
                </motion.div>
              )}

              {activeTab === 'add' && (
                <motion.div
                  key="add"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="max-w-2xl mx-auto"
                >
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
                    <div className="px-10 py-8 bg-[#F8F9FA] border-b border-slate-100">
                      <h3 className="text-xl font-bold text-slate-800">Add New Expense</h3>
                      <p className="text-sm text-slate-400">Enter transaction details below</p>
                    </div>
                    <div className="p-10">
                      <ExpenseForm onAddExpense={handleAddExpense} />
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}


