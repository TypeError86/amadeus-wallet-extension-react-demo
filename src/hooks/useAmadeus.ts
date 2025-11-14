import { useCallback, useEffect, useMemo, useState } from 'react'

type ProviderStatus = 'checking' | 'not-found' | 'available'

interface UseAmadeusResult {
	provider: AmadeusProvider | null
	account: string | null
	status: ProviderStatus
	isConnecting: boolean
	isWalletUnlocked: boolean
	connect: () => Promise<void>
	disconnect: () => void
}

const PROVIDER_READY_EVENT = 'amadeus#initialized'
const ACCOUNTS_CHANGED_EVENT = 'accountsChanged'
const STATUS_REFRESH_INTERVAL_MS = 5000

const extractAccountFromProviderResults = (
	accountResult: PromiseSettledResult<string | null>,
	connectionResult: PromiseSettledResult<boolean | string>
): string | null => {
	if (accountResult.status === 'fulfilled' && accountResult.value) {
		return accountResult.value
	}
	if (connectionResult.status === 'fulfilled' && connectionResult.value) {
		return typeof connectionResult.value === 'string' ? connectionResult.value : null
	}
	return null
}

export function useAmadeus(): UseAmadeusResult {
	const [provider, setProvider] = useState<AmadeusProvider | null>(null)
	const [account, setAccount] = useState<string | null>(null)
	const [status, setStatus] = useState<ProviderStatus>('checking')
	const [isConnecting, setIsConnecting] = useState(false)
	const [isWalletUnlocked, setIsWalletUnlocked] = useState(false)

	const handleAccountsChanged = useCallback((accounts: unknown) => {
		if (!Array.isArray(accounts)) return
		if (accounts.length > 0) {
			setAccount(accounts[0] as string)
			setIsWalletUnlocked(true)
		} else {
			setAccount(null)
			setIsWalletUnlocked(false)
		}
	}, [])

	const tryDetectProvider = useCallback(async () => {
		if (typeof window === 'undefined') return

		if (window.amadeus && window.amadeus.isAmadeus) {
			const detectedProvider = window.amadeus
			setProvider(detectedProvider)
			setStatus('available')

			try {
				const existingAccount = await detectedProvider.getAccount()
				if (existingAccount) {
					setAccount(existingAccount)
					setIsWalletUnlocked(true)
				} else {
					setAccount(null)
					setIsWalletUnlocked(false)
				}
			} catch (error) {
				console.error('Failed to get account from Amadeus provider', error)
				setAccount(null)
				setIsWalletUnlocked(false)
			}
		} else {
			setStatus('not-found')
		}
	}, [])

	useEffect(() => {
		void tryDetectProvider()

		const onProviderReady = () => {
			void tryDetectProvider()
		}

		window.addEventListener(PROVIDER_READY_EVENT, onProviderReady)

		return () => {
			window.removeEventListener(PROVIDER_READY_EVENT, onProviderReady)
		}
	}, [tryDetectProvider])

	useEffect(() => {
		if (!provider) return

		const listener = (args: unknown) => handleAccountsChanged(args)
		provider.on(ACCOUNTS_CHANGED_EVENT, listener)

		return () => {
			provider.off(ACCOUNTS_CHANGED_EVENT, listener)
		}
	}, [handleAccountsChanged, provider])

	useEffect(() => {
		if (!provider) return

		let cancelled = false

		const updateWalletStatus = async () => {
			if (cancelled) return

			try {
				const [accountResult, connectionResult] = await Promise.allSettled([
					provider.getAccount(),
					provider.isConnected()
				])

				if (cancelled) return

				const account = extractAccountFromProviderResults(accountResult, connectionResult)
				setAccount(account)
				setIsWalletUnlocked(Boolean(account))
			} catch (error) {
				if (cancelled) return
				console.error('Failed to refresh wallet status', error)
				setAccount(null)
				setIsWalletUnlocked(false)
			}
		}

		const handleVisibilityChange = () => {
			if (document.visibilityState === 'visible' && !cancelled) {
				void updateWalletStatus()
			}
		}

		const intervalId = window.setInterval(updateWalletStatus, STATUS_REFRESH_INTERVAL_MS)
		document.addEventListener('visibilitychange', handleVisibilityChange)
		void updateWalletStatus()

		return () => {
			cancelled = true
			clearInterval(intervalId)
			document.removeEventListener('visibilitychange', handleVisibilityChange)
		}
	}, [provider])

	const connect = useCallback(async () => {
		if (!provider) throw new Error('Amadeus provider unavailable')
		setIsConnecting(true)
		try {
			const accounts = await provider.requestAccounts()
			if (accounts.length > 0) {
				setAccount(accounts[0])
				setIsWalletUnlocked(true)
			}
		} finally {
			setIsConnecting(false)
		}
	}, [provider])

	const disconnect = useCallback(() => {
		setAccount(null)
		setIsWalletUnlocked(false)
	}, [])

	return useMemo(
		() => ({
			provider,
			account,
			status,
			isConnecting,
			isWalletUnlocked,
			connect,
			disconnect
		}),
		[account, connect, disconnect, isConnecting, isWalletUnlocked, provider, status]
	)
}

export type { ProviderStatus }
