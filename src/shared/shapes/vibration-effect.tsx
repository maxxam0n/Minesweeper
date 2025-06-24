import { memo, PropsWithChildren, useEffect, useState } from 'react'
import { Group, TransformGroup } from '@/ui-engine'
import { AnimationEffectProps } from '@/shared/types/shape'

export const VibrationEffect = memo(
	({
		id,
		x,
		y,
		duration,
		amplitude = 3,
		onComplete,
		children,
	}: AnimationEffectProps & PropsWithChildren & { amplitude?: number }) => {
		const [xOffset, setXOffset] = useState(0)

		useEffect(() => {
			let startTime: number | null = null
			let animationFrameId: number

			const animate = (timestamp: number) => {
				if (startTime === null) startTime = timestamp
				const elapsed = timestamp - startTime
				const progress = Math.min(elapsed / duration, 1)

				// Формула для быстрого затухающего колебания
				const shake =
					Math.sin(progress * Math.PI * 6) * (1 - progress) * amplitude
				setXOffset(shake)

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
		}, [id, onComplete])

		return (
			<Group x={x} y={y}>
				<TransformGroup translate={{ translateX: xOffset, translateY: 0 }}>
					{children}
				</TransformGroup>
			</Group>
		)
	}
)
