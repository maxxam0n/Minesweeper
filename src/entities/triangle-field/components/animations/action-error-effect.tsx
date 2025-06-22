import { memo, useEffect, useState } from 'react'
import { useViewConfig } from '@/providers/game-view-provider'
import { EffectProps } from '../../lib/types'
import { MissedShape } from './missed-shape'

export const ActionErrorEffect = memo(
	({ id, x, y, onComplete }: EffectProps) => {
		const { animationDuration } = useViewConfig()
		const [xOffset, setXOffset] = useState(0)

		const initialX = x

		useEffect(() => {
			let startTime: number | null = null
			let animationFrameId: number

			const animate = (timestamp: number) => {
				if (startTime === null) startTime = timestamp
				const elapsed = timestamp - startTime
				const progress = Math.min(elapsed / animationDuration, 1)

				// Формула для быстрого затухающего колебания
				const shake = Math.sin(progress * Math.PI * 6) * (1 - progress) * 3 // Амплитуда 3 пикселя
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

		return <MissedShape x={initialX + xOffset} y={y} />
	}
)
