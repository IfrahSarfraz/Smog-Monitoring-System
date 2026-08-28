/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { MapGISView } from './components/MapGISView';
import { DIPStudio } from './components/DIPStudio';
import { AnalyticsTrends } from './components/AnalyticsTrends';
import { AlertingCenter } from './components/AlertingCenter';
import { AIAssistant } from './components/AIAssistant';
import { ExecutiveReportModal } from './components/ExecutiveReportModal';
import { DispatchModal } from './components/DispatchModal';
import { PUNJAB_DISTRICTS, CRISIS_SCENARIOS } from './data/punjabDistricts';
import { NASA_FIRMS_HOTSPOTS } from './data/mockSatellites';
import { DistrictData, CrisisScenario, FireHotspot } from './types/smog';

export default function App() {
  const [activeTab, setActiveTab] = useState<'map' | 'dip' | 'analytics' | 'alerts' | 'ai'>('map');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('peak_stubble');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('lahore');
  const [selectedFire, setSelectedFire] = useState<FireHotspot | null>(null);
  
  // Modals
  const [isExecutiveReportOpen, setIsExecutiveReportOpen] = useState<boolean>(false);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState<boolean>(false);

  // Active Crisis Scenario
  const activeScenario = useMemo<CrisisScenario>(() => {
    return CRISIS_SCENARIOS.find((s) => s.id === selectedScenarioId) || CRISIS_SCENARIOS[0];
  }, [selectedScenarioId]);

  // Scaled districts dataset according to scenario
  const scenarioDistricts = useMemo<DistrictData[]>(() => {
    const multiplier = activeScenario.multiplier;
    return PUNJAB_DISTRICTS.map((d) => {
      const scaledAQI = Math.round(d.currentAQI * multiplier);
      const scaledPM25 = +(d.currentPM25 * multiplier).toFixed(1);
      
      let severity: 'Low' | 'Moderate' | 'Unhealthy' | 'Severe' | 'Hazardous' = 'Moderate';
      if (scaledAQI < 50) severity = 'Low';
      else if (scaledAQI < 100) severity = 'Moderate';
      else if (scaledAQI < 200) severity = 'Unhealthy';
      else if (scaledAQI < 300) severity = 'Severe';
      else severity = 'Hazardous';

      return {
        ...d,
        currentAQI: scaledAQI,
        currentPM25: scaledPM25,
        severity,
        windSpeed: +(d.windSpeed * (multiplier > 1.2 ? 0.7 : 1.1)).toFixed(1),
        peqsGroundAQI: Math.round(d.peqsGroundAQI * multiplier),
        satellitePredictedAQI: scaledAQI,
      };
    });
  }, [activeScenario]);

  // Active district
  const selectedDistrict = useMemo<DistrictData>(() => {
    return scenarioDistricts.find((d) => d.id === selectedDistrictId) || scenarioDistricts[0];
  }, [scenarioDistricts, selectedDistrictId]);

  // Handle fire click
  const handleSelectFire = (fire: FireHotspot) => {
    setSelectedFire(fire);
    setIsDispatchModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] flex flex-col antialiased selection:bg-indigo-600 selection:text-white font-sans">
      {/* Top Application Header & Telemetry Bar */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedScenario={selectedScenarioId}
        onScenarioChange={setSelectedScenarioId}
        onOpenExecutiveReport={() => setIsExecutiveReportOpen(true)}
        onOpenDispatch={() => setIsDispatchModalOpen(true)}
        onSimulateAlert={() => setActiveTab('alerts')}
      />

      {/* Main Tabbed Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        {activeTab === 'map' && (
          <MapGISView
            districts={scenarioDistricts}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={(d) => setSelectedDistrictId(d.id)}
            selectedScenario={activeScenario}
            onNavigateToDIP={() => setActiveTab('dip')}
            onNavigateToAlerts={() => setActiveTab('alerts')}
            onOpenDispatch={(fire) => {
              if (fire) setSelectedFire(fire);
              setIsDispatchModalOpen(true);
            }}
          />
        )}

        {activeTab === 'dip' && (
          <DIPStudio
            selectedDistrict={selectedDistrict}
            onSelectDistrict={(d) => setSelectedDistrictId(d.id)}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsTrends
            districts={scenarioDistricts}
            selectedDistrict={selectedDistrict}
            onSelectDistrict={(d) => setSelectedDistrictId(d.id)}
          />
        )}

        {activeTab === 'alerts' && (
          <AlertingCenter
            districts={scenarioDistricts}
            selectedDistrict={selectedDistrict}
            onSimulateBroadcast={() => {}}
          />
        )}

        {activeTab === 'ai' && (
          <AIAssistant
            selectedDistrict={selectedDistrict}
            scenarioName={activeScenario.name}
          />
        )}
      </main>

      {/* Footer Status Bar */}
      <footer className="bg-white border-t border-[#E2E8F0] px-6 py-4 text-center text-xs text-slate-500 font-sans flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-slate-700">Smog Monitoring System v2.4</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500">Punjab EPA GIS & DIP Operational Network</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
          <span>Sentinel-2 MSI (10m)</span>
          <span className="text-slate-300">•</span>
          <span>NASA FIRMS VIIRS</span>
          <span className="text-slate-300">•</span>
          <span>CatBoost & XGBoost ML</span>
          <span className="text-slate-300">•</span>
          <span>Gemini 3.7 Flash</span>
        </div>
      </footer>

      {/* Executive Report Modal */}
      <ExecutiveReportModal
        isOpen={isExecutiveReportOpen}
        onClose={() => setIsExecutiveReportOpen(false)}
        selectedDistrict={selectedDistrict}
        districts={scenarioDistricts}
        selectedScenario={activeScenario}
      />

      {/* Anti-Smog Flying Squad Dispatch Modal */}
      <DispatchModal
        isOpen={isDispatchModalOpen}
        onClose={() => {
          setIsDispatchModalOpen(false);
          setSelectedFire(null);
        }}
        fire={selectedFire || NASA_FIRMS_HOTSPOTS[0]}
        selectedDistrict={selectedDistrict}
      />
    </div>
  );
}

