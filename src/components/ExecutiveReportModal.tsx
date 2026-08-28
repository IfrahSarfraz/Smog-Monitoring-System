import React from 'react';
import { 
  X, 
  Printer, 
  FileText
} from 'lucide-react';
import { DistrictData, CrisisScenario } from '../types/smog';
import { NASA_FIRMS_HOTSPOTS } from '../data/mockSatellites';

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDistrict: DistrictData;
  districts: DistrictData[];
  selectedScenario: CrisisScenario;
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({
  isOpen,
  onClose,
  selectedDistrict,
  districts,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const avgAQI = Math.round(districts.reduce((acc, d) => acc + d.currentAQI, 0) / districts.length);
  const totalFires = NASA_FIRMS_HOTSPOTS.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden my-8 text-slate-900">
        {/* Modal Top Bar */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between no-print">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-indigo-100 text-indigo-700">
              <FileText className="w-5 h-5" />
            </span>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Punjab EPA Executive Smog Briefing Document
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white hover:bg-slate-200 text-slate-500 text-xs transition-all cursor-pointer border border-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 space-y-6 bg-white text-slate-800 print:p-0">
          {/* Official Letterhead */}
          <div className="border-b-2 border-rose-500 pb-4 flex items-start justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-widest font-bold text-rose-700 font-mono">
                Government of Punjab • Environmental Protection Agency (PEQS)
              </div>
              <h1 className="text-xl font-black text-slate-900 mt-1">
                Smog Monitoring System Provincial Smog Emergency Assessment Report
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Multi-Sensor Satellite Fusion: Sentinel-2 MSI (10m), MODIS AOD 550nm, NASA FIRMS & PEQS Ground Stations
              </p>
            </div>

            <div className="text-right text-xs font-mono">
              <div className="font-bold text-slate-900">Ref: EPA/SMOG/2026-X8</div>
              <div className="text-slate-500">{new Date().toLocaleDateString('en-PK', { dateStyle: 'full' })}</div>
              <div className="text-rose-600 font-bold">STATUS: HAZARDOUS ALERT</div>
            </div>
          </div>

          {/* Key Situation Summary */}
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Punjab Provincial Average</span>
              <div className="text-2xl font-black text-rose-600 mt-0.5">{avgAQI} AQI</div>
              <span className="text-[11px] text-slate-500">PM2.5 Avg: ~312 µg/m³</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Target District: {selectedDistrict.name}</span>
              <div className="text-2xl font-black text-indigo-700 mt-0.5">{selectedDistrict.currentAQI} AQI</div>
              <span className="text-[11px] text-slate-500">Severity: {selectedDistrict.severity}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Active FIRMS Fire Anomalies</span>
              <div className="text-2xl font-black text-amber-600 mt-0.5">{totalFires} Clusters</div>
              <span className="text-[11px] text-slate-500">Stubble & Kiln Plumes</span>
            </div>
          </div>

          {/* Section 1: Atmospheric Inversion & DIP Metrics */}
          <div className="space-y-2 text-xs">
            <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-200 pb-1">
              1. Digital Image Processing (DIP) & Spectral Diagnostics
            </h3>
            <p className="text-slate-700 leading-relaxed text-xs">
              Sentinel-2 MSI 10m tile analysis reveals severe blue channel right-shift (Shift Index: 0.88), indicating profound Rayleigh aerosol backscatter. High-frequency structural sharpness has degraded by 78.6% relative to clean post-monsoon baseline. Planetary boundary layer height is capped at 170 meters due to nocturnal surface radiational cooling and calm ESE winds (3.1 km/h).
            </p>
          </div>

          {/* Section 2: District Ground Truth Cross-Validation */}
          <div className="space-y-2 text-xs">
            <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-200 pb-1">
              2. Ground-Truth Station Cross-Validation
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px]">PEQS Ground Sensor (Town Hall / Met):</span>
                <strong className="text-slate-900 text-sm">{selectedDistrict.peqsGroundAQI} AQI</strong>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Sentinel-2 ML Model Estimate (CatBoost/XGBoost):</span>
                <strong className="text-indigo-700 text-sm">{selectedDistrict.satellitePredictedAQI} AQI (R² = 0.84)</strong>
              </div>
            </div>
          </div>

          {/* Section 3: Statutory Directives */}
          <div className="space-y-2 text-xs">
            <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider border-b border-slate-200 pb-1">
              3. Emergency Executive Directives (Section 144 Enforcement)
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700 text-xs leading-relaxed">
              <li><strong>Schools & Academies:</strong> Immediate suspension of outdoor physical activities; mandatory N95 masking on premises across affected divisions.</li>
              <li><strong>Agriculture & Stubble Control:</strong> Direct deployment of Thermal Drone Squads to Muridke, Ferozewala, and Chunian agricultural belts to intercept active stubble burning.</li>
              <li><strong>Industrial Emissions:</strong> Temporary sealing of un-upgraded traditional Bull Trench brick kilns in 25km urban periphery.</li>
              <li><strong>Public Health Desks:</strong> Activation of respiratory triage protocols at Mayo Hospital, Services Hospital, and Allied Hospital Faisalabad.</li>
            </ul>
          </div>

          {/* Signatures */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs">
            <div>
              <div className="border-b border-slate-300 pb-8"></div>
              <div className="mt-1 font-bold text-slate-900">Director General (DG)</div>
              <div className="text-[11px] text-slate-500">Environmental Protection Agency (EPA), Punjab</div>
            </div>

            <div>
              <div className="border-b border-slate-300 pb-8"></div>
              <div className="mt-1 font-bold text-slate-900">Secretary Environment</div>
              <div className="text-[11px] text-slate-500">Government of the Punjab, Lahore</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
