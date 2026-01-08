import React from 'react';
import { CalculationResult } from '../types';
import { ArrowDownRight, ArrowUpRight, Wallet, AlertCircle } from 'lucide-react';

export const ResultCards: React.FC<{ result: CalculationResult }> = ({ result }) => {
  const isNegative = result.netPayable < 0;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(Math.abs(val));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Import Cost */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4 z-0"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-orange-600 mb-2">
            <ArrowDownRight className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">Grid Cost</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{formatCurrency(result.importCost)}</div>
          <div className="text-xs text-slate-500 mt-1">
            {result.totalImportUnits} units @ ~{result.effectiveRate.toFixed(2)} PKR/unit
          </div>
        </div>
      </div>

      {/* Export Credit */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-4 -mt-4 z-0"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-green-600 mb-2">
            <ArrowUpRight className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">Solar Credit</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{formatCurrency(result.exportCredit)}</div>
          <div className="text-xs text-slate-500 mt-1">
            {result.totalExportUnits} units (Net Billing)
          </div>
        </div>
      </div>

      {/* Net Payable */}
      <div className={`p-5 rounded-xl shadow-sm border relative overflow-hidden ${isNegative ? 'bg-green-600 border-green-700' : 'bg-slate-800 border-slate-900'}`}>
        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-white/80 mb-2">
            <Wallet className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              {isNegative ? 'Credit Rollover' : 'Net Payable'}
            </span>
          </div>
          <div className="text-3xl font-bold text-white">
            {formatCurrency(result.netPayable)}
            {isNegative && <span className="text-lg ml-1 font-normal opacity-70">CR</span>}
          </div>
          <div className="text-xs text-white/60 mt-1 flex items-center">
            {isNegative ? (
                <span>Credit carries forward to next month</span>
            ) : (
                <span className="flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> Does not include taxes</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};