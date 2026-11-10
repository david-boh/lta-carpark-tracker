import React, { useState } from 'react';
import { SingaporeCarpark } from '../types/carpark';
import { estimateParkingFee } from '../services/carparkService';
import { Clock, Calculator, CheckCircle2, AlertCircle } from 'lucide-react';

interface FeeCalculatorProps {
  carpark: SingaporeCarpark;
}

export const FeeCalculator: React.FC<FeeCalculatorProps> = ({ carpark }) => {
  const [durationMins, setDurationMins] = useState<number>(90); // default 1.5 hours
  const [isSundayOrPH, setIsSundayOrPH] = useState<boolean>(false);

  const estimation = estimateParkingFee(carpark, durationMins, isSundayOrPH);

  const presets = [
    { label: '15m (Grace)', mins: 15 },
    { label: '1 Hour', mins: 60 },
    { label: '2 Hours', mins: 120 },
    { label: '3 Hours', mins: 180 },
    { label: '4 Hours', mins: 240 }
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700/80">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
            Parking Fee Estimator
          </h4>
        </div>
        <span className="text-xs font-mono text-slate-500">
          Grace: {carpark.rates.grace_period_mins} mins
        </span>
      </div>

      {/* Preset Duration Buttons */}
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        {presets.map((p) => (
          <button
            key={p.mins}
            type="button"
            onClick={() => setDurationMins(p.mins)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md border transition-all cursor-pointer ${
              durationMins === p.mins
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Custom Duration Slider */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1.5">
          <span>Parking Duration:</span>
          <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-white">
            {Math.floor(durationMins / 60)}h {durationMins % 60}m ({durationMins} mins)
          </span>
        </div>
        <input
          type="range"
          min={5}
          max={480}
          step={5}
          value={durationMins}
          onChange={(e) => setDurationMins(Number(e.target.value))}
          className="w-full accent-emerald-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
          <span>5m</span>
          <span>2h</span>
          <span>4h</span>
          <span>6h</span>
          <span>8h</span>
        </div>
      </div>

      {/* Sunday / PH Option Toggle */}
      <div className="flex items-center gap-2 mb-4 pt-2 border-t border-slate-200 dark:border-slate-700/60">
        <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={isSundayOrPH}
            onChange={(e) => setIsSundayOrPH(e.target.checked)}
            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span>Parking on Sunday or Public Holiday</span>
        </label>
      </div>

      {/* Calculated Result Box */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-3 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Estimated Parking Cost
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            {estimation.breakdown}
          </div>
        </div>

        <div className="text-right">
          <div className="text-xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
            ${estimation.totalFee.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-400">SGD</span>
        </div>
      </div>

      {estimation.isGracePeriod && (
        <div className="mt-2 text-[11px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Exit within {carpark.rates.grace_period_mins} mins to enjoy free parking.</span>
        </div>
      )}
    </div>
  );
};
