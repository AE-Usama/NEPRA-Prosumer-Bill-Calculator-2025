import React from 'react';
import { AppState, ConsumerType } from '../types';
import { Zap, Sun, Settings, CheckCircle2 } from 'lucide-react';

interface InputCardProps {
  state: AppState;
  onChange: (updates: Partial<AppState>) => void;
}

export const InputCard: React.FC<InputCardProps> = ({ state, onChange }) => {
  
  const categories = [
    { id: ConsumerType.RESIDENTIAL_PROTECTED, label: 'Protected', sub: '≤ 200 Units' },
    { id: ConsumerType.RESIDENTIAL_SLAB, label: 'Un-Protected', sub: 'Up to 5kW' },
    { id: ConsumerType.RESIDENTIAL_TOU, label: 'Time of Use', sub: '5kW & Above' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-8">
      
      {/* Category Tabs */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
            <Settings className="w-5 h-5 text-slate-500" />
            <h2 className="text-lg font-semibold text-slate-800">Consumer Category</h2>
        </div>
        <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-xl">
            {categories.map((cat) => (
            <button
                key={cat.id}
                onClick={() => onChange({ consumerType: cat.id })}
                className={`relative flex flex-col items-center justify-center py-3 px-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                state.consumerType === cat.id
                    ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
            >
                <span>{cat.label}</span>
                <span className="text-[10px] opacity-70 font-normal">{cat.sub}</span>
                {state.consumerType === cat.id && (
                    <div className="absolute top-1 right-1">
                        <CheckCircle2 className="w-3 h-3 text-blue-500" />
                    </div>
                )}
            </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Buyback Rate (NAEPP)
          </label>
          <div className="relative">
            <input
                type="number"
                value={state.naepp}
                onChange={(e) => onChange({ naepp: parseFloat(e.target.value) || 0 })}
                className="w-full p-3 pl-4 pr-12 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none font-medium text-slate-800"
            />
            <span className="absolute right-4 top-3 text-xs text-slate-400 font-medium">PKR/kWh</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5 ml-1">Reg. 14(b) - Average Purchase Price</p>
        </div>
      </div>

      <div className="h-px bg-slate-100" />

      {/* Import Inputs */}
      <div className="space-y-5">
        <div className="flex items-center space-x-2 text-slate-800">
          <div className="p-1.5 bg-orange-100 rounded-md">
            <Zap className="w-4 h-4 text-orange-600" />
          </div>
          <h3 className="font-semibold text-sm uppercase tracking-wide">Grid Consumption</h3>
        </div>

        {(state.consumerType === ConsumerType.RESIDENTIAL_SLAB || state.consumerType === ConsumerType.RESIDENTIAL_PROTECTED) ? (
          <div>
            <div className="flex justify-between items-end mb-2">
                <label className="text-sm font-medium text-slate-600">Total Units</label>
                <div className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">{state.importUnits} kWh</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative flex-grow h-6 flex items-center">
                <input
                    type="range"
                    min="0"
                    max={state.consumerType === ConsumerType.RESIDENTIAL_PROTECTED ? "300" : "1000"}
                    value={state.importUnits}
                    onChange={(e) => onChange({ importUnits: parseInt(e.target.value) })}
                    className="absolute w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:accent-orange-600 focus:accent-orange-600 z-10"
                />
                <div 
                    className="absolute h-2 bg-orange-400 rounded-l-lg pointer-events-none" 
                    style={{ width: `${(state.importUnits / (state.consumerType === ConsumerType.RESIDENTIAL_PROTECTED ? 300 : 1000)) * 100}%` }}
                ></div>
              </div>
              <input
                type="number"
                value={state.importUnits}
                onChange={(e) => onChange({ importUnits: parseInt(e.target.value) || 0 })}
                className="w-20 p-2 border border-slate-200 bg-slate-50 rounded-lg text-right font-medium text-slate-700 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>
            {state.consumerType === ConsumerType.RESIDENTIAL_PROTECTED && state.importUnits > 200 && (
                <p className="text-xs text-red-500 mt-2">
                    Warning: Typically >200 units converts to Unprotected tariff.
                </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
             {/* Peak Slider */}
             <div>
                <div className="flex justify-between items-end mb-2">
                    <label className="text-sm font-medium text-slate-600">Peak Units</label>
                    <div className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">{state.importPeakUnits} kWh</div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative flex-grow h-6 flex items-center">
                        <input
                            type="range"
                            min="0"
                            max="1000"
                            value={state.importPeakUnits}
                            onChange={(e) => onChange({ importPeakUnits: parseInt(e.target.value) })}
                            className="absolute w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600 z-10"
                        />
                         <div 
                            className="absolute h-2 bg-orange-600 rounded-l-lg pointer-events-none" 
                            style={{ width: `${(state.importPeakUnits / 1000) * 100}%` }}
                        ></div>
                    </div>
                    <input
                        type="number"
                        value={state.importPeakUnits}
                        onChange={(e) => onChange({ importPeakUnits: parseInt(e.target.value) || 0 })}
                        className="w-20 p-2 border border-slate-200 bg-slate-50 rounded-lg text-right font-medium text-slate-700 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    />
                </div>
            </div>

            {/* Off Peak Slider */}
            <div>
                <div className="flex justify-between items-end mb-2">
                    <label className="text-sm font-medium text-slate-600">Off-Peak Units</label>
                    <div className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">{state.importOffPeakUnits} kWh</div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="relative flex-grow h-6 flex items-center">
                        <input
                            type="range"
                            min="0"
                            max="1000"
                            value={state.importOffPeakUnits}
                            onChange={(e) => onChange({ importOffPeakUnits: parseInt(e.target.value) })}
                            className="absolute w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-400 z-10"
                        />
                        <div 
                            className="absolute h-2 bg-orange-300 rounded-l-lg pointer-events-none" 
                            style={{ width: `${(state.importOffPeakUnits / 1000) * 100}%` }}
                        ></div>
                    </div>
                    <input
                        type="number"
                        value={state.importOffPeakUnits}
                        onChange={(e) => onChange({ importOffPeakUnits: parseInt(e.target.value) || 0 })}
                        className="w-20 p-2 border border-slate-200 bg-slate-50 rounded-lg text-right font-medium text-slate-700 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    />
                </div>
            </div>
          </div>
        )}
      </div>

      <div className="h-px bg-slate-100" />

      {/* Export Inputs */}
      <div className="space-y-5">
        <div className="flex items-center space-x-2 text-slate-800">
           <div className="p-1.5 bg-green-100 rounded-md">
                <Sun className="w-4 h-4 text-green-600" />
            </div>
          <h3 className="font-semibold text-sm uppercase tracking-wide">Solar Export</h3>
        </div>
        <div>
            <div className="flex justify-between items-end mb-2">
                <label className="text-sm font-medium text-slate-600">Total Units Exported</label>
                <div className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">{state.exportUnits} kWh</div>
            </div>
            <div className="flex items-center space-x-4">
                <div className="relative flex-grow h-6 flex items-center">
                    <input
                    type="range"
                    min="0"
                    max="2000"
                    value={state.exportUnits}
                    onChange={(e) => onChange({ exportUnits: parseInt(e.target.value) })}
                    className="absolute w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-500 hover:accent-green-600 focus:accent-green-600 z-10"
                    />
                    <div 
                        className="absolute h-2 bg-green-500 rounded-l-lg pointer-events-none" 
                        style={{ width: `${(state.exportUnits / 2000) * 100}%` }}
                    ></div>
                </div>
                <input
                    type="number"
                    value={state.exportUnits}
                    onChange={(e) => onChange({ exportUnits: parseInt(e.target.value) || 0 })}
                    className="w-20 p-2 border border-slate-200 bg-slate-50 rounded-lg text-right font-medium text-slate-700 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
            </div>
        </div>
      </div>
    </div>
  );
};