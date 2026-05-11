import { Trash2, TrendingUp, TrendingDown, ChevronUp, ChevronDown } from 'lucide-react';
import { Expense, Category } from '../types';
import { format } from 'date-fns';
import { useState, useMemo } from 'react';

interface DataGridProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  isCompact?: boolean;
}

type SortKey = 'date' | 'description' | 'category' | 'amount';
type SortOrder = 'asc' | 'desc';

export default function DataGrid({ expenses, onDelete, isCompact }: DataGridProps) {
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const sortedExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => {
      let aVal: any = a[sortKey];
      let bVal: any = b[sortKey];

      if (sortKey === 'date') {
        aVal = new Date(a.date).getTime();
        bVal = new Date(b.date).getTime();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [expenses, sortKey, sortOrder]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === expenses.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(expenses.map(e => e.id)));
    }
  };

  const batchDelete = () => {
    if (window.confirm(`Delete ${selectedIds.size} records?`)) {
      selectedIds.forEach(id => onDelete(id));
      setSelectedIds(new Set());
    }
  };

  const categoryColorsMap: Record<string, string> = {
    Food: 'bg-orange-100 text-orange-700',
    Transport: 'bg-emerald-100 text-emerald-700',
    Shopping: 'bg-blue-100 text-blue-700',
    Entertainment: 'bg-purple-100 text-purple-700',
    Health: 'bg-cyan-100 text-cyan-700',
    Utilities: 'bg-amber-100 text-amber-700',
    Other: 'bg-slate-100 text-slate-600',
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 italic font-serif text-slate-400">
        No record entries found for this ledger.
      </div>
    );
  }

  return (
    <div id="datagrid-container" className="flex flex-col">
      {!isCompact && selectedIds.size > 0 && (
        <div className="px-4 py-2 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
            {selectedIds.size} Records Selected
          </span>
          <button 
            onClick={batchDelete}
            className="flex items-center gap-2 px-3 py-1 bg-rose-500 text-white rounded text-[10px] font-bold uppercase tracking-widest shadow-sm hover:bg-rose-600 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            Bulk Delete
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {!isCompact && (
                <th className="px-4 py-2 w-8">
                  <input 
                    type="checkbox" 
                    onChange={toggleSelectAll}
                    checked={selectedIds.size === expenses.length && expenses.length > 0}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
              )}
              {[
                { label: 'Date', key: 'date' as SortKey },
                { label: 'Merchant', key: 'description' as SortKey },
                { label: 'Category', key: 'category' as SortKey },
                { label: 'Amount', key: 'amount' as SortKey, alignRight: true },
              ].map((col) => (
                <th 
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className={`px-4 py-2 text-[10px] font-bold text-slate-400 uppercase italic font-serif cursor-pointer hover:text-slate-600 transition-colors ${col.alignRight ? 'text-right' : ''}`}
                >
                  <div className={`flex items-center gap-1 ${col.alignRight ? 'justify-end' : ''}`}>
                    {col.label}
                    {sortKey === col.key && (
                      sortOrder === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
              ))}
              {!isCompact && <th className="w-10"></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sortedExpenses.map((expense) => (
              <tr key={expense.id} className={`hover:bg-slate-50 transition-colors group ${selectedIds.has(expense.id) ? 'bg-indigo-50/30' : ''}`}>
                {!isCompact && (
                  <td className="px-4 py-2.5">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.has(expense.id)}
                      onChange={() => toggleSelect(expense.id)}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </td>
                )}
                <td className="px-4 py-2.5 text-xs text-slate-500 font-mono">
                  {format(new Date(expense.date), 'MMM dd, yyyy')}
                </td>
                <td className="px-4 py-2.5 text-xs font-semibold text-slate-800">
                  <div className="flex items-center gap-2">
                    {expense.description}
                    {expense.amount > 500 && <TrendingUp className="w-3 h-3 text-rose-400" title="High expense" />}
                    {expense.amount < 20 && <TrendingDown className="w-3 h-3 text-emerald-400" title="Small transaction" />}
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-tighter ${categoryColorsMap[expense.category]}`}>
                    {expense.category}
                  </span>
                </td>
                <td className={`px-4 py-2.5 text-xs font-mono font-bold text-right ${expense.amount > 0 ? 'text-slate-900' : 'text-emerald-600'}`}>
                  {expense.amount > 0 ? '-' : '+'}${Math.abs(expense.amount).toFixed(2)}
                </td>
                {!isCompact && (
                  <td className="px-4 py-2.5 text-right opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    <button
                      onClick={() => onDelete(expense.id)}
                      className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                      title="Void Transaction"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
