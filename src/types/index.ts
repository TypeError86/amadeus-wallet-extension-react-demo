export type LogLevel = 'info' | 'success' | 'warning' | 'error'

export type StatusVariant = LogLevel | 'pending'

export type TransactionStatus = 'pending' | 'success' | 'error'

export interface LogEntry {
	id: string
	timestamp: string
	level: LogLevel
	message: string
}

export interface DemoTransaction {
	hash: string
	description: string
	status: TransactionStatus
	timestamp: string
}

export interface StatusBanner {
	tone: StatusVariant
	text: string
}

export interface TransferFormState {
	recipient: string
	amount: string
	description: string
}

export interface CustomCallState {
	contract: string
	method: string
	argsText: string
}

export interface ConnectionBadge {
	tone: 'success' | 'warning' | 'error' | 'info'
	label: string
}
