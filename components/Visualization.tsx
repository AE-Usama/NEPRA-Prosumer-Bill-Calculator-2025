import React from 'react';
import { CalculationResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

export const Visualization: React.FC<{ result: CalculationResult }> = ({ result }) => {
  
  // Data for Balance Chart
  const balanceData = [
    { name: 'Import Cost', amount: result.importCost, color: '#f97316' }, // Orange
    { name: 'Export Credit', amount: result.exportCredit, color: '#22c55e' }, // Green
  ];

  // Logic to show Comparison (Old Net Metering vs New Net Billing)
  // Assumption: Old Net Metering was roughly 1:1 offset on units before cost
  // This is a simplified estimation for visual impact
  const netMeteringEst = Math.max(0, result.importCost - (result.totalExportUnits * result.effectiveRate)); 
  
  const comparisonData = [
    { name: 'Net Billing (2025)', value: Math.max(0, result.netPayable) },
    { name: 'Est. Bill w/o Solar', value: result.importCost },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">Regulation 14 Balance</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={balanceData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                formatter={(value: number) => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(value)}
              />
              <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={40}>
                {balanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center">
            Comparing the bill for what you take from the grid vs. the value of what you send back.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wide">Financial Impact</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} barSize={50}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{fontSize: 12}} />
              <YAxis />
              <Tooltip 
                cursor={{fill: '#f1f5f9'}}
                formatter={(value: number) => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(value)}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center">
            Comparison: What you pay now vs. what you would pay without any solar system.
        </p>
      </div>
    </div>
  );
};