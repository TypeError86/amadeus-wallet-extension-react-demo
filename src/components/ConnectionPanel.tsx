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
import { useWallet } from '@/hooks'
import type { ConnectionBadge } from '@/types'
import { useCallback, useMemo } from 'react'

const BADGE_STYLES: Record<ConnectionBadge['tone'], string> = {
	success: 'border-[rgba(0,240,222,0.35)] bg-[rgba(0,240,222,0.15)] text-[#7DF5EC]',
	warning: 'border-[rgba(255,184,77,0.35)] bg-[rgba(255,184,77,0.15)] text-[#FFDCA6]',
	error: 'border-[rgba(255,92,109,0.3)] bg-[rgba(255,92,109,0.2)] text-[#FF9CAA]',
	info: 'border-[rgba(0,240,222,0.35)] bg-[rgba(0,240,222,0.15)] text-[#7DF5EC]'
}

/**
 * ConnectionPanel Component
 *
 * Demonstrates how to:
 * 1. Check if the wallet extension is available
 * 2. Connect to the wallet (request account access)
 * 3. Display the active account
 * 4. Disconnect from the wallet
 */
export function ConnectionPanel() {
	const {
		account,
		connect,
		disconnect,
		isConnecting,
		isConnected,
		isProviderAvailable,
		isWalletUnlocked
	} = useWallet()

	const badge = useMemo<ConnectionBadge>(() => {
		if (!isProviderAvailable) {
			return { tone: 'error', label: 'Wallet missing' }
		}
		if (!isWalletUnlocked) {
			return { tone: 'warning', label: 'Wallet locked' }
		}
		if (!isConnected) {
			return { tone: 'info', label: 'Ready to connect' }
		}
		return { tone: 'success', label: 'Connected' }
	}, [isConnected, isProviderAvailable, isWalletUnlocked])

	const handleConnect = useCallback(async () => {
		try {
			await connect()
		} catch (error) {
			console.error('Connection failed:', error)
		}
	}, [connect])

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-white">Connection</CardTitle>
				<CardDescription className="text-slate-300/80">
					Manage extension access and monitor the active account.
				</CardDescription>
				<CardAction>
					<Badge variant="outline" className={BADGE_STYLES[badge.tone]}>
						{badge.label}
					</Badge>
				</CardAction>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="flex flex-wrap items-center gap-3">
					<Button
						onClick={handleConnect}
						disabled={!isProviderAvailable || isConnected || isConnecting}
					>
						{isConnecting ? 'Connecting…' : 'Connect Wallet'}
					</Button>
					<Button variant="secondary" onClick={disconnect} disabled={!isConnected}>
						Disconnect
					</Button>
				</div>
				{account && (
					<div className="rounded-2xl border border-[rgba(0,240,222,0.3)] px-4 py-3">
						<p className="text-xs font-semibold tracking-[0.32em] text-slate-400/70 uppercase">
							Active Account
						</p>
						<p className="mt-2 font-mono text-sm text-[#7DF5EC]">{account}</p>
					</div>
				)}
			</CardContent>
		</Card>
	)
}
