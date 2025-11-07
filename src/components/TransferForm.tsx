import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTransfer } from '@/hooks'
import { useState } from 'react'

/**
 * TransferForm Component
 *
 * Demonstrates how to create a form for signing and submitting AMA token transfers.
 *
 * Key concepts:
 * - Form state management
 * - Wallet integration via useTransfer hook
 * - Transaction signing and submission
 */
export function TransferForm() {
	const { transfer, isSubmitting, isConnected } = useTransfer()

	const [recipient, setRecipient] = useState('')
	const [amount, setAmount] = useState('0.001')
	const [description, setDescription] = useState('')

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		if (!isConnected) {
			return
		}

		try {
			await transfer(recipient, amount, description)
		} catch {
			// Error is already logged by the hook
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-white">Token Transfer</CardTitle>
				<CardDescription className="text-slate-300/80">
					Sign a Coin transfer transaction using the Amadeus Wallet.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form className="space-y-4" onSubmit={handleSubmit}>
					<div className="space-y-2">
						<Label htmlFor="recipient">Recipient (Base58)</Label>
						<Input
							id="recipient"
							value={recipient}
							onChange={(event) => setRecipient(event.target.value)}
							placeholder="Leave empty to send to self"
							autoComplete="off"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="amount">Amount (AMA)</Label>
						<Input
							id="amount"
							type="number"
							min="0"
							step="0.000000001"
							value={amount}
							onChange={(event) => setAmount(event.target.value)}
							required
						/>
					</div>
					<p className="text-xs text-slate-400/70">
						Amounts are converted into atomic units (9 decimals) before signing.
					</p>
					<div className="space-y-2">
						<Label htmlFor="description">Description (optional)</Label>
						<Input
							id="description"
							value={description}
							onChange={(event) => setDescription(event.target.value)}
							placeholder="e.g. Payment for services"
						/>
					</div>
					<div>
						<Button type="submit" disabled={!isConnected || isSubmitting}>
							{isSubmitting ? 'Processing…' : 'Sign & Submit Transaction'}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}
