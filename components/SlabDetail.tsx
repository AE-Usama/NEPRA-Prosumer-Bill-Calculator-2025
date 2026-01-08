import React from 'react';
import { CalculationResult } from '../types';

export const SlabDetail: React.FC<{ result: CalculationResult }> = ({ result }) => {
  if (!result.slabBreakdown || result.slabBreakdown.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
        <h3 className="text-sm font-semibold text-slate-700">Import Bill Calculation Details</h3>
      </div>
      <div className="p-0">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
            <tr>
              <th className="px-6 py-3 font-medium">Slab / Category</th>
              <th className="px-6 py-3 font-medium text-right">Units</th>
              <th className="px-6 py-3 font-medium text-right">Cost (PKR)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {result.slabBreakdown.map((item, index) => (
              <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-3 font-medium text-slate-700">{item.slab}</td>
                <td className="px-6 py-3 text-right text-slate-600">{item.units}</td>
                <td className="px-6 py-3 text-right text-slate-900 font-medium">
                  {new Intl.NumberFormat('en-PK').format(Math.round(item.cost))}
                </td>
              </tr>
            ))}
            {result.fixedCharges > 0 && (
               <tr className="bg-orange-50/30">
               <td className="px-6 py-3 font-medium text-slate-700">Fixed Charges</td>
               <td className="px-6 py-3 text-right text-slate-600">-</td>
               <td className="px-6 py-3 text-right text-slate-900 font-medium">
                 {new Intl.NumberFormat('en-PK').format(result.fixedCharges)}
               </td>
             </tr>
            )}
            <tr className="bg-slate-50 font-bold">
              <td className="px-6 py-4 text-slate-900">Total Import Cost</td>
              <td className="px-6 py-4 text-right">{result.totalImportUnits}</td>
              <td className="px-6 py-4 text-right text-orange-600">
                {new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(result.importCost)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};