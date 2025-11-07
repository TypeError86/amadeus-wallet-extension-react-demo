import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCustomCall } from '@/hooks'
import { useState } from 'react'

/**
 * CustomCallForm Component
 *
 * Demonstrates how to sign arbitrary contract method calls.
 *
 * Key concepts:
 * - JSON argument parsing
 * - Custom contract method calls
 * - Flexible transaction signing
 */
export function CustomCallForm() {
	const { call, isSubmitting, isConnected } = useCustomCall()

	const [contract, setContract] = useState('Coin')
	const [method, setMethod] = useState('transfer')
	const [argsText, setArgsText] = useState('["recipientBase58", "1000", "AMA"]')

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		if (!isConnected) {
			return
		}

		let args: unknown[]
		try {
			const parsed = JSON.parse(argsText)
			if (!Array.isArray(parsed)) {
				throw new Error('Arguments must be a JSON array')
			}
			args = parsed
		} catch {
			// Invalid JSON - skip submission
			return
		}

		try {
			await call(contract, method, args)
		} catch {
			// Error is already logged by the hook
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-white">Custom Contract Calls</CardTitle>
				<CardDescription className="text-slate-300/80">
					Try arbitrary contract interactions using the wallet's signer.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form className="space-y-4" onSubmit={handleSubmit}>
					<div className="grid gap-3 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="contract">Contract</Label>
							<Input
								id="contract"
								value={contract}
								onChange={(event) => setContract(event.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="method">Method</Label>
							<Input
								id="method"
								value={method}
								onChange={(event) => setMethod(event.target.value)}
								required
							/>
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor="args">Arguments (JSON array)</Label>
						<Textarea
							id="args"
							value={argsText}
							onChange={(event) => setArgsText(event.target.value)}
							rows={4}
						/>
						<p className="text-xs text-slate-400/70">
							Example:{' '}
							<code className="font-mono text-xs">["recipient", "1000", "AMA"]</code>
						</p>
					</div>
					<div>
						<Button type="submit" disabled={!isConnected || isSubmitting}>
							{isSubmitting ? 'Awaiting signature…' : 'Sign Custom Call'}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}
