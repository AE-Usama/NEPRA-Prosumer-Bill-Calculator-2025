import React, { useState, useEffect } from 'react';
import { AppState, ConsumerType } from '../types';
import { ChevronRight, ChevronLeft, X, Mic } from 'lucide-react';

interface PresenterOverlayProps {
  onClose: () => void;
  updateState: (updates: Partial<AppState>) => void;
  currentState: AppState;
}

const SCRIPT_STEPS = [
  {
    title: "Introduction",
    text: "Welcome to the NEPRA Prosumer Board. This dashboard visualizes the shift from 'Net Metering' to 'Net Billing' under the 2025 Regulations. The key concept: Imports and Exports are now priced separately.",
    state: {
      consumerType: ConsumerType.RESIDENTIAL_SLAB,
      importUnits: 0,
      exportUnits: 0,
      naepp: 27
    }
  },
  {
    title: "Consumer Categories",
    text: "First, we select the consumer category. The 2025 policy distinguishes clearly between 'Protected' (users with ≤ 200 units) and 'Un-Protected' consumers.",
    state: {
      consumerType: ConsumerType.RESIDENTIAL_PROTECTED,
      importUnits: 150,
      exportUnits: 0,
    }
  },
  {
    title: "Protected Limits",
    text: "Watch what happens if a Protected consumer uses too much power. If you exceed 200 units, you risk moving to the Unprotected tariff. The dashboard warns you instantly.",
    state: {
      consumerType: ConsumerType.RESIDENTIAL_PROTECTED,
      importUnits: 250,
      exportUnits: 0,
    }
  },
  {
    title: "Net Billing Scenario",
    text: "Now, let's simulate a typical Unprotected household. Suppose you import 450 units from the Grid, but your solar system exports 350 units back.",
    state: {
      consumerType: ConsumerType.RESIDENTIAL_SLAB,
      importUnits: 450,
      exportUnits: 350,
    }
  },
  {
    title: "The Buyback Rate (NAEPP)",
    text: "Under Regulation 14(b), your exported units are sold at the 'National Average Energy Purchase Price' (NAEPP). We've set this to 27 PKR. This is your 'Solar Credit'.",
    state: {
      consumerType: ConsumerType.RESIDENTIAL_SLAB,
      importUnits: 450,
      exportUnits: 350,
      naepp: 27
    }
  },
  {
    title: "The Result",
    text: "The calculations show the impact: You pay for 450 units at the high Tariff Rate (Orange), and get credit for 350 units at the lower NAEPP Rate (Green).",
    state: {
        // No state change, just focus
    }
  },
  {
    title: "Financial Impact",
    text: "Finally, check the graphs. The 'Financial Impact' chart proves that despite the policy change, having solar is still significantly cheaper than having no solar at all.",
    state: {
       // No state change
    }
  }
];

export const PresenterOverlay: React.FC<PresenterOverlayProps> = ({ onClose, updateState, currentState }) => {
  const [stepIndex, setStepIndex] = useState(0);

  const currentStep = SCRIPT_STEPS[stepIndex];
  const isLast = stepIndex === SCRIPT_STEPS.length - 1;
  const isFirst = stepIndex === 0;

  // Auto-update state when step changes
  useEffect(() => {
    if (currentStep.state) {
      updateState(currentStep.state);
    }
  }, [stepIndex]);

  const handleNext = () => {
    if (!isLast) setStepIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (!isFirst) setStepIndex(prev => prev - 1);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 p-6 z-50 shadow-2xl text-white transform transition-transform duration-300">
      <div className="max-w-4xl mx-auto flex items-start gap-6">
        
        {/* Step Indicator */}
        <div className="flex-shrink-0 pt-1">
            <div className="bg-blue-600 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                {stepIndex + 1}
            </div>
        </div>

        {/* Content */}
        <div className="flex-grow">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-blue-400 font-semibold uppercase tracking-wider text-sm">{currentStep.title}</h3>
                <div className="flex items-center space-x-2">
                    <span className="text-slate-500 text-xs">{stepIndex + 1} / {SCRIPT_STEPS.length}</span>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <p className="text-xl md:text-2xl font-light leading-relaxed text-slate-100">
                "{currentStep.text}"
            </p>
        </div>

        {/* Controls */}
        <div className="flex-shrink-0 flex flex-col space-y-2 pt-1">
            <button 
                onClick={handleNext}
                disabled={isLast}
                className={`flex items-center justify-center w-32 py-3 rounded-lg font-medium transition-colors ${isLast ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
            >
                Next <ChevronRight className="w-4 h-4 ml-1" />
            </button>
            <button 
                onClick={handlePrev}
                disabled={isFirst}
                className={`flex items-center justify-center w-32 py-2 rounded-lg text-sm font-medium transition-colors ${isFirst ? 'text-slate-700 cursor-not-allowed' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </button>
        </div>
      </div>
      <div className="max-w-4xl mx-auto mt-4 pt-4 border-t border-slate-800 flex items-center text-slate-500 text-xs">
         <Mic className="w-3 h-3 mr-2" />
         <span>Presenter Mode: Clicking 'Next' automatically updates the board values to match the script.</span>
      </div>
    </div>
  );
};