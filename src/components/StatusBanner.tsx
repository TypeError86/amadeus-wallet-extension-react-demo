import { cn } from '@/lib/utils'
import type { StatusVariant } from '@/types'

const VARIANT_STYLES: Record<StatusVariant, string> = {
	success: 'border-[rgba(0,240,222,0.35)] bg-[rgba(0,240,222,0.12)] text-[#7DF5EC]',
	info: 'border-[rgba(0,240,222,0.35)] bg-[rgba(0,240,222,0.15)] text-[#7DF5EC]',
	warning: 'border-[rgba(255,184,77,0.35)] bg-[rgba(255,184,77,0.12)] text-[#FFE1B1]',
	error: 'border-[rgba(255,92,109,0.3)] bg-[rgba(255,92,109,0.2)] text-[#FF9CAA]',
	pending: 'border-[rgba(0,240,222,0.3)] bg-[rgba(0,240,222,0.1)] text-[#7DF5EC]'
}

export interface StatusBannerProps {
	variant: StatusVariant
	message: string
}

export function StatusBanner({ variant, message }: StatusBannerProps) {
	const baseClasses =
		'relative overflow-hidden rounded-xl border px-4 py-3 text-sm font-medium tracking-wide shadow-[0_12px_30px_rgba(0,240,222,0.08)] backdrop-blur'
	return (
		<div className={cn(baseClasses, VARIANT_STYLES[variant] ?? VARIANT_STYLES.info)}>
			{message}
		</div>
	)
}
