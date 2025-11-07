import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card'
import { useAppState } from '@/hooks'
import { formatHash } from '@/lib/utils'
import type { DemoTransaction } from '@/types'

const STATUS_STYLES: Record<DemoTransaction['status'], string> = {
	success: 'border-[rgba(0,240,222,0.35)] bg-[rgba(0,240,222,0.15)] text-[#7DF5EC]',
	pending: 'border-[rgba(0,240,222,0.3)] bg-[rgba(0,240,222,0.15)] text-[#7DF5EC]',
	error: 'border-[rgba(255,92,109,0.3)] bg-[rgba(255,92,109,0.2)] text-[#FF9CAA]'
}

/**
 * TransactionHistory Component
 *
 * Displays a list of signed transactions with their status.
 * Shows transaction hash, description, and current status.
 */
export function TransactionHistory() {
	const { transactionHistory } = useAppState()
	const { transactions, clearTransactions } = transactionHistory

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-white">Recent Transactions</CardTitle>
				<CardDescription className="text-slate-300/80">
					Signed payloads appear here with their latest status.
				</CardDescription>
				<CardAction>
					<Button
						variant="outline"
						size="sm"
						onClick={clearTransactions}
						disabled={transactions.length === 0}
					>
						Clear
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				{transactions.length === 0 ? (
					<p className="rounded-xl border border-[rgba(0,240,222,0.2)] px-4 py-6 text-sm text-slate-300/70">
						Transactions will appear here after you sign them.
					</p>
				) : (
					<ul className="space-y-3">
						{transactions.map((tx) => (
							<li
								key={tx.hash}
								className="rounded-xl border border-[rgba(0,240,222,0.25)] p-4"
							>
								<div className="flex items-center justify-between gap-3">
									<p className="text-sm font-medium text-white">
										{tx.description}
									</p>
									<Badge variant="outline" className={STATUS_STYLES[tx.status]}>
										{tx.status.toUpperCase()}
									</Badge>
								</div>
								<p className="mt-2 font-mono text-xs text-slate-300/70">
									{formatHash(tx.hash)}
								</p>
								<p className="mt-1 text-[11px] text-slate-400/70">{tx.timestamp}</p>
							</li>
						))}
					</ul>
				)}
			</CardContent>
		</Card>
	)
}
