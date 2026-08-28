import React, { useState, useEffect } from 'react';
import { 
  Wind, 
  Satellite, 
  Flame, 
  Activity, 
  Bell, 
  FileText, 
  ShieldAlert, 
  RefreshCw, 
  Radio, 
  Layers, 
  Sliders, 
  TrendingUp, 
  Bot,
  Clock,
  Sparkles
} from 'lucide-react';
import { CrisisScenario } from '../types/smog';
import { CRISIS_SCENARIOS } from '../data/mockSatellites';

interface HeaderProps {
  activeTab: 'map' | 'dip' | 'analytics' | 'alerts' | 'ai';
  onTabChange: (tab: 'map' | 'dip' | 'analytics' | 'alerts' | 'ai') => void;
  selectedScenario: string;
  onScenarioChange: (scenarioId: string) => void;
  onOpenExecutiveReport: () => void;
  onOpenDispatch?: () => void;
  onSimulateAlert?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  selectedScenario,
  onScenarioChange,
  onOpenExecutiveReport,
  onOpenDispatch,
  onSimulateAlert,
}) => {
  const [pktTime, setPktTime] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Pakistan Standard Time (UTC+5)
      const pkt = new Intl.DateTimeFormat('en-PK', {
        timeZone: 'Asia/Karachi',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(now);
      setPktTime(pkt);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 700);
  };

  const navItems = [
    { id: 'map', label: 'GIS & Hotspots', fullLabel: 'GIS Map & FIRMS Hotspots', icon: Layers },
    { id: 'dip', label: 'DIP Pipeline', fullLabel: 'DIP & ML Pipeline Studio', icon: Sliders },
    { id: 'analytics', label: 'Trends & Impact', fullLabel: 'Analytics & Validation', icon: TrendingUp },
    { id: 'alerts', label: 'Alerting Hub', fullLabel: 'Multi-Stakeholder Alerts', icon: Bell },
    { id: 'ai', label: 'AI Copilot', fullLabel: 'Gemini AI Science Copilot', icon: Bot },
  ] as const;

  return (
    <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50 shadow-sm">
      {/* Top Telemetry & Scenario Bar */}
      <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] px-4 sm:px-6 lg:px-8 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Feed Status Chips */}
          <div className="flex items-center flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Sentinel-2 & FIRMS Live Ingestion
            </span>

            <span className="hidden sm:inline-flex items-center gap-1.5 text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs text-[11px] font-medium">
              <Satellite className="w-3.5 h-3.5 text-indigo-600" />
              <span>Pass: Sentinel-2B (10m)</span>
            </span>

            <span className="hidden md:inline-flex items-center gap-1.5 text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs text-[11px] font-medium">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>NASA VIIRS/MODIS Active</span>
            </span>

            <span className="hidden lg:inline-flex items-center gap-1.5 text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs text-[11px] font-medium">
              <Activity className="w-3.5 h-3.5 text-amber-600" />
              <span>PEQS 14 Ground Stations Synced</span>
            </span>
          </div>

          {/* Right: PKT Time & Scenario Selector */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-600 font-mono text-[11px] bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
              <Clock className="w-3 h-3 text-indigo-500" />
              <span className="text-slate-400 font-medium">PKT:</span>
              <span className="font-bold text-slate-800 tabular-nums">{pktTime || 'Syncing...'}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-xs">
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider hidden sm:inline">Scenario:</span>
              <select
                value={selectedScenario}
                onChange={(e) => onScenarioChange(e.target.value)}
                className="bg-transparent text-xs font-bold text-indigo-700 focus:outline-none cursor-pointer"
              >
                {CRISIS_SCENARIOS.map((sc) => (
                  <option key={sc.id} value={sc.id} className="text-slate-800 font-normal">
                    {sc.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleManualRefresh}
              title="Refresh telemetry feeds"
              className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Branding & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-600/20">
            <Wind className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                Smog Monitoring <span className="text-indigo-600 font-extrabold">System</span>
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700">
                Punjab EPA
              </span>
              <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700">
                Satellite & DIP Core
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Satellite-Fused Real-Time Smog Monitoring, DIP ML Image Processing & Multi-Stakeholder Alerts
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {onOpenDispatch && (
            <button
              onClick={onOpenDispatch}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all shadow-xs"
            >
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>EPA Squad Dispatch</span>
            </button>
          )}

          {onSimulateAlert && (
            <button
              onClick={onSimulateAlert}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-all shadow-xs"
            >
              <Radio className="w-4 h-4 text-amber-600 animate-pulse" />
              <span>Broadcast Alert</span>
            </button>
          )}

          <button
            onClick={onOpenExecutiveReport}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-600/25"
          >
            <FileText className="w-4 h-4 text-indigo-100" />
            <span>EPA Briefing PDF</span>
          </button>
        </div>
      </div>

      {/* Bento Pill Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 pt-1">
        <nav className="flex items-center gap-2 overflow-x-auto pb-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent'
                }`}
              >
                {isActive ? (
                  <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                ) : (
                  <Icon className="w-4 h-4 text-slate-400" />
                )}
                <span>{item.fullLabel}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
