import { privateKeyToAccount } from 'viem/accounts';

/**
 * Test client for Weather API
 * Tests the ServiceNet authentication and API calls
 */

const API_ENDPOINT = process.env.API_ENDPOINT || 'http://localhost:3001';

// Test private key
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';
const SESSION_ID = process.env.SESSION_ID || '';

async function testWeatherAPI() {
  console.log('🧪 Testing Weather API with ServiceNet SDK\n');
  console.log('═══════════════════════════════════════════\n');
  
  console.log('1️⃣  Setting up test account...');
  const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`);
  console.log(`   ✓ Address: ${account.address}\n`);
  
  console.log('2️⃣  Using existing session ID...');
  const sessionId = SESSION_ID;
  console.log(`   ✓ Session ID: ${sessionId}\n`);
  
  console.log('3️⃣  Signing session...');
  const message = `ServiceNet Session: ${sessionId}`;
  const signature = await account.signMessage({ message });
  console.log(`   ✓ Signature: ${signature.slice(0, 20)}...${signature.slice(-10)}\n`);
  
  console.log('4️⃣  Testing public endpoint /info...');
  try {
    const infoResponse = await fetch(`${API_ENDPOINT}/info`);
    const infoData = await infoResponse.json();
    console.log(`   ✓ Service: ${infoData.ensName}`);
    console.log(`   ✓ Price: $${infoData.pricePerCall} per call`);
    console.log(`   ✓ Endpoints: ${infoData.endpoints.length} available\n`);
  } catch (error) {
    console.error('   ✗ Failed to fetch service info:', error);
    console.error('   💡 Make sure Weather API is running: npm run dev:weather');
    return;
  }
  
  console.log('5️⃣  Testing authenticated endpoint /weather/london...');
  try {
    const weatherResponse = await fetch(`${API_ENDPOINT}/weather/london`, {
      headers: {
        'x-session-id': sessionId,
        'x-session-signature': signature,
        'x-consumer-address': account.address
      }
    });
    
    if (!weatherResponse.ok) {
      const error = await weatherResponse.json();
      console.error('   ✗ API call failed:', error);
      return;
    }
    
    const weatherData = await weatherResponse.json();
    const callsMade = weatherResponse.headers.get('X-ServiceNet-Calls-Made');
    const totalCost = weatherResponse.headers.get('X-ServiceNet-Total-Spent');
    const yellowEnabled = weatherResponse.headers.get('X-ServiceNet-Yellow-Enabled');
    const gasCost = weatherResponse.headers.get('X-ServiceNet-Gas-Cost');
    
    console.log(`   ✓ Weather: ${weatherData.data.current.temperature}°F, ${weatherData.data.current.conditions}`);
    console.log(`   ✓ Calls Made: ${callsMade}`);
    console.log(`   ✓ Total Cost: $${totalCost}`);
    if (yellowEnabled === 'true') {
      console.log(`   ⚡ Yellow Network: ENABLED | Gas Cost: ${gasCost} ETH`);
    }
    console.log('');
  } catch (error) {
    console.error('   ✗ API call failed:', error);
    return;
  }
  
  console.log('6️⃣  Making 5 additional API calls...');
  const cities = ['paris', 'tokyo', 'new-york', 'sydney', 'berlin'];
  
  for (let i = 0; i < cities.length; i++) {
    try {
      const response = await fetch(`${API_ENDPOINT}/weather/${cities[i]}`, {
        headers: {
          'x-session-id': sessionId,
          'x-session-signature': signature,
          'x-consumer-address': account.address
        }
      });
      
      const data = await response.json();
      const callsMade = response.headers.get('X-ServiceNet-Calls-Made');
      const totalCost = response.headers.get('X-ServiceNet-Total-Spent');
      
      console.log(`   ✓ Call #${callsMade}: ${data.data.city} - ${data.data.current.temperature}°F (Total: $${totalCost})`);
    } catch (error) {
      console.error(`   ✗ Call ${i + 1} failed:`, error);
    }
  }
  
  console.log('\n7️⃣  Testing forecast endpoint...');
  try {
    const forecastResponse = await fetch(`${API_ENDPOINT}/weather/london/forecast`, {
      headers: {
        'x-session-id': sessionId,
        'x-session-signature': signature,
        'x-consumer-address': account.address
      }
    });
    
    const forecastData = await forecastResponse.json();
    const callsMade = forecastResponse.headers.get('X-ServiceNet-Calls-Made');
    const totalCost = forecastResponse.headers.get('X-ServiceNet-Total-Spent');
    
    console.log(`   ✓ 7-day forecast retrieved`);
    console.log(`   ✓ Total calls: ${callsMade}`);
    console.log(`   ✓ Total spent: $${totalCost}\n`);
  } catch (error) {
    console.error('   ✗ Forecast call failed:', error);
  }
  
  console.log('═══════════════════════════════════════════');
  console.log('✅ All tests completed successfully!\n');
  console.log('💡 Key Takeaways:');
  console.log('   • Zero gas fees for API calls (Yellow Network)');
  console.log('   • Simple signature-based authentication');
  console.log('   • Transparent cost tracking in headers');
  console.log('   • Pay-per-use micropayments ($0.001/call)');
  console.log('   • Off-chain state updates, on-chain settlement only\n');
}

testWeatherAPI().catch(console.error);
