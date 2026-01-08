import { ConsumerType, CalculationResult, AppState } from '../types';
import { RESIDENTIAL_SLABS, PROTECTED_SLABS, TOU_RATES } from '../constants';

export const calculateBill = (state: AppState): CalculationResult => {
  let importCost = 0;
  let fixedCharges = 0;
  let slabBreakdown: { slab: string; units: number; cost: number }[] = [];

  // 1. Calculate Import Cost (Regulation 14a - Applicable Tariff)
  if (state.consumerType === ConsumerType.RESIDENTIAL_TOU) {
    const peakCost = state.importPeakUnits * TOU_RATES.peak;
    const offPeakCost = state.importOffPeakUnits * TOU_RATES.offPeak;
    
    importCost = peakCost + offPeakCost;
    fixedCharges = TOU_RATES.fixedMonthly;

    slabBreakdown.push({
      slab: 'Peak Units',
      units: state.importPeakUnits,
      cost: peakCost
    });
    slabBreakdown.push({
      slab: 'Off-Peak Units',
      units: state.importOffPeakUnits,
      cost: offPeakCost
    });

  } else {
    // Determine which slabs to use
    let slabs = RESIDENTIAL_SLABS;
    let slabType = 'Unprotected';

    if (state.consumerType === ConsumerType.RESIDENTIAL_PROTECTED) {
      slabs = PROTECTED_SLABS;
      slabType = 'Protected';
    }

    // Standard Slab Calculation
    let remainingUnits = state.importUnits;
    let currentSlabIndex = 0;

    // Fixed charges logic
    const totalUnits = state.importUnits;
    const applicableFixedSlab = slabs.find(s => totalUnits >= s.min && totalUnits <= s.max);
    if (applicableFixedSlab) {
        fixedCharges = applicableFixedSlab.fixedCharge;
    }

    while (remainingUnits > 0 && currentSlabIndex < slabs.length) {
      const slab = slabs[currentSlabIndex];
      const slabRange = slab.max === Infinity ? Infinity : slab.max - slab.min + 1;
      
      const unitsInThisSlab = Math.min(remainingUnits, slabRange);
      const costForThisSlab = unitsInThisSlab * slab.rate;

      importCost += costForThisSlab;
      
      slabBreakdown.push({
        slab: `${slabType} ${slab.min}-${slab.max === Infinity ? 'Above' : slab.max}`,
        units: unitsInThisSlab,
        cost: costForThisSlab
      });

      remainingUnits -= unitsInThisSlab;
      currentSlabIndex++;
    }
    
    // Fallback if defined slabs didn't cover all units (e.g. Protected > 200 defined)
    if (remainingUnits > 0) {
        // Use the last slab rate for remaining
        const lastSlab = slabs[slabs.length - 1];
        const costExtra = remainingUnits * lastSlab.rate;
        importCost += costExtra;
        slabBreakdown.push({
            slab: `${slabType} Extra`,
            units: remainingUnits,
            cost: costExtra
        });
    }
  }

  // 2. Calculate Export Credit (Regulation 14b - NAEPP)
  const exportCredit = state.exportUnits * state.naepp;

  // 3. Net Calculation
  const totalImportCost = importCost + fixedCharges;
  const netPayable = totalImportCost - exportCredit;

  return {
    importCost: totalImportCost,
    exportCredit,
    netPayable,
    fixedCharges,
    totalImportUnits: state.consumerType === ConsumerType.RESIDENTIAL_TOU ? (state.importPeakUnits + state.importOffPeakUnits) : state.importUnits,
    totalExportUnits: state.exportUnits,
    effectiveRate: totalImportCost > 0 ? (totalImportCost / (state.consumerType === ConsumerType.RESIDENTIAL_TOU ? (state.importPeakUnits + state.importOffPeakUnits) : state.importUnits)) : 0,
    slabBreakdown
  };
};
