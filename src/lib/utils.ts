import type { LogEntry } from '@/types'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

const AMA_DECIMALS = 9

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatHash(hash: string, startLength = 6, endLength = 4): string {
	if (!hash || hash.length <= startLength + endLength) {
		return hash
	}
	return `${hash.slice(0, startLength)}...${hash.slice(-endLength)}`
}

/**
 * Converts a decimal amount to atomic units (9 decimals for AMA)
 *
 * Example: 1.5 AMA = 1500000000 atomic units
 */
export function toAtomicUnits(amount: string): number {
	const numeric = Number(amount)
	if (Number.isNaN(numeric) || numeric <= 0) {
		throw new Error('Amount must be a positive number')
	}
	return Math.floor(numeric * 10 ** AMA_DECIMALS)
}

/**
 * Submits a signed transaction to the Amadeus network
 *
 * @param txPacked - The packed transaction bytes
 * @param txHash - The transaction hash
 * @param apiEndpoint - The API endpoint URL
 * @param addLog - Function to add log entries
 */
export async function submitTransaction(
	txPacked: number[],
	txHash: string,
	apiEndpoint: string,
	addLog: (level: LogEntry['level'], message: string) => void
): Promise<void> {
	addLog('info', `Submitting transaction ${txHash} to Amadeus node...`)
	const bytes = new Uint8Array(txPacked)
	const endpoint = apiEndpoint.replace(/\/$/, '')

	const response = await fetch(`${endpoint}/tx/submit`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/octet-stream',
			'User-Agent': 'amadeus-wallet-extension-react-demo/1.0.0'
		},
		body: bytes
	})

	if (!response.ok) {
		const errorText = await response.text()
		throw new Error(`HTTP ${response.status}: ${errorText}`)
	}

	const result = await response.json().catch(() => null)
	addLog('success', 'Transaction submitted successfully.')
	if (result) {
		addLog('info', `Node response: ${JSON.stringify(result)}`)
	}
}
