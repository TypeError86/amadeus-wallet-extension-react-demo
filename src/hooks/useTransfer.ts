import { useAppState, useWallet } from '@/hooks'
import { submitTransaction, toAtomicUnits } from '@/lib/utils'
import { useCallback, useState } from 'react'

const AMA_TOKEN = 'AMA'

/**
 * Hook for handling AMA token transfers
 *
 * This hook demonstrates how to:
 * 1. Convert amounts to atomic units (9 decimals)
 * 2. Sign transactions using the wallet provider
 * 3. Submit transactions to the network
 */
export function useTransfer() {
	const { provider, account, isConnected } = useWallet()
	const { eventLog, transactionHistory, networkEndpoint } = useAppState()
	const [isSubmitting, setIsSubmitting] = useState(false)

	const transfer = useCallback(
		async (recipient: string, amount: string, description?: string) => {
			if (!provider || !account) {
				throw new Error('Wallet must be connected')
			}

			const recipientAddress = recipient.trim() || account
			const atomicAmount = toAtomicUnits(amount)
			const txDescription = description?.trim() || `Transfer ${amount} ${AMA_TOKEN}`

			eventLog.addLog('info', `Preparing transfer to ${recipientAddress}`)
			eventLog.addLog('info', `Amount (${AMA_TOKEN}): ${amount}`)
			eventLog.addLog('info', `Atomic amount: ${atomicAmount}`)

			setIsSubmitting(true)

			try {
				// Step 1: Sign the transaction
				const result = await provider.signTransaction({
					contract: 'Coin',
					method: 'transfer',
					args: [recipientAddress, atomicAmount.toString(), AMA_TOKEN],
					description: txDescription
				})

				eventLog.addLog('success', `Transaction signed. Hash: ${result.txHash}`)
				eventLog.addLog('info', `Packed payload bytes: ${result.txPacked.length}`)

				// Step 2: Add to transaction history
				transactionHistory.addTransaction({
					hash: result.txHash,
					description: txDescription,
					status: 'pending',
					timestamp: new Date().toLocaleString()
				})

				// Step 3: Submit to network
				try {
					await submitTransaction(
						result.txPacked,
						result.txHash,
						networkEndpoint.apiEndpoint,
						eventLog.addLog
					)
					transactionHistory.updateTransactionStatus(result.txHash, 'success')
					eventLog.addLog('success', 'Transaction submitted successfully.')
				} catch (error) {
					const message = error instanceof Error ? error.message : 'Failed to submit'
					transactionHistory.updateTransactionStatus(result.txHash, 'error')
					eventLog.addLog('error', `Network submission failed: ${message}`)
					throw error
				}
			} catch (error) {
				const message = error instanceof Error ? error.message : 'Unknown error'
				eventLog.addLog('error', message)
				throw error
			} finally {
				setIsSubmitting(false)
			}
		},
		[provider, account, eventLog, transactionHistory, networkEndpoint]
	)

	return {
		transfer,
		isSubmitting,
		isConnected
	}
}
