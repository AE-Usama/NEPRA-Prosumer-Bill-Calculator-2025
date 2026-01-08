export enum ConsumerType {
  RESIDENTIAL_PROTECTED = 'RESIDENTIAL_PROTECTED', // Up to 5kW (Protected)
  RESIDENTIAL_SLAB = 'RESIDENTIAL_SLAB', // Up to 5kW (Unprotected)
  RESIDENTIAL_TOU = 'RESIDENTIAL_TOU', // Time of Use (5kW+)
}

export interface TariffSlab {
  min: number;
  max: number;
  rate: number;
  fixedCharge: number;
}

export interface CalculationResult {
  importCost: number;
  exportCredit: number;
  netPayable: number;
  fixedCharges: number;
  totalImportUnits: number;
  totalExportUnits: number;
  effectiveRate: number;
  slabBreakdown?: { slab: string; units: number; cost: number }[];
}

export interface AppState {
  consumerType: ConsumerType;
  sanctionedLoad: number; // in kW
  importUnits: number; // General units for slab
  importPeakUnits: number; // For TOU
  importOffPeakUnits: number; // For TOU
  exportUnits: number;
  naepp: number; // National Average Energy Purchase Price
}