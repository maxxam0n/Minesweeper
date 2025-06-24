import { memo, PropsWithChildren, useEffect, useState } from 'react'
import { Group, TransformGroup } from '@/ui-engine'
import { AnimationEffectProps } from '@/shared/types/shape'

export const AppearEffect = memo(
	({
		id,
		x,
		y,
		width,
		height,
		duration,
		onComplete,
		children,
	}: AnimationEffectProps &
		PropsWithChildren & { width: number; height: number }) => {
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

		const originX = width / 2
		const originY = height / 2

		return (
			<Group x={x} y={y}>
				<TransformGroup
					scale={{
						scaleX: scale,
						scaleY: scale,
						originX: originX,
						originY: originY,
					}}
				>
					{children}
				</TransformGroup>
			</Group>
		)
	}
)
