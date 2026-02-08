import { ServiceNetSDK, AuthenticatedRequest } from '@servicenet/provider-sdk';
import { Response } from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Check if Yellow Network should be enabled
const enableYellow = process.env.YELLOW_ENABLED === 'true';
const yellowConfig = enableYellow ? {
  endpoint: process.env.YELLOW_ENDPOINT || 'wss://clearnet-sandbox.yellow.com/ws',
  privateKey: process.env.PROVIDER_PRIVATE_KEY as `0x${string}` | undefined,
  rpcUrl: process.env.RPC_URL,
  enableTestMode: false // Use test mode for now (mock Yellow Network)
} : undefined;

// Initialize ServiceNet SDK
const sdk = new ServiceNetSDK({
  ensName: 'weather.api.eth',
  pricePerCall: 0.001, // $0.001 per call
  apiEndpoint: process.env.API_ENDPOINT || 'http://localhost:3001',
  enableCors: true,
  enableYellow,
  yellowConfig
});

const app = sdk.getApp();

// ==========================================
// Public Routes (No Authentication)
// ==========================================

/**
 * GET /health
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'weather.api.eth',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

/**
 * GET /info
 * Service information (no auth required)
 */
app.get('/info', (req, res) => {
  res.json({
    ensName: 'weather.api.eth',
    pricePerCall: 0.001,
    currency: 'USDC',
    endpoints: [
      { 
        path: '/weather/:city', 
        method: 'GET', 
        description: 'Get current weather for a city',
        example: '/weather/london'
      },
      { 
        path: '/weather/:city/forecast', 
        method: 'GET', 
        description: 'Get 7-day forecast for a city',
        example: '/weather/san-francisco/forecast'
      },
      {
        path: '/weather/:city/hourly',
        method: 'GET',
        description: 'Get 24-hour hourly forecast',
        example: '/weather/tokyo/hourly'
      }
    ],
    authentication: {
      type: 'ServiceNet Session',
      headers: ['x-session-id', 'x-session-signature', 'x-consumer-address'],
      documentation: 'https://servicenet.app/docs/authentication'
    },
    features: [
      'Real-time weather data',
      '7-day forecasts',
      'Hourly predictions',
      'Global coverage (1000+ cities)',
      'Micropayment enabled ($0.001 per call)'
    ]
  });
});

/**
 * GET /session/:sessionId/stats
 * Get real-time session statistics (no auth required)
 * This provides off-chain call tracking via Yellow Network
 */
app.get('/session/:sessionId/stats', (req, res) => {
  const { sessionId } = req.params;
  
  const stats = sdk.getSessionStats(sessionId);
  
  res.json({
    sessionId,
    callsMade: stats.callsMade,
    totalSpent: stats.totalSpent,
    pricePerCall: stats.pricePerCall,
    yellowEnabled: sdk.isYellowEnabled(),
    lastUpdated: new Date().toISOString()
  });
});

// ==========================================
// Protected Routes (Require Authentication)
// ==========================================

// Apply authentication and metering middleware
app.use(sdk.authenticate());
app.use(sdk.meterUsage());

/**
 * GET /weather/:city
 * Get current weather for a city
 */
app.get('/weather/:city', async (req: AuthenticatedRequest, res: Response) => {
  const { city } = req.params;
  
  // Mock weather data (in production, call a real weather API)
  const weatherData = {
    city: formatCityName(city),
    country: getMockCountry(city),
    coordinates: {
      lat: (Math.random() * 180 - 90).toFixed(4),
      lon: (Math.random() * 360 - 180).toFixed(4)
    },
    current: {
      temperature: Math.floor(Math.random() * 30) + 50, // 50-80°F
      feelsLike: Math.floor(Math.random() * 30) + 50,
      conditions: getRandomConditions(),
      humidity: Math.floor(Math.random() * 50) + 30, // 30-80%
      windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 mph
      windDirection: getRandomDirection(),
      pressure: Math.floor(Math.random() * 30) + 990, // 990-1020 mb
      visibility: Math.floor(Math.random() * 5) + 5, // 5-10 miles
      uvIndex: Math.floor(Math.random() * 11), // 0-10
      dewPoint: Math.floor(Math.random() * 20) + 40
    },
    timestamp: new Date().toISOString(),
    sunrise: getTimeToday(6, 30),
    sunset: getTimeToday(18, 45)
  };
  
  res.json({
    success: true,
    data: weatherData,
    provider: 'weather.api.eth',
    cached: false
  });
});

/**
 * GET /weather/:city/forecast
 * Get 7-day forecast
 */
