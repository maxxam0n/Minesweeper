import { memo, PropsWithChildren, useCallback } from 'react'
import { Group, RectShape } from '@/ui-engine'
import { VibrationEffect } from './vibration-effect'
import { ParticleEffect } from './particular-effect'

interface ExplosionEffectProps extends PropsWithChildren {
	id: string
	size: number
	onComplete: (id: string) => void
	duration: number
	x: number
	y: number
}

export const ExplosionEffect = memo(
	({
		id,
		onComplete,
		x,
		y,
		size,
		children,
		duration,
	}: ExplosionEffectProps) => {
		const vibrationId = `${id}-vibration`
		const particleId = `${id}-particles`

		const handleSubEffectComplete = useCallback(
			(completedId: string) => {
				if (completedId === particleId) onComplete(id)
			},
			[onComplete]
		)

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
				</Group>

				<ParticleEffect
					id={particleId}
					onComplete={handleSubEffectComplete}
					cx={x + size / 2}
					cy={y + size / 2}
					duration={2000}
					particleCount={30}
				/>
			</>
		)
	}
)
