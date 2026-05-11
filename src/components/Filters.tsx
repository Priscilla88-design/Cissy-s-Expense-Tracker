import React from 'react';
import { Search, Filter, Calendar, DollarSign, X } from 'lucide-react';
import { Category, CATEGORIES, ExpenseFilters } from '../types';

interface FiltersProps {
  filters: ExpenseFilters;
  setFilters: React.Dispatch<React.SetStateAction<ExpenseFilters>>;
  maxAmount: number;
}

export default function Filters({ filters, setFilters, maxAmount }: FiltersProps) {
  const toggleCategory = (category: Category) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      categories: [],
      dateRange: { start: '', end: '' },
      amountRange: { min: 0, max: Math.max(maxAmount, 1000) }
    });
  };

  const hasActiveFilters = filters.search || filters.categories.length > 0 || filters.dateRange.start || filters.dateRange.end || filters.amountRange.min > 0;

  return (
    <div id="filter-panel" className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
          <Filter className="w-4 h-4" />
          Filter Ledger
        </div>
        {hasActiveFilters && (
          <button 
            onClick={resetFilters}
            className="text-[10px] font-bold text-rose-500 uppercase tracking-widest hover:underline flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Search Merchant</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input 
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Search..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Date Range</label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input 
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: { ...prev.dateRange, start: e.target.value } }))}
                className="w-full pl-9 pr-2 py-2 bg-slate-50 border border-slate-200 rounded text-[10px] focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
            <span className="text-slate-300">—</span>
            <div className="relative flex-1">
              <input 
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: { ...prev.dateRange, end: e.target.value } }))}
                className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded text-[10px] focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Amount Range Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Amount ($0 — ${filters.amountRange.max})</label>
          </div>
          <div className="pt-2 px-1">
            <input 
              type="range"
              min="0"
              max={Math.max(maxAmount, 1000)}
              value={filters.amountRange.max}
              onChange={(e) => setFilters(prev => ({ ...prev, amountRange: { ...prev.amountRange, max: Number(e.target.value) } }))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        </div>

        {/* Categories Multi-Select (Checkbox style) */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Categories</label>
          <div className="flex flex-wrap gap-1.5 h-[5.5rem] overflow-y-auto p-1 bg-slate-50 border border-slate-200 rounded scrollbar-hide">
            {CATEGORIES.map(cat => (
              <label 
                key={cat}
                className={`flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer border transition-all ${
                  filters.categories.includes(cat)
                    ? 'bg-indigo-600 border-indigo-600 text-white' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                }`}
              >
                <input 
                  type="checkbox"
                  checked={filters.categories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                  className="hidden"
                />
                <span className="text-[10px] font-bold uppercase tracking-tighter whitespace-nowrap">{cat}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
