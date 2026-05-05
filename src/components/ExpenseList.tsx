import { Trash2, Calendar, Tag } from 'lucide-react';
import { Expense, CATEGORY_COLORS } from '../types';
import { format } from 'date-fns';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  isCompact?: boolean;
}

export default function ExpenseList({ expenses, onDelete, isCompact }: ExpenseListProps) {
  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 italic font-serif text-slate-400">
        No record entries found for this ledger.
      </div>
    );
  }

  const categoryColorsMap: Record<string, string> = {
    Food: 'bg-orange-100 text-orange-700',
    Transport: 'bg-emerald-100 text-emerald-700',
    Shopping: 'bg-blue-100 text-blue-700',
    Entertainment: 'bg-purple-100 text-purple-700',
    Health: 'bg-cyan-100 text-cyan-700',
    Utilities: 'bg-amber-100 text-amber-700',
    Other: 'bg-slate-100 text-slate-600',
  };

  return (
    <div id="expense-list-container" className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            <th className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase italic font-serif">Date</th>
            <th className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase italic font-serif">Merchant/Description</th>
            <th className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase italic font-serif">Category</th>
            <th className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase italic font-serif text-right">Amount</th>
            {!isCompact && <th className="w-10"></th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {sortedExpenses.map((expense) => (
            <tr key={expense.id} className="hover:bg-slate-50 transition-colors group">
              <td className="px-4 py-2.5 text-xs text-slate-500 font-mono">
                {format(new Date(expense.date), 'MMM dd')}
              </td>
              <td className="px-4 py-2.5 text-xs font-semibold text-slate-800">
                {expense.description}
              </td>
              <td className="px-4 py-2.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-tighter ${categoryColorsMap[expense.category]}`}>
                  {expense.category}
                </span>
              </td>
              <td className="px-4 py-2.5 text-xs font-mono font-bold text-right text-slate-900">
                -${expense.amount.toFixed(2)}
              </td>
              {!isCompact && (
                <td className="px-4 py-2.5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onDelete(expense.id)}
                    className="p-1 text-slate-300 hover:text-red-500 transition-colors"
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
  );
}
