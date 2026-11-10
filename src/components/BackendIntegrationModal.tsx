import React, { useState } from 'react';
import { BackendConfig } from '../types/carpark';
import {
  X,
  Database,
  CheckCircle2,
  Copy,
  Check,
  Code2,
  Server,
  Zap,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface BackendIntegrationModalProps {
  config: BackendConfig;
  onUpdateConfig: (newConfig: BackendConfig) => void;
  onClose: () => void;
}

export const BackendIntegrationModal: React.FC<BackendIntegrationModalProps> = ({
  config,
  onUpdateConfig,
  onClose
}) => {
  const [endpoint, setEndpoint] = useState(config.apiEndpoint);
  const [apiKey, setApiKey] = useState(config.apiKey || '');
  const [mode, setMode] = useState<BackendConfig['mode']>(config.mode);
  const [interval, setInterval] = useState<number>(config.pollingIntervalSeconds);
  const [isAutoPolling, setIsAutoPolling] = useState<boolean>(config.isAutoPolling);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedContract, setCopiedContract] = useState(false);

  const sampleJsonContract = `{
  "timestamp": "${new Date().toISOString()}",
  "carparks": [
    {
      "carpark_number": "ACB",
      "name": "Angullia Park Off-Street Carpark",
      "agency": "HDB",
      "district": "Orchard / Somerset",
      "coordinates": { "lat": 1.3048, "lng": 103.8306 },
      "lots": {
        "car": { "total": 98, "available": 14 },
        "motorcycle": { "total": 20, "available": 8 }
      },
      "ev_charging": {
        "hasEV": true,
        "operator": "SP Mobility",
        "count": 4
      },
      "rates": {
        "central_area": true,
        "day_rate_half_hour": 1.20,
        "grace_period_mins": 15
      }
    }
  ]
}`;

  const handleTestConnection = () => {
    setIsTesting(true);
    setTestResult(null);

    setTimeout(() => {
      setIsTesting(false);
      if (mode === 'SIMULATED') {
        setTestResult({
          success: true,
          message: 'Simulated Engine is healthy. Emulating real-time Singapore lots fluctuations.'
        });
      } else if (endpoint.startsWith('http://') || endpoint.startsWith('https://') || endpoint.startsWith('/api')) {
        setTestResult({
          success: true,
          message: `Ready for backend link. Client configured to target ${endpoint}.`
        });
      } else {
        setTestResult({
          success: false,
          message: 'Please provide a valid URL starting with http://, https://, or /api'
        });
      }
    }, 600);
  };

  const handleSave = () => {
    onUpdateConfig({
      ...config,
      mode,
      apiEndpoint: endpoint,
      apiKey,
      pollingIntervalSeconds: interval,
      isAutoPolling
    });
    onClose();
  };

  const handleCopyContract = () => {
    navigator.clipboard.writeText(sampleJsonContract);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Backend Connection Setup
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure your API endpoint or inspect the schema contract when you are ready to link the backend.
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
          {/* Active Mode Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-900 dark:text-white mb-2">
              Data Source Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode('SIMULATED')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  mode === 'SIMULATED'
                    ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-emerald-500/30'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-900 dark:text-white text-xs">
                    Simulated Real-Time Engine
                  </span>
                  {mode === 'SIMULATED' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  Active now. 30+ real Singapore carparks (HDB/URA/Malls) with realistic lot turnover simulations.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMode('CUSTOM_API')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  mode === 'CUSTOM_API'
                    ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-emerald-500/30'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-900 dark:text-white text-xs">
                    Custom Backend REST API
                  </span>
                  {mode === 'CUSTOM_API' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  Connect to your Node.js, Python, or Go server endpoint (e.g. <code>http://localhost:8000/api/carparks</code>).
                </p>
              </button>
            </div>
          </div>

          {/* Endpoint Configuration (if Custom API selected) */}
          {mode === 'CUSTOM_API' && (
            <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  API Base URL
                </label>
                <input
                  type="text"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  placeholder="http://localhost:8000/api/carparks or /api/carparks"
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Optional API Key / Authorization Header
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Bearer token or DataMall account key"
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="px-3 py-1.5 font-medium text-white bg-slate-900 dark:bg-slate-700 rounded-md hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
                </button>

                {testResult && (
                  <span
                    className={`font-medium ${
                      testResult.success
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {testResult.message}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Polling Cadence */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">
                Live Auto-Sync
              </div>
              <div className="text-[11px] text-slate-500">
                Polls for updated parking availability every {interval} seconds.
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={interval}
                onChange={(e) => setInterval(Number(e.target.value))}
                className="py-1 px-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-white font-mono"
              >
                <option value={15}>Every 15s</option>
                <option value={30}>Every 30s</option>
                <option value={60}>Every 60s</option>
                <option value={120}>Every 2 mins</option>
              </select>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAutoPolling}
                  onChange={(e) => setIsAutoPolling(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>

          {/* Expected REST Payload Contract */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
                <Code2 className="w-4 h-4 text-emerald-600" />
                <span>Expected API JSON Contract</span>
              </div>
              <button
                type="button"
                onClick={handleCopyContract}
                className="text-slate-500 hover:text-emerald-600 flex items-center gap-1 font-medium transition-colors cursor-pointer"
              >
                {copiedContract ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedContract ? 'Copied' : 'Copy Schema'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
              {sampleJsonContract}
            </pre>
          </div>

          {/* Official Singapore Government Feeds Info */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start gap-3">
            <Server className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
              <div className="font-semibold text-slate-700 dark:text-slate-200">
                GovTech &amp; LTA DataMall References:
              </div>
              <div>
                When building your backend, you can proxy GovTech&apos;s free endpoint:
                <code className="text-emerald-600 dark:text-emerald-400 block font-mono mt-0.5">
                  https://api.data.gov.sg/v1/transport/carpark-availability
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
};
