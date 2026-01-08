import React, { useState, useEffect } from 'react';
import { AppState, ConsumerType, CalculationResult } from './types';
import { DEFAULT_NAEPP } from './constants';
import { calculateBill } from './utils/calculations';
import { InputCard } from './components/InputCard';
import { ResultCards } from './components/ResultCards';
import { Visualization } from './components/Visualization';
import { SlabDetail } from './components/SlabDetail';
import { PolicyComparison } from './components/PolicyComparison';
import { PresenterOverlay } from './components/PresenterOverlay';
import { Calculator, FileText, Info, PlayCircle } from 'lucide-react';

const App: React.FC = () => {
  // Initial State
  const [state, setState] = useState<AppState>({
    consumerType: ConsumerType.RESIDENTIAL_SLAB,
    sanctionedLoad: 3,
    importUnits: 450,
    importPeakUnits: 200,
    importOffPeakUnits: 300,
    exportUnits: 350,
    naepp: DEFAULT_NAEPP,
  });

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isPresenterMode, setIsPresenterMode] = useState(false);

  // Update Calculation whenever state changes
  useEffect(() => {
    const res = calculateBill(state);
    setResult(res);
  }, [state]);

  const handleStateChange = (updates: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-800 ${isPresenterMode ? 'pb-64' : 'pb-12'}`}>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">NEPRA Prosumer Board</h1>
              <p className="text-xs text-slate-500">Regulations 2025 Impact Calculator</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
             <button 
                onClick={() => setIsPresenterMode(!isPresenterMode)}
                className={`text-sm font-medium flex items-center px-3 py-1.5 rounded-full transition-colors ${isPresenterMode ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
             >
                <PlayCircle className="w-4 h-4 mr-1.5" />
                {isPresenterMode ? 'Exit Presentation' : 'Start Presentation'}
             </button>
            <a href="#" className="hidden sm:flex text-sm text-blue-600 hover:text-blue-700 font-medium items-center">
                <FileText className="w-4 h-4 mr-1" />
                Read Policy
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <strong>Understanding "Net Billing":</strong> Under the 2025 Regulations, electricity you export is no longer subtracted 1-for-1 from units you consume. Instead, exported units are sold at the <em>National Average Energy Purchase Price</em>, while imported units are bought at the <em>Applicable Tariff</em>. The difference is your Net Bill.
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-4 space-y-6">
            <InputCard state={state} onChange={handleStateChange} />
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-semibold text-slate-800 mb-2">Key Assumptions</h3>
              <ul className="text-xs text-slate-500 space-y-2 list-disc pl-4">
                <li>Grid Tariff based on A-1 General Supply (July 2025 SRO).</li>
                <li>Fixed Charges applied based on consumption slabs.</li>
                <li>Taxes (FPA, GST, ED, TV Fee) are <strong>excluded</strong> to isolate tariff policy impact.</li>
                <li>NAEPP (Buyback Rate) is estimated; exact rate is determined monthly by Authority.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Dashboard */}
          <div className="lg:col-span-8">
            {result && (
              <>
                <ResultCards result={result} />
                <Visualization result={result} />
                <SlabDetail result={result} />
                <PolicyComparison result={result} state={state} />
              </>
            )}
          </div>

        </div>
      </main>

      {/* Presenter Overlay */}
      {isPresenterMode && (
        <PresenterOverlay 
            onClose={() => setIsPresenterMode(false)} 
            updateState={handleStateChange}
            currentState={state}
        />
      )}
    </div>
  );
};

export default App;