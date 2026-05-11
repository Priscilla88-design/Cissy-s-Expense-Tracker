import React from 'react';
import { Search, Filter, Calendar, TrendingUp, X, Check } from 'lucide-react';
import { Category, CATEGORIES, ExpenseFilters } from '../types';
import * as Slider from '@radix-ui/react-slider';
import * as Checkbox from '@radix-ui/react-checkbox';

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
      amountRange: { min: 0, max: Math.max(maxAmount, 5000) }
    });
  };

  const hasActiveFilters = filters.search || filters.categories.length > 0 || filters.dateRange.start || filters.dateRange.end || filters.amountRange.min > 0;

  return (
    <div id="filter-suite" className="bg-white rounded-xl border border-slate-100 shadow-xl p-8 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-50 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Filter className="w-5 h-5 text-[#5D85EE]" />
          </div>
          <div>
            <h3 className="font-bold text-slate-700">Audit Filters</h3>
            <p className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">Refine transaction ledger</p>
          </div>
        </div>
        {hasActiveFilters && (
          <button 
            onClick={resetFilters}
            className="px-4 py-2 bg-rose-50 text-rose-500 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-rose-100 transition-all flex items-center gap-2"
          >
            <X className="w-3 h-3" />
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Search */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">Merchant Search</label>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#5D85EE] transition-colors" />
            <input 
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Filter by vendor..."
              className="w-full pl-12 pr-4 py-3 bg-[#F8F9FA] border border-transparent rounded-xl text-sm focus:bg-white focus:border-[#5D85EE] outline-none transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Date Range Picker */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">Date Window</label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: { ...prev.dateRange, start: e.target.value } }))}
                className="w-full pl-12 pr-3 py-3 bg-[#F8F9FA] border border-transparent rounded-xl text-xs focus:bg-white focus:border-[#5D85EE] outline-none shadow-inner"
              />
            </div>
            <div className="relative flex-1">
              <input 
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => setFilters(prev => ({ ...prev, dateRange: { ...prev.dateRange, end: e.target.value } }))}
                className="w-full px-4 py-3 bg-[#F8F9FA] border border-transparent rounded-xl text-xs focus:bg-white focus:border-[#5D85EE] outline-none shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Cap: GH₵{filters.amountRange.max.toLocaleString()}</label>
          </div>
          <div className="pt-2">
            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-5"
              defaultValue={[filters.amountRange.max]}
              max={Math.max(maxAmount, 5000)}
              step={10}
              onValueChange={([val]) => setFilters(prev => ({ ...prev, amountRange: { ...prev.amountRange, max: val } }))}
            >
              <Slider.Track className="bg-slate-100 relative grow rounded-full h-[6px]">
                <Slider.Range className="absolute bg-[#5D85EE] rounded-full h-full" />
              </Slider.Track>
              <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-[#5D85EE] shadow-lg rounded-full hover:scale-110 focus:outline-none transition-transform" />
            </Slider.Root>
          </div>
        </div>

        {/* MultiSelect (Checkbox) */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">Multi-Category Scan</label>
          <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto p-3 bg-[#F8F9FA] border border-slate-50 rounded-xl shadow-inner scrollbar-hide">
            {CATEGORIES.map(cat => (
              <div key={cat} className="flex items-center gap-2 bg-white px-2 py-1 rounded-md border border-slate-100">
                <Checkbox.Root
                  className="flex h-4 w-4 appearance-none items-center justify-center rounded-[4px] bg-[#EBF0F6] outline-none focus:ring-2 focus:ring-[#5D85EE] data-[state=checked]:bg-[#5D85EE]"
                  checked={filters.categories.includes(cat)}
                  onCheckedChange={() => toggleCategory(cat)}
                  id={`cat-${cat}`}
                >
                  <Checkbox.Indicator className="text-white">
                    <Check className="w-3 h-3" />
                  </Checkbox.Indicator>
                </Checkbox.Root>
                <label className="text-[10px] font-bold text-slate-600 uppercase cursor-pointer select-none" htmlFor={`cat-${cat}`}>
                  {cat}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
