import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, AreaChart, Area, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { Expense, CATEGORY_COLORS } from '../types';
import { useMemo, useState } from 'react';
import { BarChart3, PieChart as PieIcon, TrendingUp } from 'lucide-react';

interface AnalyticsProps {
  expenses: Expense[];
}

export default function Analytics({ expenses }: AnalyticsProps) {
  const [view, setView] = useState<'overview' | 'trends'>('overview');

  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    expenses.forEach((e) => {
      data[e.category] = (data[e.category] || 0) + e.amount;
    });
    return Object.entries(data)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  const timeSeriesData = useMemo(() => {
    const sorted = [...expenses].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let cumulative = 0;
    return sorted.map(e => {
      cumulative += e.amount;
      return {
        date: new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
        amount: e.amount,
        total: cumulative
      };
    });
  }, [expenses]);

  const monthlyData = useMemo(() => {
    const data: Record<string, number> = {};
    expenses.forEach((e) => {
      const month = new Date(e.date).toLocaleString('default', { month: 'short' });
      data[month] = (data[month] || 0) + e.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, amount: value }));
  }, [expenses]);

  if (expenses.length === 0) return (
    <div className="h-[400px] flex items-center justify-center bg-white rounded-lg border border-slate-200 italic font-serif text-slate-400">
      Insufficient data for analytical projection.
    </div>
  );

  return (
    <div id="analytics-suite" className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 p-1 bg-slate-100 rounded-md border border-slate-200 self-start">
          <button 
            onClick={() => setView('overview')}
            className={`flex items-center gap-2 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${view === 'overview' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <PieIcon className="w-3 h-3" />
            Composition
          </button>
          <button 
            onClick={() => setView('trends')}
            className={`flex items-center gap-2 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${view === 'trends' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <TrendingUp className="w-3 h-3" />
            Burn Trends
          </button>
        </div>
        <div className="text-[10px] font-bold text-slate-400 italic">Projected via Ledger Real-time Engine</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {view === 'overview' ? (
          <>
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm min-h-[350px]">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Capital Allocation</h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '4px', border: 'none', backgroundColor: '#0F172A', color: '#fff', fontSize: '10px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend verticalAlign="bottom" align="center" iconSize={8} wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm min-h-[350px]">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Volume by Class</h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" fontSize={10} tickLine={false} axisLine={false} width={80} tick={{fill: '#94A3B8'}} />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}} 
                      contentStyle={{ borderRadius: '4px', border: 'none', backgroundColor: '#0F172A', color: '#fff', fontSize: '10px' }}
                    />
                    <Bar dataKey="value" fill="#6366F1" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm min-h-[350px] lg:col-span-2">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Cumulative Ledger Momentum</h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeSeriesData}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#94A3B8'}} minTickGap={30} />
                    <YAxis fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#94A3B8'}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '4px', border: 'none', backgroundColor: '#0F172A', color: '#fff', fontSize: '10px' }}
                    />
                    <Area type="monotone" dataKey="total" stroke="#6366F1" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
