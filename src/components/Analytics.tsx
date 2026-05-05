import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { Expense, CATEGORY_COLORS } from '../types';
import { useMemo } from 'react';

interface AnalyticsProps {
  expenses: Expense[];
}

export default function Analytics({ expenses }: AnalyticsProps) {
  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    expenses.forEach((e) => {
      data[e.category] = (data[e.category] || 0) + e.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const monthlyData = useMemo(() => {
    const data: Record<string, number> = {};
    expenses.forEach((e) => {
      const month = new Date(e.date).toLocaleString('default', { month: 'short' });
      data[month] = (data[month] || 0) + e.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, amount: value }));
  }, [expenses]);

  if (expenses.length === 0) return null;

  return (
    <div id="analytics" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm min-h-[300px]">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Category Split</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {categoryData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '4px', border: 'none', backgroundColor: '#0F172A', color: '#fff', fontSize: '10px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend verticalAlign="bottom" align="center" iconSize={8} wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm min-h-[300px]">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Cash Burn Rate</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#94A3B8'}} />
              <YAxis fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#94A3B8'}} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}} 
                contentStyle={{ borderRadius: '4px', border: 'none', backgroundColor: '#0F172A', color: '#fff', fontSize: '10px' }}
              />
              <Bar dataKey="amount" fill="#6366F1" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
