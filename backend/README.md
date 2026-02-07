# ServiceNet Backend Services

Backend infrastructure for ServiceNet - enabling API micropayments with zero gas fees.

## 📁 Structure

```
backend/
├── provider-sdk/          # Provider SDK for API monetization
│   ├── src/
│   │   └── index.ts      # Main SDK implementation
│   ├── package.json
│   └── README.md
├── services/
│   └── weather-api/      # Example Weather API service
│       ├── src/
│       │   └── index.ts  # Weather API implementation
│       ├── package.json
│       └── .env.example
├── test-client.ts        # Test client for API calls
└── README.md            # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install Provider SDK dependencies
cd provider-sdk
npm install
cd ..

# Install Weather API dependencies
cd services/weather-api
npm install
cd ..
```

### 2. Configure Environment

```bash
# Copy environment template
cd services/weather-api
cp .env.example .env

# Edit .env with your settings (optional for local testing)
```

### 3. Start Weather API Service

```bash
cd services/weather-api
npm run dev
```

The API will start on `http://localhost:3001`

### 4. Test the API

Open a new terminal:

```bash
cd backend
npx tsx test-client.ts
```

## 📚 Provider SDK

The Provider SDK enables any API to accept ServiceNet micropayments with just 3 lines of code.

### Features

- ✅ **Session Authentication** - Verify consumer signatures
- ✅ **Usage Metering** - Track API calls automatically
- ✅ **Billing Headers** - Transparent cost information
- ✅ **CORS Support** - Ready for web applications

### Example Usage

```typescript
import { ServiceNetSDK } from '@servicenet/provider-sdk';

const sdk = new ServiceNetSDK({
  ensName: 'myapi.eth',
  pricePerCall: 0.001 // $0.001 per call
});

const app = sdk.getApp();

// Apply middleware
app.use(sdk.authenticate());
app.use(sdk.meterUsage());

// Your API routes
app.get('/api/endpoint', (req, res) => {
  res.json({ data: 'Your data here' });
});

app.listen(3000);
```

## 🌤️ Weather API Service

Example service demonstrating ServiceNet integration.

### Endpoints

#### Public (No Authentication)

- `GET /health` - Health check
- `GET /info` - Service information

#### Protected (Requires Session)

- `GET /weather/:city` - Current weather
- `GET /weather/:city/forecast` - 7-day forecast
- `GET /weather/:city/hourly` - 24-hour hourly forecast

### Making Authenticated Requests

```bash
curl http://localhost:3001/weather/london \
  -H "x-session-id: 0x123..." \
  -H "x-session-signature: 0xabc..." \
  -H "x-consumer-address: 0xYourAddress"
```

### Response Headers

Every authenticated response includes:

- `X-ServiceNet-Calls-Made` - Total calls in session
- `X-ServiceNet-Price-Per-Call` - Price per call
- `X-ServiceNet-Total-Spent` - Total amount spent
- `X-ServiceNet-Provider` - Provider ENS name

## 🔐 Authentication Flow

1. **Consumer opens session** on ServiceNet frontend (1 on-chain tx)
2. **Consumer signs session ID** with wallet (off-chain)
3. **Consumer makes API call** with signed headers (off-chain, 0 gas)
4. **Provider verifies signature** with Provider SDK
5. **Provider returns data** with billing headers
6. **Repeat steps 3-5** for each call (all off-chain!)
7. **Session closes** and settles (1 on-chain tx)

## 💰 Cost Comparison

### Traditional On-Chain (Without ServiceNet)
```
Open Session:    $0.50 gas
Call 1:          $5.00 gas
Call 2:          $5.00 gas
Call 3:          $5.00 gas
...
Call 100:        $5.00 gas
Close Session:   $0.50 gas
───────────────────────
TOTAL:           $501 gas + $0.10 for calls = $501.10
```

### With ServiceNet
```
Open Session:    $0.01 gas
Call 1:          $0.00 gas ✨
Call 2:          $0.00 gas ✨
Call 3:          $0.00 gas ✨
...
Call 100:        $0.00 gas ✨
Close Session:   $0.01 gas
───────────────────────
TOTAL:           $0.02 gas + $0.10 for calls = $0.12
```

**Savings: 99.98% reduction in costs! 🎉**

## 🧪 Testing

### Run Test Client

```bash
npx tsx test-client.ts
```

This will:
1. Create a test session
2. Sign with test wallet
3. Make authenticated API calls
4. Display cost tracking

### Manual Testing with curl

```bash
# Get service info (no auth)
curl http://localhost:3001/info

# Health check
curl http://localhost:3001/health

# Authenticated call (replace with real signature)
curl http://localhost:3001/weather/london \
  -H "x-session-id: YOUR_SESSION_ID" \
  -H "x-session-signature: YOUR_SIGNATURE" \
  -H "x-consumer-address: YOUR_ADDRESS"
```

## 📦 Deployment

### Deploy to Railway

1. Create Railway account: https://railway.app
2. Install Railway CLI: `npm install -g @railway/cli`
3. Deploy Weather API:

```bash
cd services/weather-api
railway init
railway up
```

4. Set environment variables in Railway dashboard

### Deploy to Render

1. Create Render account: https://render.com
2. Connect your GitHub repo
3. Create new Web Service
4. Build command: `cd backend/services/weather-api && npm install && npm run build`
5. Start command: `cd backend/services/weather-api && npm start`

## 🔧 Development

### Build Provider SDK

```bash
cd provider-sdk
npm run build
```

### Watch Mode

```bash
npm run dev
```

### Clean Build

```bash
npm run clean
npm run build
```

## 📖 Integration Guide

### For New Services

1. **Install SDK**
   ```bash
   npm install @servicenet/provider-sdk
   ```

2. **Initialize SDK**
   ```typescript
   import { ServiceNetSDK } from '@servicenet/provider-sdk';
   
   const sdk = new ServiceNetSDK({
     ensName: 'yourservice.eth',
     pricePerCall: 0.001
   });
   ```

3. **Add Middleware**
   ```typescript
   app.use(sdk.authenticate());
   app.use(sdk.meterUsage());
   ```

4. **Register on ServiceNet**
   - Go to https://servicenet.app/provider/register
   - Register your ENS name
   - Set your price per call
   - Deploy your API

5. **Go Live**
   - Deploy your API with SDK integration
   - Consumers can now open sessions and use your API
   - You earn micropayments for each call!

