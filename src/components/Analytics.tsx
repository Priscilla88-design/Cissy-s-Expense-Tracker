import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, AreaChart, Area, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { Expense, CATEGORY_COLORS } from '../types';
import { useMemo, useState } from 'react';
import { BarChart3, PieChart as PieIcon, TrendingUp } from 'lucide-react';

interface AnalyticsProps {
  expenses: Expense[];
}

export default function Analytics({ expenses }: AnalyticsProps) {
  const totalAmount = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);
  
  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    expenses.forEach((e) => {
      data[e.category] = (data[e.category] || 0) + e.amount;
    });
    return Object.entries(data)
      .map(([name, value]) => ({ 
        name, 
        value, 
        percentage: ((value / totalAmount) * 100).toFixed(2),
        color: CATEGORY_COLORS[name as keyof typeof CATEGORY_COLORS || 'Other']
      }))
      .sort((a, b) => b.value - a.value);
  }, [expenses, totalAmount]);

  if (expenses.length === 0) return (
    <div className="h-[300px] flex items-center justify-center bg-[#F8F9FA] rounded-xl italic font-serif text-slate-400 text-sm">
      Insufficient data for analytical projection.
    </div>
  );

  return (
    <div id="analytics-suite" className="flex flex-col lg:flex-row items-center gap-12">
      {/* Chart Section */}
      <div className="w-full lg:w-1/2 h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
            >
              {categoryData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`GH₵${value.toLocaleString()}`, 'Spent']}
              contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#fff', color: '#000', fontSize: '10px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Section */}
      <div className="w-full lg:w-1/2 grid grid-cols-1 gap-4">
        {categoryData.map((item) => (
          <div key={item.name} className="flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
              <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{item.name}</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm font-mono font-bold text-slate-800">GH₵{item.value.toLocaleString()}</span>
              <span className="text-xs font-bold text-slate-400 w-14 text-right">{item.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
