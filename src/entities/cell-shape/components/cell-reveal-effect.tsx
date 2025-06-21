import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useGameColors } from '@/providers/game-colors-provider'
import { useViewConfig } from '@/providers/game-view-provider'
import { useShape } from '@/shared/canvas'

interface CellRevealEffectProps {
	id: string
	x: number
	y: number
	onComplete: (id: string) => void
}

export const CellRevealEffect = memo(
	({ id, x, y, onComplete }: CellRevealEffectProps) => {
		const { cellSize, animationDuration } = useViewConfig()
		const { CLOSED } = useGameColors()

		const [currentOpacity, setCurrentOpacity] = useState(0)

		useEffect(() => {
			let startTime: number | null = null
			let animationFrameId: number

			const animate = (timestamp: number) => {
				if (startTime === null) {
					startTime = timestamp
				}
				const elapsedTime = timestamp - startTime
				const progress = Math.min(elapsedTime / animationDuration, 1)

				// Плавное исчезновение
				setCurrentOpacity(progress)

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

		const shapeParams = useMemo(
			() => ({
				zIndex: 1,
				opacity: currentOpacity,
				box: { x, y, width: cellSize, height: cellSize },
			}),
			[currentOpacity, x, y, cellSize]
		)

		useShape(drawFlash, shapeParams)

		return null
	}
)
