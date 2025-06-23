import { memo, useEffect, useState } from 'react'
import { AnimationEffectProps } from '@/shared/types/shape'

export const DisappearEffect = memo(
	({ id, x, y, duration, size, onComplete }: AnimationEffectProps) => {
		const [animState, setAnimState] = useState({ yOffset: 0, opacity: 1 })

		const initialY = y

		useEffect(() => {
			let startTime: number | null = null
			let animationFrameId: number

			const animate = (timestamp: number) => {
				if (startTime === null) startTime = timestamp
				const elapsed = timestamp - startTime
				const progress = Math.min(elapsed / duration, 1)

				setAnimState({
					yOffset: -progress * (size / 4), // Улетает на половину своего размера
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
		}, [id, onComplete, size])

		return null
	}
)
