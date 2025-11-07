import { AppStateContext } from '@/contexts/AppStateContext'
import { useContext } from 'react'

interface AppStateContextValue {
	eventLog: ReturnType<typeof import('@/hooks/useEventLog').useEventLog>
	transactionHistory: ReturnType<
		typeof import('@/hooks/useTransactionHistory').useTransactionHistory
	>
	networkEndpoint: ReturnType<typeof import('@/hooks/useNetworkEndpoint').useNetworkEndpoint>
}

export function useAppState(): AppStateContextValue {
	const context = useContext(AppStateContext)
	if (!context) {
		throw new Error('useAppState must be used within AppStateProvider')
	}
	return context
}