app.get('/weather/:city/forecast', async (req: AuthenticatedRequest, res: Response) => {
  const { city } = req.params;
  
  const forecast = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
    return {
      date: date.toISOString().split('T')[0],
      dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'long' }),
      high: Math.floor(Math.random() * 20) + 70, // 70-90°F
      low: Math.floor(Math.random() * 20) + 50, // 50-70°F
      conditions: getRandomConditions(),
      precipitation: Math.floor(Math.random() * 100), // 0-100%
      humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
      windSpeed: Math.floor(Math.random() * 15) + 5, // 5-20 mph
      uvIndex: Math.floor(Math.random() * 11)
    };
  });
  
  res.json({
    success: true,
    data: {
      city: formatCityName(city),
      forecast,
      generatedAt: new Date().toISOString()
    },
    provider: 'weather.api.eth'
  });
});

/**
 * GET /weather/:city/hourly
 * Get 24-hour hourly forecast
 */
app.get('/weather/:city/hourly', async (req: AuthenticatedRequest, res: Response) => {
  const { city } = req.params;
  
  const hourly = Array.from({ length: 24 }, (_, i) => {
    const hour = new Date(Date.now() + i * 60 * 60 * 1000);
    return {
      time: hour.toISOString(),
      hour: hour.getHours(),
      temperature: Math.floor(Math.random() * 15) + 60, // 60-75°F
      conditions: getRandomConditions(),
      precipitation: Math.floor(Math.random() * 100), // 0-100%
      windSpeed: Math.floor(Math.random() * 15) + 5,
      humidity: Math.floor(Math.random() * 30) + 50
    };
  });
  
  res.json({
    success: true,
    data: {
      city: formatCityName(city),
      hourly,
      generatedAt: new Date().toISOString()
    },
    provider: 'weather.api.eth'
  });
});

/**
 * GET /session/:sessionId/stats
 * Get usage statistics for a session
 */
app.get('/session/:sessionId/stats', (req: AuthenticatedRequest, res: Response) => {
  const { sessionId } = req.params;
  
  const stats = sdk.getSessionStats(sessionId);
  
  res.json({
    success: true,
    data: {
      sessionId,
      ...stats
    }
  });
});

// ==========================================
// Helper Functions
// ==========================================

function formatCityName(city: string): string {
  return city
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function getMockCountry(city: string): string {
  const countries: Record<string, string> = {
    'london': 'United Kingdom',
    'paris': 'France',
    'tokyo': 'Japan',
    'new-york': 'United States',
    'san-francisco': 'United States',
    'sydney': 'Australia',
    'berlin': 'Germany',
    'toronto': 'Canada'
  };
  return countries[city.toLowerCase()] || 'Unknown';
}

function getRandomConditions(): string {
  const conditions = [
    'Sunny',
    'Partly Cloudy',
    'Cloudy',
    'Overcast',
    'Light Rain',
    'Rain',
    'Heavy Rain',
    'Thunderstorms',
    'Fog',
    'Clear'
  ];
  return conditions[Math.floor(Math.random() * conditions.length)];
}

function getRandomDirection(): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.floor(Math.random() * directions.length)];
}

function getTimeToday(hour: number, minute: number): string {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

// ==========================================
// Error Handling
// ==========================================

app.use((err: any, req: any, res: any, next: any) => {
  console.error('[Weather API] Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// ==========================================
// Server Startup
// ==========================================

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  const yellowStatus = sdk.isYellowEnabled() ? '🟢 Enabled (Test Mode)' : '🔴 Disabled';
  const gasInfo = sdk.isYellowEnabled() ? '⚡ 0 gas per call' : '⛽ Standard gas';
  
  console.log(`
╔════════════════════════════════════════════════════╗
║                                                    ║
║     🌤️  Weather API - ServiceNet Provider         ║
║                                                    ║
╠════════════════════════════════════════════════════╣
║                                                    ║
║  ENS Name:    weather.api.eth                      ║
║  Endpoint:    http://localhost:${PORT}               ║
║  Price:       $0.001 per call                      ║
║  Status:      🟢 Active                             ║
║  Yellow:      ${yellowStatus}                   ║
║  Gas Cost:    ${gasInfo}                     ║
║                                                    ║
╠════════════════════════════════════════════════════╣
║                                                    ║
║  Public Endpoints:                                 ║
║    GET /health      - Health check                 ║
║    GET /info        - Service information          ║
║                                                    ║
║  Protected Endpoints (requires session):           ║
║    GET /weather/:city                              ║
║    GET /weather/:city/forecast                     ║
║    GET /weather/:city/hourly                       ║
║                                                    ║
╠════════════════════════════════════════════════════╣
║                                                    ║
║  Example Request:                                  ║
║                                                    ║
║  curl http://localhost:${PORT}/weather/london \\     ║
║    -H "x-session-id: 0x123..." \\                  ║
║    -H "x-session-signature: 0xabc..." \\           ║
║    -H "x-consumer-address: 0xYourAddress"          ║
║                                                    ║
╚════════════════════════════════════════════════════╝
  `);
});
