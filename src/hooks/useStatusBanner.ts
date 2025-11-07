import { useAppState, useWallet } from '@/hooks'
import type { StatusVariant } from '@/types'
import { useEffect, useMemo, useRef } from 'react'

/**
 * Hook for managing the status banner display
 * Automatically updates based on wallet connection state
 */
export function useStatusBanner() {
	const { status, isConnected, account } = useWallet()
	const { eventLog } = useAppState()
	const { addLog } = eventLog
	const previousStatusRef = useRef(status)
	const previousAccountRef = useRef<string | null>(null)

	const uiStatus = useMemo<{ variant: StatusVariant; text: string }>(() => {
		if (status === 'checking') {
			return { variant: 'pending', text: 'Checking for Amadeus Wallet provider...' }
		}
		if (status === 'not-found') {
			return {
				variant: 'error',
				text: 'Amadeus Wallet extension not detected. Install it and refresh this demo.'
			}
		}
		if (status === 'available' && !isConnected) {
			return {
				variant: 'info',
				text: 'Wallet detected. Click Connect Wallet to begin.'
			}
		}
		if (status === 'available' && isConnected) {
			return { variant: 'success', text: 'Connected to Amadeus Wallet.' }
		}
		return { variant: 'pending', text: 'Checking for Amadeus Wallet provider...' }
	}, [status, isConnected])

	// Log provider status changes
	useEffect(() => {
		if (previousStatusRef.current !== status) {
			if (status === 'available') {
				addLog('success', 'Amadeus Wallet provider detected.')
			} else if (status === 'not-found') {
				addLog('error', 'Amadeus Wallet provider not found on window.')
			}
			previousStatusRef.current = status
		}
	}, [addLog, status])

	// Log account changes
	useEffect(() => {
		if (previousAccountRef.current !== account) {
			if (account) {
				addLog('info', `Active account: ${account}`)
			} else {
				addLog('warning', 'No active account selected.')
			}
			previousAccountRef.current = account ?? null
		}
	}, [account, addLog])

	return uiStatus
}
