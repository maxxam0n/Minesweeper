import { memo, PropsWithChildren, useEffect, useState } from 'react'
import { Group, TransformGroup } from '@/ui-engine'
import { AnimationEffectProps } from '@/shared/types/shape'

export const DisappearEffect = memo(
	({
		id,
		x,
		y,
		duration,
		amplitude,
		children,
		onComplete,
	}: AnimationEffectProps & PropsWithChildren & { amplitude: number }) => {
		const [animState, setAnimState] = useState({ yOffset: 0, opacity: 1 })

		useEffect(() => {
			let startTime: number | null = null
			let animationFrameId: number

			const animate = (timestamp: number) => {
				if (startTime === null) startTime = timestamp
				const elapsed = timestamp - startTime
				const progress = Math.min(elapsed / duration, 1)

				setAnimState({
					yOffset: -progress * amplitude, // Улетает на половину своего размера
					opacity: 1 - progress,
				})

				if (progress < 1) {
					animationFrameId = requestAnimationFrame(animate)
				} else {
					onComplete(id)
				}
			}
			animationFrameId = requestAnimationFrame(animate)

			return () => {
				cancelAnimationFrame(animationFrameId)
			}
		}, [id, onComplete, amplitude])

		return (
			<Group x={x} y={y} opacity={animState.opacity}>
				<TransformGroup
					translate={{
						translateX: 0,
						translateY: animState.yOffset,
					}}
				>
					{children}
				</TransformGroup>
			</Group>
		)
	}
)
