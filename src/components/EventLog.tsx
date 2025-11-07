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

/**
 * EventLog Component
 *
 * Displays console-style logs of wallet activity and transaction events.
 * Useful for debugging and understanding the wallet integration flow.
 */
export function EventLog() {
	const { eventLog } = useAppState()
	const { logs, clearLogs } = eventLog

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-white">Event Log</CardTitle>
				<CardDescription className="text-slate-300/80">
					Console-style output from the demo and the wallet bridge.
				</CardDescription>
				<CardAction>
					<Button
						variant="outline"
						size="sm"
						onClick={clearLogs}
						disabled={logs.length === 0}
					>
						Clear
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				<div className="max-h-72 overflow-y-auto rounded-2xl border border-[rgba(0,240,222,0.25)] p-4 font-mono text-xs text-slate-200/80 shadow-[inset_0_0_0_1px_rgba(0,240,222,0.12)]">
					{logs.length === 0 ? (
						<p className="text-slate-400/70">Activity logs will appear here.</p>
					) : (
						<ul className="space-y-2">
							{logs.map((log) => (
								<li key={log.id} className="whitespace-pre-wrap">
									<span className="text-slate-400/70">[{log.timestamp}]</span>{' '}
									<span className="text-slate-500/70">
										[{log.level.toUpperCase()}]
									</span>{' '}
									<span>{log.message}</span>
								</li>
							))}
						</ul>
					)}
				</div>
			</CardContent>
		</Card>
	)
}
