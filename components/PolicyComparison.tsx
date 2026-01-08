import React from 'react';
import { CalculationResult, AppState, ConsumerType } from '../types';
import { RESIDENTIAL_SLABS, PROTECTED_SLABS, TOU_RATES } from '../constants';
import { History, Zap, ArrowRight, AlertTriangle } from 'lucide-react';

interface PolicyComparisonProps {
  result: CalculationResult;
  state: AppState;
}

export const PolicyComparison: React.FC<PolicyComparisonProps> = ({ result, state }) => {
  // Helper to format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(Math.abs(val));
  };

  // 1. SCENARIO: No Solar
  // This is simply the Total Import Cost without any Export Credit
  const scenarioNoSolar = result.importCost;

  // 2. SCENARIO: Old Net Metering (Unit-for-Unit Offset)
  // Logic: Calculate Net Units first (Import - Export). If positive, bill that amount. If negative, 0 bill.
  let scenarioOldPolicy = 0;
  
  if (state.consumerType === ConsumerType.RESIDENTIAL_TOU) {
    // Simplified Old TOU: Net off peak and off peak separately (standard practice varied, but often peak wasn't offset by off-peak directly in 1:1 without adjustment, but for simplicity assume strict net)
    // Actually, strictly old policy: Peak offset Peak, Off-Peak offset Off-Peak.
    const netPeak = Math.max(0, state.importPeakUnits - (state.exportUnits * 0.3)); // Assumption: split export? Hard to model TOU old exactly without 2 export fields.
    // Let's stick to a simpler assumption for TOU Old: Total Net Units billed at Average Rate or Peak/OffPeak mix.
    // To keep it robust: Let's assume exports offset Off-Peak first.
    const remainingExport = Math.max(0, state.exportUnits - state.importOffPeakUnits);
    const netOffPeak = Math.max(0, state.importOffPeakUnits - state.exportUnits);
    const netPeakUnits = Math.max(0, state.importPeakUnits - remainingExport);
    
    scenarioOldPolicy = (netPeakUnits * TOU_RATES.peak) + (netOffPeak * TOU_RATES.offPeak) + TOU_RATES.fixedMonthly;
  } else {
    // Slab Based Old Policy
    const netUnits = state.importUnits - state.exportUnits;
    
    if (netUnits <= 0) {
      scenarioOldPolicy = 0; // In old system, negative units rolled over, bill was essentially fixed charges or 0
    } else {
      // Calculate Bill for Net Units based on Slabs
      let slabs = state.consumerType === ConsumerType.RESIDENTIAL_PROTECTED ? PROTECTED_SLABS : RESIDENTIAL_SLABS;
      let remaining = netUnits;
      let cost = 0;
      let i = 0;

      // Add Fixed charges if applicable to net units (simplified)
      const applicableSlab = slabs.find(s => netUnits >= s.min && netUnits <= s.max);
      if (applicableSlab) cost += applicableSlab.fixedCharge;

      while (remaining > 0 && i < slabs.length) {
        const slab = slabs[i];
        const range = slab.max === Infinity ? Infinity : slab.max - slab.min + 1;
        const consume = Math.min(remaining, range);
        cost += consume * slab.rate;
        remaining -= consume;
        i++;
      }
      // Fallback
      if (remaining > 0) cost += remaining * slabs[slabs.length -1].rate;
      
      scenarioOldPolicy = cost;
    }
  }

  // 3. SCENARIO: New Net Billing (Current Result)
  const scenarioNewPolicy = result.netPayable;

  const difference = scenarioNewPolicy - scenarioOldPolicy;
  const isWorseOff = difference > 0;
  const isNewPolicyCredit = scenarioNewPolicy < 0;

  return (
    <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-700 p-6 mt-8 text-white">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-indigo-500 p-2 rounded-lg">
          <History className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold">Policy Comparison: The Real Impact</h3>
          <p className="text-slate-400 text-sm">Comparing 3 scenarios for your current consumption profile.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        
        {/* Scenario 1: No Solar */}
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-700 relative opacity-70 hover:opacity-100 transition-opacity">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Scenario 1</div>
          <div className="text-lg font-semibold text-slate-200 mb-1">No Solar System</div>
          <div className="text-3xl font-bold text-red-400">{formatCurrency(scenarioNoSolar)}</div>
          <div className="text-xs text-slate-500 mt-2">
            Full Grid Import Cost
          </div>
        </div>

        {/* Arrow connecting */}
        <div className="hidden md:block absolute top-1/2 left-[32%] -translate-y-1/2 z-10 text-slate-600">
            <ArrowRight className="w-6 h-6" />
        </div>

        {/* Scenario 2: Old Policy */}
        <div className="bg-slate-800 rounded-lg p-5 border border-slate-600 relative opacity-70 hover:opacity-100 transition-opacity">
            <div className="absolute top-0 right-0 bg-green-900/50 text-green-400 text-[10px] px-2 py-1 rounded-bl-lg font-medium border-l border-b border-green-800">
                PRE-2025
            </div>
          <div className="text-green-500 text-xs font-semibold uppercase tracking-wider mb-2">Scenario 2</div>
          <div className="text-lg font-semibold text-slate-200 mb-1">Old "Net Metering"</div>
          <div className="text-3xl font-bold text-green-400">
            {scenarioOldPolicy <= 0 ? 'PKR 0' : formatCurrency(scenarioOldPolicy)}
          </div>
          <div className="text-xs text-slate-500 mt-2">
            Calculated on Net Units ({Math.max(0, state.importUnits - state.exportUnits)})
          </div>
        </div>

        {/* Arrow connecting */}
        <div className="hidden md:block absolute top-1/2 left-[65%] -translate-y-1/2 z-10 text-slate-600">
            <ArrowRight className="w-6 h-6" />
        </div>

        {/* Scenario 3: New Policy */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-lg p-5 border-2 border-indigo-500 relative shadow-2xl shadow-indigo-900/20">
             <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] px-2 py-1 rounded-bl-lg font-bold">
                CURRENT LAW
            </div>
          <div className="text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">Scenario 3</div>
          <div className="text-lg font-semibold text-white mb-1">New "Net Billing"</div>
          <div className={`text-3xl font-bold ${isNewPolicyCredit ? 'text-green-400' : 'text-white'}`}>
             {formatCurrency(scenarioNewPolicy)}
             {isNewPolicyCredit && <span className="text-sm font-normal ml-1">CR</span>}
          </div>
          <div className="text-xs text-indigo-200 mt-2">
            Buy at Tariff, Sell at NAEPP
          </div>
        </div>
      </div>

      {/* Difference Analysis */}
      {isWorseOff && (
        <div className="mt-6 bg-red-900/20 border border-red-900/50 rounded-lg p-4 flex items-start gap-3">
             <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
             <div>
                <h4 className="text-red-400 font-semibold text-sm">Policy Impact Analysis</h4>
                <p className="text-slate-300 text-sm mt-1">
                    Under the new Net Billing regime, you pay <span className="text-red-400 font-bold">{formatCurrency(difference)}</span> more per month compared to the old Net Metering rules for this specific consumption profile.
                </p>
             </div>
        </div>
      )}
      
      {!isWorseOff && difference < 0 && (
         <div className="mt-6 bg-green-900/20 border border-green-900/50 rounded-lg p-4 flex items-start gap-3">
            <Zap className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
               <h4 className="text-green-400 font-semibold text-sm">Surprising Result</h4>
               <p className="text-slate-300 text-sm mt-1">
                   In this specific scenario, the new policy might actually favor you (or be neutral) due to the fixed charges structure or specific consumption/export ratio.
               </p>
            </div>
       </div>
      )}
    </div>
  );
};