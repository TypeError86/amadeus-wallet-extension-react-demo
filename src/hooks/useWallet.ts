import { WalletContext } from '@/contexts/WalletContext'
import type { ProviderStatus } from '@/hooks'
import { useContext } from 'react'

interface WalletContextValue {
	provider: ReturnType<typeof import('@/hooks/useAmadeus').useAmadeus>['provider']
	account: string | null
	status: ProviderStatus
	connect: () => Promise<void>
	disconnect: () => void
	isConnecting: boolean
	isWalletUnlocked: boolean
	isConnected: boolean
	isProviderAvailable: boolean
}

export function useWallet(): WalletContextValue {
	const context = useContext(WalletContext)
	if (!context) {
		throw new Error('useWallet must be used within WalletProvider')
	}
	return context
}
