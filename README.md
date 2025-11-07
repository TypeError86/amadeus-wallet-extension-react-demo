# Amadeus Wallet Extension Demo (React + Vite)

This project is a simple demo app to showcase how to integrate the **Amadeus Wallet** browser extension into a modern React application.

> **Highlights**
>
> - Detect the wallet provider and react to `accountsChanged`
> - Connect / disconnect flows using `requestAccounts`
> - Token transfers (sign & submit) with AMA token
> - Custom contract calls with arbitrary arguments
> - Transaction history and event logging panels
> - Configurable API endpoint for local node testing

## Prerequisites

- [Bun](https://bun.sh) (latest version)
- Amadeus Wallet extension installed in your browser
- Optional: Running Amadeus node (defaults to `https://nodes.amadeus.bot/api`)

## Getting Started

```bash
bun install
bun run dev
```

Open the displayed URL (default `http://localhost:5173`). Make sure the Amadeus Wallet extension is installed and unlocked.

## Project Structure

```
src/
├── components/         # React components
│   ├── ui/             # shadcn/ui components
│   ├── ConnectionPanel.tsx
│   ├── CustomCallForm.tsx
│   ├── EventLog.tsx
│   ├── Hero.tsx
│   ├── NetworkEndpointForm.tsx
│   ├── StatusBanner.tsx
│   ├── TransactionHistory.tsx
│   ├── TransferForm.tsx
│   └── index.ts        # Component barrel exports
├── contexts/           # React Context providers
│   ├── AppStateContext.tsx
│   └── WalletContext.tsx
├── hooks/              # Custom React hooks
│   ├── index.ts        # Hooks barrel exports
│   ├── useAmadeus.ts   # Core wallet integration hook
│   ├── useAppState.ts  # App state context hook
│   ├── useCustomCall.ts
│   ├── useEventLog.ts
│   ├── useNetworkEndpoint.ts
│   ├── useStatusBanner.ts
│   ├── useTransactionHistory.ts
│   ├── useTransfer.ts
│   └── useWallet.ts    # Wallet context hook
├── lib/                # Utility functions
│   └── utils.ts        # General utilities
├── types/              # TypeScript type definitions
│   ├── amadeus.d.ts    # Amadeus provider types
│   └── index.ts        # Shared types
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## Available Scenarios

### 1. Provider Detection

- Automatically checks for `window.amadeus`
- Listens for the `amadeus#initialized` DOM event for late injection
- Uses `provider.isConnected()` and `provider.getAccount()` on load
- Status banner shows real-time connection state

### 2. Account Management

- `Connect Wallet` calls `requestAccounts()` and renders the active account
- `Disconnect` clears local state (helpful for resetting the demo between tests)
- Reacts to `accountsChanged` to update the UI in real time
- Connection panel displays active account

### 3. Token Transfers

- Demonstrates signing and submitting AMA token transfers
- Converts human-readable AMA amounts into atomic units (9 decimals)
- Submits signed payloads to the configured node using raw packed bytes
- Transaction history tracks all signed transactions

### 4. Custom Contract Calls

- Accepts contract/method/args as JSON and pipes them into `signTransaction`
- Suitable for experimenting with non-token transactions
- Validates JSON input before submission

### 5. Observability

- Transaction panel keeps a local list of signed/submitted hashes with status
- Event log captures provider state changes, request lifecycle details, and errors
- Status banner provides real-time feedback on wallet connection state

## Amadeus Provider API

The wallet injects a provider at `window.amadeus`. Here's a quick reference of the available methods and events as used in this demo:

### Methods

```ts
if (window.amadeus?.isAmadeus) {
	const provider = window.amadeus

	// Check whether the wallet is unlocked and ready
	const unlocked = await provider.isConnected()

	// Read the active account (null if locked)
	const currentAccount = await provider.getAccount()

	// Request permission to access accounts (opens extension popup)
	const accounts = await provider.requestAccounts()

	// Sign any contract call and receive the packed transaction bytes
	const signed = await provider.signTransaction({
		contract: 'Coin',
		method: 'transfer',
		args: ['recipientBase58', '1000', 'AMA'],
		description: 'Transfer 1000 AMA'
	})

	console.log(signed.txHash, signed.txPacked)
}
```

### Events

```ts
function onAccountsChanged(accounts: unknown) {
	if (Array.isArray(accounts) && accounts.length > 0) {
		console.log('Primary account', accounts[0])
	}
}

window.amadeus?.on('accountsChanged', onAccountsChanged)

// ...later
window.amadeus?.off('accountsChanged', onAccountsChanged)
```

The React hooks (`useAmadeus`, `useWallet`) wrap all of the above, providing a declarative interface for components.

## Using the Hooks

### Wallet Connection

```tsx
import { useWallet } from '@/hooks'

function MyComponent() {
	const { account, connect, disconnect, isConnected } = useWallet()

	// Use wallet state and methods
}
```

### App State

```tsx
import { useAppState } from '@/hooks'

function MyComponent() {
	const { eventLog, transactionHistory, networkEndpoint } = useAppState()

	// Access shared app state
	eventLog.addLog('info', 'Something happened')
	transactionHistory.addTransaction({ ... })
}
```

### Transfer Operations

```tsx
import { useTransfer } from '@/hooks'

function TransferComponent() {
	const { transfer, isSubmitting, isConnected } = useTransfer()

	const handleTransfer = async () => {
		await transfer(recipient, amount, description)
	}
}
```

## Customising the Node Endpoint

Use the **Network Endpoint** input in the UI to point at a local or staging node. The value is persisted during the session and used for all transaction submissions.

## Scripts

- `bun run dev` – Start the Vite dev server
- `bun run build` – Production build (TypeScript check + Vite build)
- `bun run lint` – Run ESLint
- `bun run prettier:check` – Check code formatting
- `bun run prettier:format` – Format code with Prettier
- `bun run preview` – Preview production build

## Tech Stack

- **React 19** – UI framework
- **TypeScript** – Type safety
- **Vite** – Build tool and dev server
- **Tailwind CSS** – Styling
- **shadcn/ui** – UI component library
- **Bun** – Package manager and runtime
