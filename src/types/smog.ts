export type SmogSeverity = 'Low' | 'Moderate' | 'Unhealthy' | 'Severe' | 'Hazardous';

export interface DistrictData {
  id: string;
  name: string;
  urduName: string;
  division: string;
  lat: number;
  lng: number;
  currentAQI: number;
  currentPM25: number; // in µg/m³
  severity: SmogSeverity;
  trend24h: number; // percentage change
  temperature: number; // °C
  humidity: number; // %
  windSpeed: number; // km/h
  windDirection: string;
  visibilityKm: number;
  population: string;
  primarySource: string;
  activeFiresCount: number;
  peqsStationName: string;
  peqsGroundAQI: number;
  satellitePredictedAQI: number;
  modelConfidence: number; // 0 to 1
  history24h: { time: string; aqi: number; pm25: number }[];
  history30d: { date: string; aqi: number; pm25: number; groundTruth: number }[];
}

export interface FireHotspot {
  id: string;
  lat: number;
  lng: number;
  district: string;
  tehsil: string;
  confidence: number; // 0-100%
  frpMW: number; // Fire Radiative Power in MegaWatts
  brightnessTempK: number; // Kelvin
  detectedTime: string;
  satellite: 'VIIRS (NOAA-20)' | 'MODIS (Aqua)' | 'MODIS (Terra)' | 'Sentinel-2 MSI';
  cropType: 'Paddy Rice Stubble' | 'Wheat Residue' | 'Sugarcane Trash' | 'Industrial Kiln' | 'Cotton Residue';
  windBearing: number; // degrees
  distanceToLahoreKm: number;
  status: 'Active' | 'Dispatched' | 'Extinguished' | 'Under Investigation';
  dispatchTeam?: string;
  locationName?: string;
  brightnessFRP?: number;
  satelliteSource?: string;
}

export interface DIPFeatures {
  blueShiftRatio: number; // Histogram right-shift indicator
  edgeSharpnessScore: number; // 0-100 Sobel edge gradient sum
  hsiSaturationLoss: number; // 0-100 color degradation index
  fftHighFreqEnergyRatio: number; // 0-100 high frequency detail retention
  hotIndex: number; // Haze Optimized Transformation
  cloudCoverPercent: number;
  radiometricMean: number;
  contrastScore: number;
}

export interface MLPrediction {
  severityClass: SmogSeverity;
  predictedPM25: number;
  catboostConfidence: number;
  xgboostRMSE: number;
  shapValues: {
    feature: string;
    importance: number;
    impact: string;
  }[];
}

export interface StakeholderAlert {
  id: string;
  timestamp: string;
  targetGroup: 'Schools & Education' | 'Hospitals & Health' | 'EPA & Police Enforcement' | 'General Public' | 'Aviation & Motorway';
  severityLevel: SmogSeverity;
  thresholdAQI: number;
  title: string;
  messageEn: string;
  messageUr: string;
  channel: 'SMS Broadcast' | 'Web & App Push' | 'WhatsApp Hotline' | 'Civil Defense Siren';
  district: string;
  recipientsCount: number;
  status: 'Delivered' | 'Pending Broadcast' | 'Triggered' | 'Simulated';
}

export interface CrisisScenario {
  id: string;
  name: string;
  label: string;
  date: string;
  description: string;
  lahoreAQI: number;
  lahorePM25: number;
  fireCount: number;
  windDesc: string;
  inversionStrength: 'Extreme' | 'High' | 'Moderate' | 'None';
  visibility: string;
  multiplier: number;
}
