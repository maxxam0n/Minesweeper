import { memo, useEffect, useState } from 'react'
import { AnimationEffectProps } from '@/shared/types/shape'

export const AppearEffect = memo(
	({ id, x, y, size, duration, onComplete }: AnimationEffectProps) => {
		const [scale, setScale] = useState(0)

		useEffect(() => {
			let startTime: number | null = null
			let animationFrameId: number

			const animate = (timestamp: number) => {
				if (startTime === null) startTime = timestamp
				const elapsed = timestamp - startTime
				const progress = Math.min(elapsed / duration, 1)

				// Кастомная функция для "пружинного" эффекта
				// t < 0.4: быстрый рост до 1.2
				// t >= 0.4: затухающее колебание вокруг 1.0
				if (progress < 0.4) {
					setScale((progress / 0.4) * 1.2)
				} else {
					const bounceProgress = (progress - 0.4) / 0.6
					// Формула для эффекта "отскока"
					const newScale =
						1 +
						0.2 *
							Math.exp(-6 * bounceProgress) *
							Math.cos(10 * bounceProgress)
					setScale(newScale)
				}

				if (progress < 1) {
					animationFrameId = requestAnimationFrame(animate)
				} else {
					setScale(1)
					onComplete(id)
				}
			}

			animationFrameId = requestAnimationFrame(animate)

			return () => {
				cancelAnimationFrame(animationFrameId)
			}
		}, [id, onComplete])

		return null
	}
)
