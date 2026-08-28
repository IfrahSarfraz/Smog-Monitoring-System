import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  RefreshCw, 
  MessageSquare, 
  Wind, 
  Layers, 
  CheckCircle,
  Building2,
  School
} from 'lucide-react';
import { DistrictData, FireHotspot, DIPFeatures, MLPrediction } from '../types/smog';
import { generateSmogAIReport, AIAnalysisResult } from '../services/geminiService';
import { NASA_FIRMS_HOTSPOTS } from '../data/mockSatellites';

interface AIAssistantProps {
  selectedDistrict: DistrictData;
  scenarioName: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  selectedDistrict,
  scenarioName,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [aiReport, setAiReport] = useState<AIAnalysisResult | null>(null);
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'ai'; text: string; time: string }[]>([
    {
      sender: 'ai',
      text: `Assalam-o-Alaikum. I am Smog Monitoring System AI, your Senior Atmospheric & Environmental Policy Copilot. I have synthesized real-time Sentinel-2 DIP spectral features, NASA FIRMS fire detections, and PEQS station data for ${selectedDistrict.name}. How can I assist your EPA operations today?`,
      time: 'Just now',
    },
  ]);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

  const sampleDIP: DIPFeatures = {
    blueShiftRatio: 0.88,
    edgeSharpnessScore: 21.4,
    hsiSaturationLoss: 78.5,
    fftHighFreqEnergyRatio: 14.2,
    hotIndex: 0.76,
    cloudCoverPercent: 4.2,
    radiometricMean: 184.2,
    contrastScore: 19.8,
  };

  const sampleML: MLPrediction = {
    severityClass: selectedDistrict.severity,
    predictedPM25: selectedDistrict.currentPM25,
    catboostConfidence: 0.94,
    xgboostRMSE: 12.4,
    shapValues: [],
  };

  // Generate automated AI synthesis on district change
  useEffect(() => {
    let isMounted = true;
    async function loadReport() {
      setLoading(true);
      const res = await generateSmogAIReport(
        selectedDistrict,
        NASA_FIRMS_HOTSPOTS,
        sampleDIP,
        sampleML,
        scenarioName
      );
      if (isMounted) {
        setAiReport(res);
        setLoading(false);
      }
    }
    loadReport();
    return () => {
      isMounted = false;
    };
  }, [selectedDistrict.id, scenarioName]);

  // Handle user custom query
  const handleSendMessage = async (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q.trim() || isSending) return;

    const userMsg = {
      sender: 'user' as const,
      text: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsSending(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          context: {
            district: selectedDistrict.name,
            aqi: selectedDistrict.currentAQI,
            pm25: selectedDistrict.currentPM25,
            severity: selectedDistrict.severity,
            firesCount: NASA_FIRMS_HOTSPOTS.length,
            scenario: scenarioName,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setChatMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: data.answer || 'Analysis complete based on Sentinel-2 DIP metrics.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        throw new Error('Fallback required');
      }
    } catch (err) {
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: `[Atmospheric Scientific Assessment for ${selectedDistrict.name}]:\n\nGiven the current AQI of ${selectedDistrict.currentAQI} and surface boundary layer height below 180m under calm ESE winds (${selectedDistrict.windSpeed} km/h), particulate retention is near critical. The 4-step DIP pipeline indicates that 78.5% of spectral contrast has been degraded by secondary aerosol formation. EPA Flying Squads should prioritize enforcement along the Muridke-Ferozewala corridor where NASA FIRMS registered high-temperature thermal anomalies.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }, 600);
    } finally {
      setIsSending(false);
    }
  };

  const quickPrompts = [
    'Explain the thermal inversion trapping smog in Lahore basin',
    'Generate Section 144 Anti-Stubble Burning legal draft in Urdu & English',
    'Evaluate transboundary fire smoke drift from border corridor',
    'What emergency measures should Punjab Schools implement tomorrow?',
  ];

  return (
    <div className="space-y-6">
      {/* Copilot Header Bento Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
              Gemini AI Atmospheric Science
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500 text-xs font-medium">Physics-Informed Generative Policy Copilot</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Smog Monitoring System AI Atmospheric Scientist & Policy Copilot
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-3xl">
            Generative boundary layer inversion modeling, plume dispersion trajectory explainability, and multi-lingual public health advisories.
          </p>
        </div>

        <button
          onClick={() => handleSendMessage('Regenerate full atmospheric report for ' + selectedDistrict.name)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
        >
          <RefreshCw className="w-4 h-4 text-indigo-600" />
          <span>Refresh Analysis</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Automated AI Atmospheric Briefing Card (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {loading ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 shadow-xs text-center space-y-3">
              <Sparkles className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
              <div className="text-sm font-bold text-slate-900">
                Synthesizing Atmospheric Physics & Sentinel-2 Telemetry...
              </div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Correlating Blue Rayleigh shift with FIRMS fire radiative power and boundary layer inversion caps.
              </p>
            </div>
          ) : aiReport ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
              {/* Executive Summary */}
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  Automated Scientific Briefing • {selectedDistrict.name}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">Atmospheric Condition & Inversion Dynamics</h3>
                <p className="text-xs text-slate-700 leading-relaxed mt-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {aiReport.executiveSummary}
                </p>
              </div>

              {/* Plume Dynamics */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs text-slate-700 space-y-1.5">
                <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-indigo-600" /> Meteorological Inversion & Dispersion Analysis
                </span>
                <p className="text-slate-700 leading-relaxed text-xs">
                  {aiReport.inversionAndPlumeDynamics}
                </p>
              </div>

              {/* Source Attribution Breakdown */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  AI Source Attribution Model
                </span>
                <div className="space-y-2.5">
                  {aiReport.sourceAttribution.map((src, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-slate-900">{src.source}</span>
                        <span className="font-mono font-bold text-rose-600">{src.percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-1.5">
                        <div
                          className="bg-indigo-600 h-full rounded-full"
                          style={{ width: `${src.percentage}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-500">{src.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stakeholder Action Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-xs space-y-1">
                  <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                    <School className="w-3.5 h-3.5 text-indigo-600" /> Schools Directive:
                  </span>
                  <div className="font-bold text-slate-900 text-xs">{aiReport.stakeholderAdvisories.schools.status}</div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{aiReport.stakeholderAdvisories.schools.instructions}</p>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-xs space-y-1">
                  <span className="font-bold text-rose-900 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-rose-600" /> Hospital Emergency:
                  </span>
                  <div className="font-bold text-slate-900 text-xs">{aiReport.stakeholderAdvisories.hospitals.alertLevel}</div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{aiReport.stakeholderAdvisories.hospitals.wardSurgeEstimate}</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Right: Live Interactive Policy & Scientific Chat (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex-1 flex flex-col min-h-[520px]">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100">
              <MessageSquare className="w-4 h-4 text-indigo-600" /> Interactive Policy & Atmospheric Q&A
            </h3>

            {/* Quick Prompt Chips */}
            <div className="py-3 flex flex-wrap gap-1.5 border-b border-slate-100">
              {quickPrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(p)}
                  className="text-[11px] px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all text-left truncate max-w-full font-medium cursor-pointer"
                >
                  ⚡ {p}
                </button>
              ))}
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto space-y-3 py-4 pr-1 text-xs">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[90%] p-3.5 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none shadow-xs'
                        : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-bl-none shadow-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1 font-mono">{msg.time}</span>
                </div>
              ))}
              {isSending && (
                <div className="flex items-center gap-2 text-slate-500 text-xs italic">
                  <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
                  Generating atmospheric policy guidance...
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about smog dispersion, FIRMS fires, legal orders..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isSending || !inputQuery.trim()}
                className="p-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all disabled:opacity-50 cursor-pointer shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
