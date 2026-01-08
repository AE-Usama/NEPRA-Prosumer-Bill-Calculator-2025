import { TariffSlab } from './types';

// Based on S.R.O No. 1158 (I)/2025 - A-1 General Supply Tariff - Residential

// Protected Slab Rates (Up to 5kW, consumption typically <= 200 units)
export const PROTECTED_SLABS: TariffSlab[] = [
  { min: 1, max: 100, rate: 10.54, fixedCharge: 0 },
  { min: 101, max: 200, rate: 13.01, fixedCharge: 0 },
  // If >200, usually converts to Unprotected, but for calculator "What If" scenarios we define a fallback:
  { min: 201, max: Infinity, rate: 22.44, fixedCharge: 0 } 
];

// Unprotected Slab Rates
export const RESIDENTIAL_SLABS: TariffSlab[] = [
  { min: 1, max: 100, rate: 22.44, fixedCharge: 0 },
  { min: 101, max: 200, rate: 28.91, fixedCharge: 0 },
  { min: 201, max: 300, rate: 33.10, fixedCharge: 0 },
  { min: 301, max: 400, rate: 37.99, fixedCharge: 200 },
  { min: 401, max: 500, rate: 40.20, fixedCharge: 400 },
  { min: 501, max: 600, rate: 41.62, fixedCharge: 600 },
  { min: 601, max: 700, rate: 42.76, fixedCharge: 800 },
  { min: 701, max: Infinity, rate: 47.69, fixedCharge: 1000 },
];

// Time of Use (5kW & above)
export const TOU_RATES = {
  peak: 46.85,
  offPeak: 40.53,
  fixedMonthly: 1000,
};

// Default assumption for National Average Energy Purchase Price (Regulation 14b)
export const DEFAULT_NAEPP = 27.00; 
