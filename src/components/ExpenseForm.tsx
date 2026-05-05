import React, { useState } from 'react';
import { Plus, Loader2, Sparkles } from 'lucide-react';
import { Expense, Category, CATEGORIES } from '../types';
import { categorizeExpense } from '../services/aiService';

interface ExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
}

export default function ExpenseForm({ onAddExpense }: ExpenseFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<Category>('Other');
  const [isCategorizing, setIsCategorizing] = useState(false);

  const handleCategorize = async () => {
    if (!description) return;
    setIsCategorizing(true);
    const result = await categorizeExpense(description);
    setCategory(result.category as Category);
    setIsCategorizing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    onAddExpense({
      description,
      amount: parseFloat(amount),
      date,
      category,
      aiCategorized: true,
    });

    setDescription('');
    setAmount('');
    setCategory('Other');
  };

  return (
    <form id="expense-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="space-y-1.5">
        <label htmlFor="description" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Description</label>
        <div className="relative">
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Weekly Groceries"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            required
          />
          <button
            id="ai-categorize-btn"
            type="button"
            onClick={handleCategorize}
            disabled={!description || isCategorizing}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-indigo-600 hover:bg-indigo-50 rounded transition-colors disabled:opacity-50"
            title="Auto-categorize with AI"
          >
            {isCategorizing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label htmlFor="amount" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Amount ($)</label>
          <input
            id="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded text-sm font-mono focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="date" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="category" className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all appearance-none"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <button
        id="add-expense-submit"
        type="submit"
        className="mt-4 w-full bg-indigo-600 text-white py-2.5 rounded font-bold text-xs uppercase tracking-wider hover:bg-indigo-700 shadow-sm transition-all flex items-center justify-center gap-2"
      >
        <Plus className="w-3.5 h-3.5" />
        Record Transaction
      </button>
    </form>
  );
}
