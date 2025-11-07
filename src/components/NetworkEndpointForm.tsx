import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppState } from '@/hooks'

const DEFAULT_API_URL = 'https://nodes.amadeus.bot/api'

/**
 * NetworkEndpointForm Component
 *
 * Allows configuring the API endpoint for transaction submission.
 * Useful for testing against different network nodes.
 */
export function NetworkEndpointForm() {
	const { networkEndpoint } = useAppState()
	const { apiEndpoint, setApiEndpoint } = networkEndpoint

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-white">Network Endpoint</CardTitle>
				<CardDescription className="text-slate-300/80">
					Point the demo at a different Amadeus node while testing locally.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-2">
				<Label htmlFor="api-endpoint">Node URL</Label>
				<Input
					id="api-endpoint"
					value={apiEndpoint}
					onChange={(event) => setApiEndpoint(event.target.value)}
					placeholder={DEFAULT_API_URL}
				/>
				<p className="text-xs text-slate-400/70">
					Transactions are POSTed to <code className="font-mono text-xs">/tx/submit</code>{' '}
					on this endpoint.
				</p>
			</CardContent>
		</Card>
	)
}
