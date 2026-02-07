# ServiceNet Provider SDK

The official SDK for service providers to monetize their APIs with ServiceNet micropayments.

## Features

- 🔐 **Automatic Authentication** - Verify session signatures from consumers
- 📊 **Usage Metering** - Track API calls and costs automatically
- 💰 **Billing Headers** - Transparent cost information in every response
- 🚀 **Simple Integration** - Just 3 lines of code to get started

## Installation

```bash
npm install @servicenet/provider-sdk
```

## Quick Start

```typescript
import { ServiceNetSDK } from '@servicenet/provider-sdk';

// Initialize SDK
const sdk = new ServiceNetSDK({
  ensName: 'myapi.eth',
  pricePerCall: 0.001, // $0.001 per call
  enableCors: true
});

const app = sdk.getApp();

// Apply middleware
app.use(sdk.authenticate());
app.use(sdk.meterUsage());

// Your API routes
app.get('/api/data', (req, res) => {
  res.json({ data: 'Hello from ServiceNet!' });
});

app.listen(3000, () => {
  console.log('API running on port 3000');
});
```

## How It Works

1. **Consumer opens session** on ServiceNet frontend
2. **Consumer signs session** with their wallet
3. **Consumer makes API call** with headers:
   - `x-session-id`: Session identifier
   - `x-session-signature`: Signed session ID
   - `x-consumer-address`: Consumer's wallet address
4. **SDK verifies signature** and tracks usage
5. **API returns response** with billing headers

## Response Headers

Every successful API call includes:

- `X-ServiceNet-Calls-Made`: Total calls made in this session
- `X-ServiceNet-Price-Per-Call`: Price per call in USDC
- `X-ServiceNet-Total-Spent`: Total amount spent in this session
- `X-ServiceNet-Provider`: Your ENS name

## API Reference

### ServiceNetSDK

#### Constructor

```typescript
new ServiceNetSDK(config: ServiceNetSDKConfig)
```

**Config Options:**
- `ensName` (required): Your ENS name (e.g., "weather.api.eth")
- `pricePerCall` (required): Price per API call in USDC
- `apiEndpoint` (optional): Your API endpoint URL
- `enableCors` (optional): Enable CORS (default: true)

#### Methods

- `authenticate()`: Middleware for session authentication
- `meterUsage()`: Middleware for usage tracking
- `getSessionCallCount(sessionId)`: Get call count for a session
- `getSessionSpent(sessionId)`: Get total spent for a session
- `getSessionStats(sessionId)`: Get all stats for a session
- `getApp()`: Get the Express app instance

## Example Integration

See `backend/services/weather-api` for a complete example implementation.

## License

MIT
