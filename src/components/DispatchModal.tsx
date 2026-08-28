import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  Flame, 
  CheckCircle, 
  Truck, 
  Camera 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FireHotspot, DistrictData } from '../types/smog';

interface DispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  fire: FireHotspot | null;
  selectedDistrict: DistrictData;
}

export const DispatchModal: React.FC<DispatchModalProps> = ({
  isOpen,
  onClose,
  fire,
}) => {
  const [squadId, setSquadId] = useState<string>('EPA-SQUAD-04 (Sheikhupura Rapid Unit)');
  const [droneEnabled, setDroneEnabled] = useState<boolean>(true);
  const [penaltyAction, setPenaltyAction] = useState<string>('FIR under Section 144 + Rs. 50,000 Spot Fine');
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deployedSuccess, setDeployedSuccess] = useState<boolean>(false);

  if (!isOpen || !fire) return null;

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      setDeployedSuccess(true);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
      setTimeout(() => {
        setDeployedSuccess(false);
        onClose();
      }, 2000);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden text-slate-900 animate-in fade-in">
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-rose-100 text-rose-700">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Anti-Smog Squad Interception Dispatch
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white hover:bg-slate-200 text-slate-500 transition-all cursor-pointer border border-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          {/* Target Anomaly Telemetry */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-600 flex items-center gap-1.5">
                <Flame className="w-4 h-4" /> NASA FIRMS Anomaly #{fire.id}
              </span>
              <span className="font-mono text-[10px] text-slate-500 font-bold">{fire.satelliteSource}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Location / Corridor</span>
                <strong className="text-slate-900">{fire.locationName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Fire Radiative Power</span>
                <strong className="text-amber-600 font-bold">{fire.brightnessFRP} MW</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">GPS Coordinate</span>
                <strong className="text-indigo-600 font-mono font-bold">{fire.lat.toFixed(4)}°N, {fire.lng.toFixed(4)}°E</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Confidence</span>
                <strong className="text-emerald-700 font-mono font-bold">{fire.confidence}% High</strong>
              </div>
            </div>
          </div>

          {/* Squad Selection */}
          <div className="space-y-1.5">
            <label className="text-slate-700 font-bold block">Assigned Anti-Smog Flying Squad</label>
            <select
              value={squadId}
              onChange={(e) => setSquadId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="EPA-SQUAD-04 (Sheikhupura Rapid Unit)">EPA Squad 04 (Sheikhupura Rapid Unit - ETA 8 mins)</option>
              <option value="EPA-SQUAD-02 (Lahore Northern Ring Unit)">EPA Squad 02 (Lahore Northern Ring - ETA 14 mins)</option>
              <option value="EPA-SQUAD-07 (Gujranwala Industrial Flying Wing)">EPA Squad 07 (Gujranwala Industrial Wing - ETA 19 mins)</option>
              <option value="POLICE-SMOG-01 (Punjab Highway Patrolling Squad)">PHP Smog Squad 01 (Highway Patrolling - ETA 6 mins)</option>
            </select>
          </div>

          {/* Thermal Drone Reconnaissance */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3">
              <Camera className="w-5 h-5 text-indigo-600" />
              <div>
                <span className="font-bold text-slate-900 block">Deploy Aerial Thermal Drone Recon</span>
                <span className="text-[11px] text-slate-500">DJI Matrice 300 RTK Live Video Stream to Control Room</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={droneEnabled}
              onChange={(e) => setDroneEnabled(e.target.checked)}
              className="w-4 h-4 accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Enforcement Action */}
          <div className="space-y-1.5">
            <label className="text-slate-700 font-bold block">Statutory Legal Action Order</label>
            <select
              value={penaltyAction}
              onChange={(e) => setPenaltyAction(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="FIR under Section 144 + Rs. 50,000 Spot Fine">FIR under Section 144 + Rs. 50,000 Spot Fine</option>
              <option value="Immediate Sealing of Brick Kiln / Factory Emissions">Immediate Sealing of Brick Kiln / Factory Emissions</option>
              <option value="Emergency Stubble Water Dousing by Rescue 1122">Emergency Stubble Water Dousing by Rescue 1122</option>
              <option value="Arrest of Farm Supervisor & Impoundment of Harvester">Arrest of Farm Supervisor & Impoundment of Harvester</option>
            </select>
          </div>

          {/* Action Trigger */}
          {deployedSuccess ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center font-bold flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              Squad Dispatched! Navigation telemetry transmitted to vehicle MDT.
            </div>
          ) : (
            <button
              onClick={handleDeploy}
              disabled={isDeploying}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Truck className={`w-4 h-4 ${isDeploying ? 'animate-bounce' : ''}`} />
              <span>{isDeploying ? 'Transmitting GPS Coordinates...' : 'Authorize Immediate Squad Interception'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
