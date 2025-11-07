import {
	ConnectionPanel,
	CustomCallForm,
	EventLog,
	Hero,
	NetworkEndpointForm,
	StatusBanner,
	TransactionHistory,
	TransferForm
} from '@/components'
import { AppStateProvider } from '@/contexts/AppStateContext'
import { WalletProvider } from '@/contexts/WalletContext'
import { useStatusBanner } from '@/hooks'

/**
 * Main App Component
 *
 * This demo showcases how to integrate the Amadeus Wallet extension in a React application.
 *
 * Key integration points:
 * 1. WalletProvider - Provides wallet connection state
 * 2. AppStateProvider - Provides shared application state (logs, transactions)
 * 3. Components demonstrate different wallet operations
 */
function AppContent() {
	const uiStatus = useStatusBanner()

	return (
		<div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-12">
			<Hero
				title="Amadeus Wallet Demo"
				subtitle="Demo for the Amadeus Wallet extension integration in React"
			/>
			<StatusBanner variant={uiStatus.variant} message={uiStatus.text} />
			<div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
				<div className="space-y-6">
					<ConnectionPanel />
					<NetworkEndpointForm />
					<TransferForm />
					<CustomCallForm />
				</div>
				<TransactionHistory />
			</div>
			<EventLog />
		</div>
	)
}

function App() {
	return (
		<WalletProvider>
			<AppStateProvider>
				<AppContent />
			</AppStateProvider>
		</WalletProvider>
	)
}

export default App
