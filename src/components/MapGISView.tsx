import React, { useState, useMemo } from 'react';
import { 
  Flame, 
  Wind, 
  Layers, 
  MapPin, 
  Activity, 
  ShieldAlert, 
  Radio, 
  Thermometer, 
  Droplets, 
  Sliders, 
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { DistrictData, FireHotspot, CrisisScenario } from '../types/smog';
import { SEVERITY_CONFIG } from '../data/punjabDistricts';
import { NASA_FIRMS_HOTSPOTS } from '../data/mockSatellites';

interface MapGISViewProps {
  districts: DistrictData[];
  selectedDistrict: DistrictData;
  onSelectDistrict: (district: DistrictData) => void;
  selectedScenario: CrisisScenario;
  onNavigateToDIP: () => void;
  onNavigateToAlerts: () => void;
  onOpenDispatch: (fire?: FireHotspot) => void;
}

export const MapGISView: React.FC<MapGISViewProps> = ({
  districts,
  selectedDistrict,
  onSelectDistrict,
  selectedScenario,
  onNavigateToDIP,
  onNavigateToAlerts,
  onOpenDispatch,
}) => {
  // Layer Toggles
  const [showSmogGrid, setShowSmogGrid] = useState<boolean>(true);
  const [showFires, setShowFires] = useState<boolean>(true);
  const [showStations, setShowStations] = useState<boolean>(true);
  const [showWindPlumes, setShowWindPlumes] = useState<boolean>(true);
  const [showHotIndex, setShowHotIndex] = useState<boolean>(false);
  const [gridOpacity, setGridOpacity] = useState<number>(75);
  const [selectedFire, setSelectedFire] = useState<FireHotspot | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('All');

  // Filtered districts
  const filteredDistricts = useMemo(() => {
    if (filterSeverity === 'All') return districts;
    return districts.filter((d) => d.severity === filterSeverity);
  }, [districts, filterSeverity]);

  // Aggregate stats
  const totalFires = NASA_FIRMS_HOTSPOTS.length;
  const avgAQI = Math.round(districts.reduce((acc, d) => acc + d.currentAQI, 0) / districts.length);
  const maxAQIDistrict = districts.reduce((prev, current) => (prev.currentAQI > current.currentAQI ? prev : current), districts[0]);

  // Coordinate projections for Punjab interactive map view (Normalized 0-100% SVG box)
  const projectCoords = (lat: number, lng: number) => {
    const minLat = 29.0;
    const maxLat = 34.0;
    const minLng = 70.0;
    const maxLng = 75.5;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;

    return { x: Math.max(6, Math.min(94, x)), y: Math.max(6, Math.min(94, y)) };
  };

  return (
    <div className="space-y-6">
      {/* Top Bento Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 flex items-center justify-between shadow-xs hover:border-slate-300 transition-all">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block mb-1">
              Province Average AQI
            </span>
            <div className="text-3xl font-black text-slate-900 flex items-baseline gap-1.5">
              <span className="tabular-nums">{avgAQI}</span>
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                Hazardous
              </span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">11 Key Industrial & Agri Centers</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 flex items-center justify-between shadow-xs hover:border-slate-300 transition-all">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block mb-1">
              Peak Smog Hotspot
            </span>
            <div className="text-2xl font-black text-slate-900 flex items-baseline gap-1.5">
              <span>{maxAQIDistrict.name}</span>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                {maxAQIDistrict.currentAQI} AQI
              </span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">PM2.5: {maxAQIDistrict.currentPM25} µg/m³</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 flex items-center justify-between shadow-xs hover:border-slate-300 transition-all">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block mb-1">
              NASA FIRMS Active Fires
            </span>
            <div className="text-3xl font-black text-slate-900 flex items-baseline gap-1.5">
              <span className="tabular-nums">{totalFires}</span>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Hotspots
              </span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Stubble & Brick Kiln Clusters</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Flame className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 flex items-center justify-between shadow-xs hover:border-slate-300 transition-all">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block mb-1">
              Atmospheric Inversion
            </span>
            <div className="text-xl font-bold text-slate-900 flex items-baseline gap-1">
              <span>{selectedDistrict.windSpeed} km/h</span>
              <span className="text-xs text-slate-500">{selectedDistrict.windDirection}</span>
            </div>
            <span className="text-[11px] font-semibold text-indigo-700 mt-1 block">
              Inversion: {selectedScenario.inversionStrength}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Wind className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Map & Interactive Inspector Workspace (Bento Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive GIS Map Tile (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 flex flex-col shadow-xs">
          {/* Bento Header & Map Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Live GIS Canvas
                </span>
                <span className="text-slate-300">/</span>
                <span className="text-slate-500 text-xs font-medium">Punjab Airshed Corridor</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1">Multi-Spectral Smog & Thermal Fire Map</h2>
            </div>

            {/* Quick Filter Pills */}
            <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
              {(['All', 'Hazardous', 'Severe', 'Unhealthy'] as const).map((sev) => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    filterSeverity === sev
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Layer Toggle Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2 py-3 border-b border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 mr-1">
                <Layers className="w-3.5 h-3.5 text-indigo-600" /> Layers:
              </span>

              <button
                onClick={() => setShowSmogGrid(!showSmogGrid)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  showSmogGrid
                    ? 'bg-rose-50 border-rose-200 text-rose-700 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                10m Smog Grid
              </button>

              <button
                onClick={() => setShowFires(!showFires)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  showFires
                    ? 'bg-amber-50 border-amber-200 text-amber-800 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                NASA Fires ({NASA_FIRMS_HOTSPOTS.length})
              </button>

              <button
                onClick={() => setShowStations(!showStations)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  showStations
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                PEQS Sensors
              </button>

              <button
                onClick={() => setShowWindPlumes(!showWindPlumes)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  showWindPlumes
                    ? 'bg-purple-50 border-purple-200 text-purple-700 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Wind className="w-3.5 h-3.5 text-purple-600" />
                Wind Vectors
              </button>

              <button
                onClick={() => setShowHotIndex(!showHotIndex)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  showHotIndex
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                HOT Haze Band
              </button>
            </div>

            {/* Grid Opacity Slider */}
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <span className="text-[11px] font-medium">Haze Opacity:</span>
              <input
                type="range"
                min="20"
                max="100"
                value={gridOpacity}
                onChange={(e) => setGridOpacity(Number(e.target.value))}
                className="w-20 accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <span className="text-[11px] font-mono font-bold text-slate-700 w-8">{gridOpacity}%</span>
            </div>
          </div>

          {/* Interactive Map Surface */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-slate-900 rounded-2xl mt-4 border border-slate-200 overflow-hidden select-none shadow-inner">
            {/* Background Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(#818cf8 1px, transparent 1px), radial-gradient(#cbd5e1 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
                backgroundPosition: '0 0, 12px 12px',
              }}
            />

            {/* Simulated 10m Multi-Spectral Smog Grid / Heatmap Overlay */}
            {showSmogGrid && (
              <div 
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{ opacity: gridOpacity / 100 }}
              >
                <div className="absolute top-[32%] right-[14%] w-72 h-72 rounded-full bg-purple-600/40 filter blur-3xl" />
                <div className="absolute top-[38%] right-[22%] w-60 h-60 rounded-full bg-rose-600/50 filter blur-2xl" />
                <div className="absolute top-[44%] left-[45%] w-64 h-64 rounded-full bg-orange-600/35 filter blur-3xl" />
                <div className="absolute top-[62%] left-[28%] w-56 h-56 rounded-full bg-rose-500/35 filter blur-2xl" />
                <div className="absolute top-[12%] left-[48%] w-48 h-48 rounded-full bg-amber-500/25 filter blur-2xl" />
                {showHotIndex && (
                  <div className="absolute inset-0 bg-indigo-500/10 mix-blend-color-dodge filter blur-md" />
                )}
              </div>
            )}

            {/* SVG Vector Map of Punjab */}
            <svg className="w-full h-full absolute inset-0">
              <defs>
                <linearGradient id="firePlume" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#f97316" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Province Outline and Transboundary Border Corridor */}
              <g className="stroke-slate-700/60 stroke-[1.5] fill-transparent">
                <path
                  d="M 45 10 Q 55 12 70 20 T 92 35 T 88 55 T 78 75 T 60 90 T 35 85 T 20 65 T 25 35 Z"
                  className="stroke-slate-600 stroke-[2] stroke-dasharray-4 fill-slate-900/40"
                />
                
                {/* Indo-Pak Border Corridor */}
                <path
                  d="M 78 22 L 86 34 L 88 48 L 84 62"
                  className="stroke-rose-500/70 stroke-[2] stroke-dashed stroke-dasharray-6"
                />
                <text x="88" y="38" className="fill-rose-400/90 text-[9px] font-mono tracking-wider">
                  Border Corridor
                </text>
              </g>

              {/* Wind Vector Arrows & Drift Trajectories */}
              {showWindPlumes && (
                <g className="text-cyan-400/60">
                  <line x1="88" y1="36" x2="72" y2="40" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7">
                    <animate attributeName="stroke-dashoffset" from="12" to="0" dur="2s" repeatCount="indefinite" />
                  </line>
                  <line x1="82" y1="46" x2="68" y2="48" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7">
                    <animate attributeName="stroke-dashoffset" from="12" to="0" dur="2s" repeatCount="indefinite" />
                  </line>
                  <line x1="75" y1="28" x2="60" y2="35" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7">
                    <animate attributeName="stroke-dashoffset" from="12" to="0" dur="2s" repeatCount="indefinite" />
                  </line>
                </g>
              )}

              {/* Fire Hotspot Dispersion Cones */}
              {showFires &&
                NASA_FIRMS_HOTSPOTS.map((fire) => {
                  const pt = projectCoords(fire.lat, fire.lng);
                  return (
                    <g key={`cone-${fire.id}`} opacity="0.6">
                      <path
                        d={`M ${pt.x} ${pt.y} L ${pt.x - 6} ${pt.y + 3} L ${pt.x - 5} ${pt.y - 3} Z`}
                        fill="url(#firePlume)"
                      />
                    </g>
                  );
                })}
            </svg>

            {/* Render District Nodes */}
            {filteredDistricts.map((d) => {
              const pt = projectCoords(d.lat, d.lng);
              const isSelected = selectedDistrict.id === d.id;
              const severityConf = SEVERITY_CONFIG[d.severity];

              return (
                <div
                  key={d.id}
                  onClick={() => onSelectDistrict(d)}
                  style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                >
                  {/* Radar pulse for hazardous */}
                  {d.severity === 'Hazardous' && (
                    <div className="absolute -inset-3 rounded-full bg-rose-500/20 animate-radar pointer-events-none" />
                  )}

                  {/* Node Circle */}
                  <div
                    className={`relative w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-[10px] transition-all transform group-hover:scale-125 shadow-lg ${
                      isSelected
                        ? 'ring-4 ring-indigo-400 ring-offset-2 ring-offset-slate-900 scale-115'
                        : ''
                    }`}
                    style={{
                      backgroundColor: severityConf.hex,
                      borderColor: '#ffffff',
                    }}
                  >
                    <span className="text-white drop-shadow-md">{d.currentAQI}</span>
                  </div>

                  {/* District Label Card */}
                  <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2.5 py-0.5 rounded-lg shadow-md backdrop-blur-md text-[10px] whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-white/95 text-slate-800 border border-slate-200 font-semibold group-hover:bg-white'
                    }`}
                  >
                    {d.name}
                  </div>
                </div>
              );
            })}

            {/* Render NASA FIRMS Fire Hotspots */}
            {showFires &&
              NASA_FIRMS_HOTSPOTS.map((fire) => {
                const pt = projectCoords(fire.lat, fire.lng);
                const isSelected = selectedFire?.id === fire.id;

                return (
                  <div
                    key={fire.id}
                    onClick={() => setSelectedFire(fire)}
                    style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 group"
                  >
                    <div className="relative">
                      <div className="w-5 h-5 rounded-full bg-amber-500/30 animate-ping absolute inset-0" />
                      <div
                        className={`w-6 h-6 rounded-full bg-gradient-to-tr from-rose-600 to-amber-400 border border-white flex items-center justify-center shadow-lg shadow-rose-600/50 ${
                          isSelected ? 'ring-2 ring-amber-300 scale-125' : 'group-hover:scale-110'
                        }`}
                      >
                        <Flame className="w-3.5 h-3.5 text-white animate-fire" />
                      </div>
                    </div>

                    {/* Fire Tooltip */}
                    <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950/95 border border-amber-500/40 text-[10px] text-amber-300 whitespace-nowrap z-40 shadow-xl">
                      <div className="font-bold">{fire.cropType} ({fire.frpMW} MW)</div>
                      <div className="text-[9px] text-slate-400">{fire.tehsil}, {fire.district} ({fire.confidence}% conf)</div>
                    </div>
                  </div>
                );
              })}

            {/* Render PEQS Ground Stations */}
            {showStations &&
              districts.map((d) => {
                const pt = projectCoords(d.lat, d.lng);
                const stationX = pt.x + 3.5;
                const stationY = pt.y - 3.5;

                return (
                  <div
                    key={`station-${d.id}`}
                    style={{ left: `${stationX}%`, top: `${stationY}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
                    title={`PEQS Station: ${d.peqsStationName} (AQI: ${d.peqsGroundAQI})`}
                  >
                    <div className="w-4 h-4 rounded bg-indigo-950 border border-indigo-400 flex items-center justify-center shadow-md">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    </div>

                    <div className="hidden group-hover:block absolute left-full top-0 ml-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-indigo-400 text-[9px] text-indigo-100 whitespace-nowrap shadow-xl z-30">
                      <div className="font-semibold text-indigo-300">Ground Station: {d.peqsStationName}</div>
                      <div>Sensor AQI: <span className="font-mono font-bold text-white">{d.peqsGroundAQI}</span> | Sat Predicted: <span className="font-mono text-indigo-300">{d.satellitePredictedAQI}</span></div>
                    </div>
                  </div>
                );
              })}

            {/* Map Legend Overlay */}
            <div className="absolute bottom-3 left-3 bg-white/95 border border-slate-200 rounded-2xl p-3 backdrop-blur-md text-[10px] space-y-2 z-40 max-w-[210px] shadow-sm">
              <div className="font-bold text-slate-800 text-[11px] flex items-center justify-between">
                <span>Smog Severity (AQI)</span>
                <span className="text-slate-400 text-[9px]">10m Sentinel</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-slate-600 font-medium">Low (&lt;50)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="text-slate-600 font-medium">Mod (51-100)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                  <span className="text-slate-600 font-medium">Unhealthy</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                  <span className="text-slate-600 font-medium">Severe</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                  <span className="text-purple-700 font-bold">Hazardous (300-500+)</span>
                </div>
              </div>
              <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-500 font-medium">
                <span className="flex items-center gap-1"><Flame className="w-2.5 h-2.5 text-amber-500" /> FIRMS Fires</span>
                <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5 text-indigo-500" /> PEQS Sensor</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Selected District & Fire Hotspot Drilldown Inspector (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Selected District Bento Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {selectedDistrict.division} Division
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <h2 className="text-2xl font-bold text-slate-900">{selectedDistrict.name}</h2>
                    <span className="text-sm font-semibold text-slate-400 font-sans">
                      {selectedDistrict.urduName}
                    </span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${SEVERITY_CONFIG[selectedDistrict.severity].bgBadge}`}>
                  {selectedDistrict.severity}
                </span>
              </div>

              {/* Main AQI & PM2.5 Metrics */}
              <div className="grid grid-cols-2 gap-3 mt-5 bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sentinel-2 ML AQI</span>
                  <div className="text-3xl font-black text-slate-900 flex items-baseline gap-1 mt-0.5">
                    <span className="tabular-nums">{selectedDistrict.currentAQI}</span>
                    <span className="text-xs font-bold text-rose-600">+{selectedDistrict.trend24h}%</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Surface PM2.5</span>
                  <div className="text-2xl font-bold text-amber-700 mt-0.5 tabular-nums">
                    {selectedDistrict.currentPM25.toFixed(1)} <span className="text-xs font-medium text-slate-500">µg/m³</span>
                  </div>
                </div>
              </div>

              {/* Ground Truth Validation */}
              <div className="mt-4 p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-indigo-900 font-semibold">
                  <span className="flex items-center gap-1 text-indigo-700">
                    <Activity className="w-3.5 h-3.5" /> Ground Truth Station
                  </span>
                  <span className="text-emerald-700 font-mono text-[11px] font-bold">
                    R² = 0.84 Fidelity
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">
                  Station: <strong className="text-slate-800">{selectedDistrict.peqsStationName}</strong>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-indigo-100">
                  <span>Sensor AQI: <strong className="text-slate-900">{selectedDistrict.peqsGroundAQI}</strong></span>
                  <span>Model Delta: <strong className="text-indigo-700 font-mono">±{Math.abs(selectedDistrict.peqsGroundAQI - selectedDistrict.satellitePredictedAQI)} pts</strong></span>
                </div>
              </div>

              {/* Meteorological Context */}
              <div className="grid grid-cols-3 gap-2 mt-4 text-center text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] font-bold uppercase">
                    <Thermometer className="w-3 h-3 text-rose-500" /> Temp
                  </div>
                  <span className="font-bold text-slate-800 mt-1 block">{selectedDistrict.temperature}°C</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] font-bold uppercase">
                    <Droplets className="w-3 h-3 text-indigo-500" /> Humidity
                  </div>
                  <span className="font-bold text-slate-800 mt-1 block">{selectedDistrict.humidity}%</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] font-bold uppercase">
                    <Wind className="w-3 h-3 text-purple-500" /> Wind
                  </div>
                  <span className="font-bold text-slate-800 mt-1 block">{selectedDistrict.windSpeed} km/h</span>
                </div>
              </div>

              {/* Primary Smog Source */}
              <div className="mt-4 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Primary Emission Attribution
                </span>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {selectedDistrict.primarySource}
                </p>
              </div>
            </div>

            {/* District Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5 mt-5 pt-4 border-t border-slate-100">
              <button
                onClick={onNavigateToDIP}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs transition-all shadow-xs"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>DIP Inspector</span>
              </button>

              <button
                onClick={onNavigateToAlerts}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs transition-all shadow-xs"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Broadcast Alert</span>
              </button>
            </div>
          </div>

          {/* NASA FIRMS Fire Hotspot Quick Inspector Bento Card */}
          {selectedFire && (
            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-sm animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Flame className="w-4 h-4 animate-fire" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{selectedFire.cropType} Fire</h3>
                    <span className="text-[10px] text-slate-400 font-mono">{selectedFire.id} • {selectedFire.satellite}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFire(null)}
                  className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-lg bg-white/5"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 text-center text-xs">
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <span className="text-[10px] text-slate-400 block font-medium">Radiative Power</span>
                  <strong className="text-amber-300 font-mono text-sm">{selectedFire.frpMW} MW</strong>
                </div>
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <span className="text-[10px] text-slate-400 block font-medium">Brightness</span>
                  <strong className="text-rose-400 font-mono text-sm">{selectedFire.brightnessTempK} K</strong>
                </div>
                <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <span className="text-[10px] text-slate-400 block font-medium">Confidence</span>
                  <strong className="text-emerald-400 font-mono text-sm">{selectedFire.confidence}%</strong>
                </div>
              </div>

              <div className="mt-3.5 text-xs flex items-center justify-between text-slate-300 bg-white/5 p-3 rounded-xl border border-white/10">
                <span>Location: <strong className="text-white">{selectedFire.tehsil}, {selectedFire.district}</strong></span>
                <span className="text-amber-300 font-mono">{selectedFire.distanceToLahoreKm} km to LHR</span>
              </div>

              <button
                onClick={() => onOpenDispatch(selectedFire)}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Dispatch Anti-Smog Squad to Coordinates</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
