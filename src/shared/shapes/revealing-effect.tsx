import { memo, PropsWithChildren, useEffect, useState } from 'react'
import { Group } from '@/ui-engine'
import { AnimationEffectProps } from '@/shared/types/shape'

export const RevealingEffect = memo(
	({
		duration,
		x,
		y,
		onComplete,
		id,
		children,
	}: AnimationEffectProps & PropsWithChildren) => {
		const [opacity, setOpacity] = useState(1)

		useEffect(() => {
			let startTime: number | null = null
			let animationFrameId: number

			const animate = (timestamp: number) => {
				if (startTime === null) startTime = timestamp
				const elapsed = timestamp - startTime
				const progress = Math.min(elapsed / (duration * 0.5), 1)

				// Плавное исчезновение
				setOpacity(1 - progress)

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
		}, [duration, onComplete, id])

		return (
			<Group x={x} y={y} opacity={opacity}>
				{children}
			</Group>
		)
	}
)
