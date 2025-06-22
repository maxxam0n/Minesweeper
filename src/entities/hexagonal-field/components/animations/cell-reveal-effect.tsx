import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useGameColors } from '@/providers/game-colors-provider'
import { useViewConfig } from '@/providers/game-view-provider'
import { ShapeParams, useShape } from '@/ui-engine'
import { EffectProps } from '../../lib/types'

export const CellRevealEffect = memo(
	({ id, x, y, onComplete }: EffectProps) => {
		const { cellSize, animationDuration } = useViewConfig()
		const { CLOSED } = useGameColors()

		const [opacity, setOpacity] = useState(1)

		useEffect(() => {
			let startTime: number | null = null
			let animationFrameId: number

			const animate = (timestamp: number) => {
				if (startTime === null) startTime = timestamp
				const elapsed = timestamp - startTime
				const progress = Math.min(elapsed / animationDuration, 1)

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
		}, [animationDuration, onComplete, id])

		const drawFlash = useCallback(
			(ctx: CanvasRenderingContext2D) => {
				ctx.fillStyle = CLOSED
				ctx.fillRect(x, y, cellSize, cellSize)
			},
			[x, y, cellSize, CLOSED]
		)

		const shapeParams = useMemo<ShapeParams>(
			() => ({
				zIndex: 1,
				opacity,
				box: { x, y, width: cellSize, height: cellSize },
			}),
			[opacity, x, y, cellSize]
		)

		useShape(drawFlash, shapeParams)

		return null
	}
)
