import { memo, PropsWithChildren, useCallback } from 'react'
import { Group, RectShape } from '@/ui-engine'
import { VibrationEffect } from './vibration-effect'
import { ParticleEffect } from './particular-effect'

interface ExplosionEffectProps extends PropsWithChildren {
	id: string
	size: number
	duration: number
	x: number
	y: number
	power?: number
	onComplete: (id: string) => void
}

export const ExplosionEffect = memo(
	({
		id,
		x,
		y,
		size,
		children,
		duration,
		power = 10,
		onComplete,
	}: ExplosionEffectProps) => {
		const vibrationId = `${id}-vibration`
		const particleId = `${id}-particles`

		return (
			<>
				<Group x={x} y={y}>
					<RectShape
						x={0}
						y={0}
						width={size}
						height={size}
						fillColor="orange"
						opacity={0.1}
					/>

					<VibrationEffect
						id={vibrationId}
						x={0}
						y={0}
						duration={duration}
						onComplete={useCallback(() => {}, [])}
					>
						{children}
					</VibrationEffect>

					<ParticleEffect
						id={particleId}
						cx={size / 2}
						cy={size / 2}
						duration={2000}
						particleCount={power}
						onComplete={onComplete}
					/>
				</Group>
			</>
		)
	}
)
