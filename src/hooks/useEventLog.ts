import { useCallback, useState } from 'react'
import type { LogEntry } from '@/types'

/**
 * Hook for managing event logs
 * Useful for debugging and showing user activity
 */
export function useEventLog() {
	const [logs, setLogs] = useState<LogEntry[]>([])

	const addLog = useCallback((level: LogEntry['level'], message: string) => {
		const timestamp = new Date().toLocaleTimeString()
		setLogs((prev) => {
			const entry: LogEntry = {
				id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
				timestamp,
				level,
				message
			}
			return [entry, ...prev].slice(0, 200)
		})
		console[level === 'error' ? 'error' : level === 'warning' ? 'warn' : 'log'](
			`[${level}] ${message}`
		)
	}, [])

	const clearLogs = useCallback(() => {
		setLogs([])
	}, [])

	return { logs, addLog, clearLogs }
}
