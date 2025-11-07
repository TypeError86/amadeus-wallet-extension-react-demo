import { cn } from '@/lib/utils'

interface HeroProps {
	title: string
	subtitle: string
}

export function Hero({ title, subtitle }: HeroProps) {
	return (
		<header className="relative flex items-center gap-7 rounded-3xl border border-[rgba(0,240,222,0.25)] p-8 shadow-[0_35px_90px_rgba(3,12,27,0.65)] backdrop-blur">
			<div className="flex h-20 w-20 items-center justify-center rounded-2xl">
				<svg
					className="size-20"
					viewBox="0 0 64 64"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M31.9701 0L59.6571 16V48L31.9701 64L4.28318 48V16L31.9701 0Z"
						fill="url(#badge-base)"
					/>
					<path
						d="M30.9256 32.675L6.09375 18.3047V46.882L12.0409 50.316V29.1809L24.0415 36.5087V57.2448L30.9256 61.2352V32.675Z"
						fill="#00F0DE"
					/>
					<path
						d="M24.6266 50.4593L11.4766 42.9677L11.5107 35.7969L24.6266 43.3263V50.4593Z"
						fill="#00F0DE"
					/>
					<path
						d="M32.926 32.675L57.7578 18.3047V46.882L51.8106 50.316V29.1809L39.81 36.5087V57.2448L32.926 61.2352V32.675Z"
						fill="#00F0DE"
					/>
					<path
						d="M39.2328 50.4593L52.3828 42.9677L52.3486 35.7969L39.2328 43.3263V50.4593Z"
						fill="#00F0DE"
					/>
					<path
						d="M56.9141 16.4678L50.4756 20.2617L31.3926 9.22559L36.9102 16.8125L33.6914 18.6523L18.9766 15.7783L38.5195 27.1592L31.9668 30.8379L7.25 16.4678L18.4414 9.96094L26.2139 11.7549L22.3389 7.69434L31.9668 2.09766L56.9141 16.4678Z"
						fill="#00F0DE"
					/>
					<defs>
						<linearGradient
							id="badge-base"
							x1="12"
							y1="6"
							x2="54"
							y2="58"
							gradientUnits="userSpaceOnUse"
						>
							<stop stopColor="#061225" />
							<stop offset="1" stopColor="#0B0F1A" />
						</linearGradient>
					</defs>
				</svg>
			</div>
			<div className="space-y-2">
				<h1
					className={cn(
						'text-3xl font-semibold tracking-tight text-white md:text-[2.6rem]'
					)}
				>
					{title}
				</h1>
				<p className="max-w-2xl text-base text-slate-300/85 md:text-lg">{subtitle}</p>
			</div>
		</header>
	)
}
