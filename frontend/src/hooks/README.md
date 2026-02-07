# Smart Contract Integration

This directory contains React hooks for interacting with ServiceNet smart contracts.

## Available Hooks

### ServiceNet Contract

**`useServiceNet()`** - Read operations
- `useGetService(ensNode)` - Get service details by node hash
- `useGetServiceByName(ensName)` - Get service details by ENS name
- `useGetServiceMetrics(ensNode)` - Get service metrics
- `useGetRating(ensNode)` - Get service rating
- `useGetTotalServices()` - Get total number of services
- `useGetProviderServices(address)` - Get services by provider
- `useHasRated(ensNode, user)` - Check if user rated service
- `useGetMinimumStake()` - Get minimum stake required

**`useServiceNetWrite()`** - Write operations
- `registerService(ensName, price, stake)` - Register new service
- `updatePrice(ensName, newPrice)` - Update service price
- `toggleService(ensName)` - Toggle service active status
- `submitRating(ensName, stars)` - Submit rating (1-5)
- `recordUsage(ensName, consumer, calls)` - Record usage

**`useService(ensName)`** - Combined hook
- Returns service details, metrics, rating, and loading states

### Yellow Session Manager

**`useYellowSessionManager()`** - Read operations
- `useGetSession(sessionId)` - Get session details
- `useGetSessionBalance(sessionId)` - Get session balance
- `useIsSessionActive(sessionId)` - Check if session is active
- `useGetUserSessions(address)` - Get all user sessions
- `useGetSessionCount()` - Get total session count

**`useYellowSessionWrite()`** - Write operations
- `openSession(ensName, allowance, duration)` - Open new session
- `closeSession(sessionId)` - Close session
- `recordUsage(sessionId, calls)` - Record usage

**`useYellowSession(sessionId)`** - Combined hook
- Returns session details, balance, and loading states

**`useUserSessions()`** - User sessions manager
- Returns all sessions for connected user

### USDC Token

**`useUSDC()`** - Read operations
- `useBalance(address)` - Get USDC balance
- `useAllowance(owner, spender)` - Get allowance
- `useMyBalance()` - Get connected user's balance
- `useYellowAllowance()` - Get allowance for YellowSessionManager

**`useUSDCWrite()`** - Write operations
- `approve(spender, amount)` - Approve spending
- `approveYellow(amount)` - Approve for YellowSessionManager
- `approveMax(spender)` - Approve unlimited

**`useUSDCOperations()`** - Combined hook
- Returns balance, allowance, and approval functions

**`useSessionApproval()`** - Approval flow manager
- `ensureApproval(amount)` - Check and approve if needed
- Returns approval state and status

## Usage Examples

### Reading Service Data

```typescript
import { useService } from '@/hooks';

function ServicePage({ ensName }: { ensName: string }) {
  const { service, formattedService, metrics, rating, isLoading } = useService(ensName);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{service?.ensName}</h1>
      <p>Price: {formattedService?.pricePerCallFormatted}</p>
      <p>Total Calls: {formattedService?.totalCallsFormatted}</p>
      <p>Rating: {rating?.averageRating}</p>
    </div>
  );
}
```

### Opening a Session

```typescript
import { useYellowSessionWrite, useSessionApproval } from '@/hooks';

function OpenSessionButton({ ensName, amount }: { ensName: string; amount: string }) {
  const { openSession, isPending, isConfirming, isSuccess } = useYellowSessionWrite();
  const { ensureApproval, approvalState } = useSessionApproval();

  const handleOpenSession = async () => {
    // First ensure USDC is approved
    await ensureApproval(amount);
    
    // Then open session (24 hours)
    await openSession(ensName, amount, 86400);
  };

  return (
    <button onClick={handleOpenSession} disabled={isPending || isConfirming}>
      {isPending ? 'Preparing...' : isConfirming ? 'Confirming...' : 'Open Session'}
    </button>
  );
}
```

### Checking USDC Balance

```typescript
import { useUSDCOperations } from '@/hooks';

function WalletBalance() {
  const { balance, balanceFormatted, allowance, needsApproval, isLoading } = useUSDCOperations();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <p>USDC Balance: ${balanceFormatted}</p>
      <p>Allowance: ${formatUSDC(allowance || 0n)}</p>
      {needsApproval && <button>Approve USDC</button>}
    </div>
  );
}
```

### Submitting a Rating

```typescript
import { useServiceNetWrite } from '@/hooks';

function RatingComponent({ ensName }: { ensName: string }) {
  const { submitRating, isPending, isSuccess } = useServiceNetWrite();

  const handleRate = async (stars: number) => {
    await submitRating(ensName, stars);
  };

  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} onClick={() => handleRate(star)}>
          {star} ⭐
        </button>
      ))}
      {isSuccess && <p>Rating submitted!</p>}
    </div>
  );
}
```

## Contract Addresses (Sepolia)

- Mock USDC: `0xC699822C6cADd3088A41DCC438E1b9F1C7D1c563`
- ServiceNet: `0xDcA1c9dEC72290F5df5aa54a360ea324e48Ff625`
- YellowSessionManager: `0x8Af5dF8FFF3375Ad85E8486f3F721D531075Ed3a`

## Type Safety

All hooks return properly typed data. Import types from `@/types/contracts`:

```typescript
import type { Service, Session, SessionBalance, FormattedService } from '@/types/contracts';
```

## Error Handling

All write hooks include error parsing:

```typescript
const { registerService, error } = useServiceNetWrite();

// error is a string with human-readable message
if (error) {
  console.error(error); // "Service already exists" instead of error code
}
```

## Utilities

Import utility functions from `@/lib/contracts`:

```typescript
import {
  namehash,          // Convert ENS name to bytes32
  formatUSDC,        // Format USDC amount
  parseUSDC,         // Parse USDC string to bigint
  formatService,     // Format service for display
  formatSession,     // Format session for display
  parseContractError // Parse contract errors
} from '@/lib/contracts';
```
