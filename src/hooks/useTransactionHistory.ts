import { useCallback, useState } from 'react'
import type { DemoTransaction, TransactionStatus } from '@/types'

/**
 * Hook for managing transaction history
 * Tracks signed transactions and their status
 */
export function useTransactionHistory() {
	const [transactions, setTransactions] = useState<DemoTransaction[]>([])

	const addTransaction = useCallback((tx: DemoTransaction) => {
		setTransactions((prev) => [tx, ...prev])
	}, [])

	const updateTransactionStatus = useCallback((hash: string, nextStatus: TransactionStatus) => {
		setTransactions((prev) =>
			prev.map((tx) => (tx.hash === hash ? { ...tx, status: nextStatus } : tx))
		)
	}, [])

	const clearTransactions = useCallback(() => {
		setTransactions([])
	}, [])

	return { transactions, addTransaction, updateTransactionStatus, clearTransactions }
}
