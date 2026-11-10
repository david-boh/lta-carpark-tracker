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
  ExternalLink,
  Activity,
  AlertCircle
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
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; details?: any } | null>(null);
  const [copiedContract, setCopiedContract] = useState(false);

  const sampleJsonContract = `{
  "timestamp": "${new Date().toISOString()}",
  "source": "LTA DataMall CarParkAvailabilityv2",
  "endpoint": "https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2",
  "carparks": [
    {
      "CarParkID": "1",
      "Area": "Marina",
      "Development": "Suntec City",
      "Location": "1.29375 103.85718",
      "AvailableLots": 820,
      "LotType": "C",
      "Agency": "LTA"
    }
  ]
}`;

  const handleTestEndpoint = async (target: 'health' | 'carparkavailability' | 'custom') => {
    setIsTesting(true);
    setTestResult(null);

    try {
      if (target === 'health') {
        const res = await fetch('/api/health');
        const data = await res.json();
        setIsTesting(false);
        setTestResult({
          success: res.ok,
          message: `/api/health responded (HTTP ${res.status})`,
          details: data
        });
      } else if (target === 'carparkavailability') {
        const headers: Record<string, string> = {};
        if (apiKey.trim()) {
          headers['AccountKey'] = apiKey.trim();
        }
        const res = await fetch('/api/carparkavailability', { headers });
        const data = await res.json();
        setIsTesting(false);
        if (data.status === 'CONFIG_REQUIRED') {
          setTestResult({
            success: true,
            message: 'Serverless endpoint /api/carparkavailability is live! AccountKey not yet set in environment (ready for key input).',
            details: data
          });
        } else if (data.status === 'OK') {
          setTestResult({
            success: true,
            message: `Successfully connected to LTA DataMall! Retrieved ${data.count} live carpark availability records.`,
            details: { count: data.count, source: data.source, sample: data.value?.slice(0, 2) }
          });
        } else {
          setTestResult({
            success: false,
            message: data.message || `LTA DataMall responded with status: ${data.status}`,
            details: data
          });
        }
      } else {
        // Custom URL test
        setIsTesting(false);
        setTestResult({
          success: true,
          message: `Custom endpoint ${endpoint} set.`
        });
      }
    } catch (err: unknown) {
      setIsTesting(false);
      setTestResult({
        success: false,
        message: err instanceof Error ? err.message : String(err)
      });
    }
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
                Serverless &amp; LTA DataMall Connection
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct integration with LTA DataMall CarParkAvailabilityv2 via serverless routes in <code>/api</code>.
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
              Select Data Feed Engine
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setMode('LTA_DATAMALL')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  mode === 'LTA_DATAMALL'
                    ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-emerald-500/30'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-900 dark:text-white text-xs">
                    LTA DataMall
                  </span>
                  {mode === 'LTA_DATAMALL' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  Calls <code>/api/carparkavailability</code> to query LTA&apos;s CarParkAvailabilityv2.
                </p>
              </button>

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
                    Simulated Seed
                  </span>
                  {mode === 'SIMULATED' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  Real Singapore carparks with autonomous turnover simulations.
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
                    Custom REST API
                  </span>
                  {mode === 'CUSTOM_API' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  Target your own backend proxy endpoint.
                </p>
              </button>
            </div>
          </div>

          {/* Serverless Endpoints Status Box */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="font-semibold text-slate-900 dark:text-white flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-600" />
                Serverless API Endpoints (at <code>/api</code> root)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">No hardcoded keys</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-mono font-semibold text-slate-900 dark:text-white">GET /api/health</div>
                  <div className="text-[10px] text-slate-500">Uptime &amp; LTA key status</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleTestEndpoint('health')}
                  disabled={isTesting}
                  className="px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                >
                  Test
                </button>
              </div>

              <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-mono font-semibold text-slate-900 dark:text-white">GET /api/carparkavailability</div>
                  <div className="text-[10px] text-slate-500">Pulls LTA DataMall v2</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleTestEndpoint('carparkavailability')}
                  disabled={isTesting}
                  className="px-2.5 py-1 text-[11px] font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors cursor-pointer"
                >
                  Test
                </button>
              </div>
            </div>

            {/* Test result display */}
            {testResult && (
              <div className={`p-3 rounded-lg border text-[11px] ${
                testResult.success
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200'
              }`}>
                <div className="font-semibold">{testResult.message}</div>
                {testResult.details && (
                  <pre className="mt-1.5 p-2 bg-slate-900 text-slate-200 rounded overflow-x-auto text-[10px] font-mono max-h-36">
                    {JSON.stringify(testResult.details, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>

          {/* AccountKey Configuration (optional live injection) */}
          <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                LTA DataMall AccountKey (Leave blank to use <code>LTA_DATAMALL_ACCOUNT_KEY</code> from <code>.env</code>)
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste AccountKey here or configure in .env"
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Never hardcoded in code. The serverless handler reads from <code>process.env.LTA_DATAMALL_ACCOUNT_KEY</code> or your <code>AccountKey</code> header.
              </span>
            </div>
          </div>

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
                <span>LTA DataMall CarParkAvailabilityv2 Payload Format</span>
              </div>
              <button
                type="button"
                onClick={handleCopyContract}
                className="text-slate-500 hover:text-emerald-600 flex items-center gap-1 font-medium transition-colors cursor-pointer"
              >
                {copiedContract ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedContract ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
              {sampleJsonContract}
            </pre>
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
