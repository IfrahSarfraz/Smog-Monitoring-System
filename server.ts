import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy init Gemini AI
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Smog Monitoring System Backend', time: new Date().toISOString() });
});

// Gemini Smog Analysis Route
app.post('/api/gemini/analyze-smog', async (req, res) => {
  try {
    const { district, activeFiresCount, dipFeatures, mlPrediction, scenarioName } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({ fallback: true, message: 'No API key provided, client fallback engaged.' });
    }

    const prompt = `You are the Chief Atmospheric Scientist and Smog Advisor for the Environmental Protection Agency (EPA) Government of Punjab, Pakistan.
Analyze the following real-time telemetry from Sentinel-2 satellite, DIP feature extractor, and ground PEQS stations:

- District: ${district.name} (${district.division}, Punjab)
- Current AQI: ${district.currentAQI} | PM2.5: ${district.currentPM25} µg/m³ (${mlPrediction?.severityClass} Severity)
- Wind: ${district.windSpeed} km/h from ${district.windDirection} | Humidity: ${district.humidity}% | Temp: ${district.temperature}°C
- NASA FIRMS Active Stubble Fire Hotspots: ${activeFiresCount} clusters
- DIP Features: Blue Shift Ratio=${dipFeatures?.blueShiftRatio}, Edge Sharpness=${dipFeatures?.edgeSharpnessScore}%, HSI Saturation Loss=${dipFeatures?.hsiSaturationLoss}%, FFT High-Freq Energy=${dipFeatures?.fftHighFreqEnergyRatio}%
- Crisis Scenario: ${scenarioName}

Generate a concise, highly technical yet actionable JSON response with this exact structure:
{
  "executiveSummary": "Concise summary of atmospheric condition, inversion layer, and satellite findings",
  "inversionAndPlumeDynamics": "Analysis of wind trajectory, boundary layer height, and agricultural stubble smoke drift into urban centers",
  "sourceAttribution": [
    { "source": "Source name", "percentage": 40, "description": "Brief context" }
  ],
  "stakeholderAdvisories": {
    "schools": {
      "status": "Open" | "Hybrid / Staggered" | "Closed (Section 144)",
      "instructions": "English instruction for schools",
      "urduNotice": "Urdu translation for public broadcast"
    },
    "hospitals": {
      "alertLevel": "Standard" | "Elevated" | "Code Red Surge Protocol",
      "instructions": "Hospital emergency directive",
      "wardSurgeEstimate": "Projected respiratory patient surge"
    },
    "epaEnforcement": {
      "priorityTarget": "Location / Tehsil",
      "recommendedActions": ["action 1", "action 2"],
      "droneCoordinates": "Coordinates"
    },
    "civilAviationAndMotorway": {
      "visibilityAdvisory": "RVR advisory and flight/motorway safety notes",
      "affectedRoutes": ["M-2", "M-3", "Ring Road"]
    }
  },
  "forecast48h": {
    "trend": "Worsening" | "Improving" | "Stable",
    "peakAQIExpected": 490,
    "windShiftWindow": "Wind shift expectation"
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating AI smog analysis:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate AI analysis' });
  }
});

// Custom Q&A / Chat endpoint for Policy Copilot
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { question, context } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        answer: `AI Intelligence Copilot response for "${question}":\n\nBased on Sentinel-2 DIP analysis and NASA FIRMS agricultural hotspot mapping across Central Punjab, immediate interventions should focus on enforcement of Section 144 on stubble burning along the Sheikhupura-Kasur-Muridke agricultural corridor, sealing un-upgraded brick kilns, and restricting heavy freight transit between 06:00 and 10:00 PKT during peak boundary layer inversion.`,
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: `You are the Smog Monitoring System Senior Atmospheric & Environmental Policy Copilot for Punjab EPA.
Context:
${JSON.stringify(context, null, 2)}

User Question:
${question}

Provide a direct, authoritative, and scientifically rigorous answer addressing atmospheric chemistry, DIP satellite metrics, meteorological conditions in Punjab, and practical mitigation directives.`,
    });

    return res.json({ answer: response.text });
  } catch (error: any) {
    console.error('Error in chat API:', error);
    return res.status(500).json({ error: error.message || 'Chat generation error' });
  }
});

// Setup Vite or Static File Serving
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smog Monitoring System Server running on port ${PORT}`);
  });
}

start();
