import { memo, useEffect, useState } from 'react'
import { useViewConfig } from '@/providers/game-view-provider'
import { EffectProps } from '../lib/types'
import { FlagShape } from './flag-shape'

export const FlagDisappearEffect = memo(
	({ id, x, y, onComplete }: EffectProps) => {
		const { cellSize, animationDuration } = useViewConfig()
		const [animState, setAnimState] = useState({ yOffset: 0, opacity: 1 })

		const initialY = y

		useEffect(() => {
			let startTime: number | null = null
			let animationFrameId: number

			const animate = (timestamp: number) => {
				if (startTime === null) startTime = timestamp
				const elapsed = timestamp - startTime
				const progress = Math.min(elapsed / (animationDuration * 0.5), 1)

				setAnimState({
					yOffset: -progress * (cellSize / 4), // Улетает на половину высоты клетки
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
		}, [id, onComplete, cellSize])

		// Рисуем флаг с анимированными параметрами
		return <FlagShape x={x} y={initialY + animState.yOffset} />
	}
)
