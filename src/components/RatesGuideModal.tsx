import React from 'react';
import { X, BookOpen, Clock, ShieldCheck, Zap, AlertTriangle, HelpCircle } from 'lucide-react';

interface RatesGuideModalProps {
  onClose: () => void;
}

export const RatesGuideModal: React.FC<RatesGuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Singapore Carpark Rules &amp; Rates Guide
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official HDB, URA, and Shopping Mall parking guidelines across Singapore.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* HDB Rates Comparison */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>HDB Electronic Parking System (EPS) Tariffs</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <div className="font-semibold text-slate-900 dark:text-white text-xs mb-1">
                  Outside Central Area (Most HDBs)
                </div>
                <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mb-1">
                  $0.60 <span className="text-xs font-normal text-slate-500">per 30 minutes</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Applies to heartland estates like Tampines, Jurong, Ang Mo Kio, Bedok, Woodlands, Punggol, etc.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <div className="font-semibold text-slate-900 dark:text-white text-xs mb-1">
                  Central Area (CBD, Orchard fringe)
                </div>
                <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mb-1">
                  $1.20 <span className="text-xs font-normal text-slate-500">per 30 minutes (7am-5pm)</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Applies to designated Central Area carparks like Pinnacle@Duxton, Waterloo Centre, Angullia Park, Bras Basah.
                </p>
              </div>
            </div>
          </div>

          {/* Key Singapore Schemes */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Special Parking Schemes</span>
            </h3>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
              <div className="font-semibold text-slate-900 dark:text-white">
                1. 15-Minute Grace Period
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                All HDB and URA Electronic Parking System (EPS) carparks provide a 15-minute grace period (or 20 mins for selected delivery loading). If you exit within this window (e.g., picking up food, drop-off), no parking fee is levied. Exceeding 15 minutes incurs charges calculated from time of entry.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
              <div className="font-semibold text-slate-900 dark:text-white">
                2. Night Parking Scheme (Capped at $5.00)
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                Between 10:30pm and 7:00am the following morning, parking charges at HDB carparks are charged at $0.60 per 30 minutes, strictly capped at a maximum of $5.00 for the entire night.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
              <div className="font-semibold text-slate-900 dark:text-white">
                3. Sunday &amp; Public Holiday Free Parking (FPS)
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                Designated HDB and URA carparks offer Free Parking on Sundays and Public Holidays between 7:00am and 10:30pm to encourage family visits. Look for the orange &quot;Free Parking on Sun &amp; PH&quot; signage at the gantry.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
              <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>4. White Lots vs. Red / Bi-Colour Lots (Season Parking)</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                <strong>White lots</strong> are available for all short-term parking around the clock. <strong>Red lots</strong> are strictly reserved for Season Parking Ticket (SPT) holders all day. <strong>Bi-colour (red and white) lots</strong> are reserved for Season Parking holders from 7:00pm to 7:00am on weekdays and Saturdays.
              </p>
            </div>
          </div>

          {/* EV Charging in Singapore */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-emerald-50/40 dark:bg-emerald-950/20">
            <h4 className="font-semibold text-emerald-900 dark:text-emerald-300 text-xs mb-1 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Singapore Electric Vehicle (EV) Charging Networks</span>
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              SG ParkPulse tracks EV charging points deployed under LTA&apos;s island-wide rollout, including SP Mobility, CDG ENGIE, and Charge+. Note that parking fees apply concurrently with charging fees at EPS gantries unless specified by private mall operators.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
