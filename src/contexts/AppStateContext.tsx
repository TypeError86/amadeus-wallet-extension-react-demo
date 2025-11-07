import { useEventLog, useNetworkEndpoint, useTransactionHistory } from '@/hooks'
import { createContext, type ReactNode } from 'react'

interface AppStateContextValue {
	eventLog: ReturnType<typeof useEventLog>
	transactionHistory: ReturnType<typeof useTransactionHistory>
	networkEndpoint: ReturnType<typeof useNetworkEndpoint>
}

const AppStateContext = createContext<AppStateContextValue | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
	const eventLog = useEventLog()
	const transactionHistory = useTransactionHistory()
	const networkEndpoint = useNetworkEndpoint()

	return (
		<AppStateContext.Provider
			value={{
				eventLog,
				transactionHistory,
				networkEndpoint
			}}
		>
			{children}
		</AppStateContext.Provider>
	)
}

export { AppStateContext }
