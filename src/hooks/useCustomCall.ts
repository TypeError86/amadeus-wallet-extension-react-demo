import { useAppState, useWallet } from '@/hooks'
import { useCallback, useState } from 'react'

/**
 * Hook for handling custom contract calls
 *
 * This hook demonstrates how to:
 * 1. Parse JSON arguments
 * 2. Sign arbitrary contract method calls
 * 3. Handle custom transaction signing
 */
export function useCustomCall() {
	const { provider, account, isConnected } = useWallet()
	const { eventLog, transactionHistory } = useAppState()
	const [isSubmitting, setIsSubmitting] = useState(false)

	const call = useCallback(
		async (contract: string, method: string, args: unknown[], description?: string) => {
			if (!provider || !account) {
				throw new Error('Wallet must be connected')
			}

			const txDescription = description || `${contract}.${method}`

			setIsSubmitting(true)

			try {
				const result = await provider.signTransaction({
					contract: contract.trim(),
					method: method.trim(),
					args,
					description: txDescription
				})

				eventLog.addLog('success', `Custom call signed. Hash: ${result.txHash}`)
				eventLog.addLog('info', `Packed payload bytes: ${result.txPacked.length}`)

				transactionHistory.addTransaction({
					hash: result.txHash,
					description: `${contract}.${method} (custom)`,
					status: 'success',
					timestamp: new Date().toLocaleString()
				})
			} catch (error) {
				const message = error instanceof Error ? error.message : 'Unknown error'
				eventLog.addLog('error', message)
				throw error
			} finally {
				setIsSubmitting(false)
			}
		},
		[provider, account, eventLog, transactionHistory]
	)

	return {
		call,
		isSubmitting,
		isConnected
	}
}
