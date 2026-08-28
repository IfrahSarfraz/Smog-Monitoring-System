import React, { useState } from 'react';
import { 
  Bell, 
  Radio, 
  School, 
  Building2, 
  ShieldAlert, 
  Users, 
  CheckCircle, 
  Sliders, 
  Code, 
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DistrictData, StakeholderAlert } from '../types/smog';

interface AlertingCenterProps {
  districts: DistrictData[];
  selectedDistrict: DistrictData;
  onSimulateBroadcast: () => void;
}

export const AlertingCenter: React.FC<AlertingCenterProps> = ({
  districts,
  selectedDistrict,
}) => {
  // Alert Thresholds
  const [schoolThreshold, setSchoolThreshold] = useState<number>(200);
  const [hospitalThreshold, setHospitalThreshold] = useState<number>(300);
  const [publicThreshold, setPublicThreshold] = useState<number>(150);
  const [epaThreshold, setEpaThreshold] = useState<number>(350);

  // Active Stakeholder selection
  const [broadcastLanguage, setBroadcastLanguage] = useState<'both' | 'en' | 'ur'>('both');
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState<boolean>(false);

  // Sample active alert queue
  const [alerts] = useState<StakeholderAlert[]>([
    {
      id: 'ALT-SCH-01',
      timestamp: 'Just now (Auto-Triggered)',
      targetGroup: 'Schools & Education',
      severityLevel: selectedDistrict.severity,
      thresholdAQI: schoolThreshold,
      title: `Mandatory Outdoor Activity Ban - ${selectedDistrict.name}`,
      messageEn: `EPA Punjab Advisory: AQI in ${selectedDistrict.name} reached ${selectedDistrict.currentAQI}. All outdoor sports and morning assemblies suspended. N95 masks mandatory.`,
      messageUr: `محکمہ ماحولیات پنجاب: ${selectedDistrict.urduName} میں اے کیو آئی ${selectedDistrict.currentAQI} پر پہنچ گیا۔ تمام آؤٹ ڈور سرگرمیاں فوری بند اور این 95 ماسک لازمی۔`,
      channel: 'SMS Broadcast',
      district: selectedDistrict.name,
      recipientsCount: 4250,
      status: 'Triggered',
    },
    {
      id: 'ALT-HOSP-02',
      timestamp: '5 mins ago',
      targetGroup: 'Hospitals & Health',
      severityLevel: selectedDistrict.severity,
      thresholdAQI: hospitalThreshold,
      title: `Code Red Surge: Inpatient Respiratory Ward Alert`,
      messageEn: `Health Dept Directive: Prepare emergency nebulization counters and 72-hour supplemental oxygen surge for Mayo & Allied hospitals.`,
      messageUr: `ہیلتھ ایڈوائزری: ہسپتالوں کے ایمرجنسی وارڈز میں سانس اور دمے کے مریضوں کے لیے آکسیجن اور نیبولائزر کا فوری انتظام۔`,
      channel: 'Web & App Push',
      district: selectedDistrict.name,
      recipientsCount: 180,
      status: 'Delivered',
    },
    {
      id: 'ALT-EPA-03',
      timestamp: '12 mins ago',
      targetGroup: 'EPA & Police Enforcement',
      severityLevel: 'Hazardous',
      thresholdAQI: epaThreshold,
      title: `NASA FIRMS Stubble Fire Interception Dispatch`,
      messageEn: `Anti-Smog Squad Alert: Active crop burning detected in Sheikhupura/Muridke corridor. Deploy drone unit for Section 144 action.`,
      messageUr: `اینٹی سموگ اسکواڈ الرٹ: شیخوپورہ کوریڈور میں فصلوں کی باقیات جلانے کی سیٹلائٹ نشاندہی۔ ڈرون اسکواڈ روانہ کریں۔`,
      channel: 'Civil Defense Siren',
      district: selectedDistrict.name,
      recipientsCount: 48,
      status: 'Delivered',
    },
    {
      id: 'ALT-PUB-04',
      timestamp: '18 mins ago',
      targetGroup: 'General Public',
      severityLevel: selectedDistrict.severity,
      thresholdAQI: publicThreshold,
      title: `Hazardous Smog Health Warning (Urdu & English)`,
      messageEn: `Citizens Advisory: Extreme air toxicity in ${selectedDistrict.name}. Avoid non-essential travel. Wear N95 respirators.`,
      messageUr: `شہریوں کے لیے اہم اطلاع: ${selectedDistrict.urduName} کی فضا انتہائی خطرناک۔ غیر ضروری سفر سے گریز کریں اور ماسک کا استعمال کریں۔`,
      channel: 'SMS Broadcast',
      district: selectedDistrict.name,
      recipientsCount: 1250000,
      status: 'Delivered',
    },
  ]);

  const handleTriggerBroadcast = () => {
    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
      setBroadcastSuccess(true);
      
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
      });

      setTimeout(() => setBroadcastSuccess(false), 4500);
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Alert Center Bento Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
              Early Warning Dispatch
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500 text-xs font-medium">Cellular Broadcast & Institutional Web Push</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Automated Multi-Stakeholder Alerting Engine
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-3xl">
            Rules-based automatic SMS, Web Push, and Civil Defense dispatch for Schools, Hospitals, EPA Flying Squads, and Public Health.
          </p>
        </div>

        {/* Live Broadcast Trigger */}
        <button
          onClick={handleTriggerBroadcast}
          disabled={isBroadcasting}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50 shrink-0"
        >
          <Radio className={`w-4 h-4 ${isBroadcasting ? 'animate-spin' : 'animate-pulse'}`} />
          <span>{isBroadcasting ? 'Broadcasting via Gateways...' : 'Trigger Provincial Broadcast'}</span>
        </button>
      </div>

      {/* Success Notification Banner */}
      {broadcastSuccess && (
        <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3 shadow-xs">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <strong className="font-bold">Broadcast Dispatched Successfully:</strong> 1,254,478 SMS delivered across Punjab cellular towers & 4,250 institutional push notifications confirmed.
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Rules Engine & Threshold Configurator (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Threshold Tuning Bento Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100">
              <Sliders className="w-4 h-4 text-indigo-600" /> Automated Trigger Thresholds
            </h3>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between text-slate-700 font-semibold mb-2">
                  <span className="flex items-center gap-2">
                    <School className="w-4 h-4 text-indigo-600" />
                    <span>Schools & Outdoor Ban</span>
                  </span>
                  <span className="font-mono font-bold text-indigo-600">&gt; {schoolThreshold} AQI</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="350"
                  value={schoolThreshold}
                  onChange={(e) => setSchoolThreshold(Number(e.target.value))}
                  className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between text-slate-700 font-semibold mb-2">
                  <span className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-rose-600" />
                    <span>Hospitals: Ward Surge</span>
                  </span>
                  <span className="font-mono font-bold text-rose-600">&gt; {hospitalThreshold} AQI</span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="450"
                  value={hospitalThreshold}
                  onChange={(e) => setHospitalThreshold(Number(e.target.value))}
                  className="w-full accent-rose-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between text-slate-700 font-semibold mb-2">
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-600" />
                    <span>Public N95 Advisory</span>
                  </span>
                  <span className="font-mono font-bold text-amber-600">&gt; {publicThreshold} AQI</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="250"
                  value={publicThreshold}
                  onChange={(e) => setPublicThreshold(Number(e.target.value))}
                  className="w-full accent-amber-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between text-slate-700 font-semibold mb-2">
                  <span className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-purple-600" />
                    <span>EPA Flying Squad Unit</span>
                  </span>
                  <span className="font-mono font-bold text-purple-600">&gt; {epaThreshold} AQI</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="500"
                  value={epaThreshold}
                  onChange={(e) => setEpaThreshold(Number(e.target.value))}
                  className="w-full accent-purple-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Telecom Gateway API Payload Preview */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Code className="w-4 h-4 text-indigo-600" /> Telecom Gateway API Payload
            </h3>

            <pre className="p-4 rounded-2xl bg-slate-900 text-[11px] text-indigo-300 font-mono overflow-x-auto border border-slate-800">
{`POST /v1/Broadcast/PunjabCellular
{
  "senderId": "PUNJAB_EPA",
  "geoFence": "${selectedDistrict.name}_METRO_GRID",
  "priority": "HIGH_EMERGENCY",
  "encoding": "UTF-8_URDU_AND_GSM7",
  "aqiValue": ${selectedDistrict.currentAQI},
  "subscribersCount": "1,250,000",
  "channels": ["SMS_CB", "WEB_PUSH", "WHATSAPP_HOTLINE"]
}`}
            </pre>
          </div>
        </div>

        {/* Right: Active Broadcast Queue & Live Message Previews (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-600" /> Live Dispatched Stakeholder Bulletins
              </h3>

              {/* Language Switcher */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                <button
                  onClick={() => setBroadcastLanguage('both')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    broadcastLanguage === 'both' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Urdu + English
                </button>
                <button
                  onClick={() => setBroadcastLanguage('en')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    broadcastLanguage === 'en' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  English Only
                </button>
                <button
                  onClick={() => setBroadcastLanguage('ur')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    broadcastLanguage === 'ur' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  اردو فقط
                </button>
              </div>
            </div>

            {/* List of Alerts */}
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all space-y-3 shadow-xs"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-xl bg-white text-indigo-600 shadow-xs border border-slate-200">
                        {alert.targetGroup.includes('Schools') ? <School className="w-4 h-4" /> : alert.targetGroup.includes('Hospitals') ? <Building2 className="w-4 h-4" /> : alert.targetGroup.includes('EPA') ? <ShieldAlert className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{alert.title}</h4>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {alert.targetGroup} • {alert.channel} • {alert.recipientsCount.toLocaleString()} recipients
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                      {alert.status}
                    </span>
                  </div>

                  {/* Message Content */}
                  {(broadcastLanguage === 'both' || broadcastLanguage === 'en') && (
                    <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed">
                      {alert.messageEn}
                    </div>
                  )}

                  {(broadcastLanguage === 'both' || broadcastLanguage === 'ur') && (
                    <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 text-right font-sans leading-relaxed" dir="rtl">
                      {alert.messageUr}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
