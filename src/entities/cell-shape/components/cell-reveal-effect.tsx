import { useGameColors } from '@/providers/game-colors-provider'
import { useViewConfig } from '@/providers/game-view-provider'
import { useShape } from '@/shared/canvas'
import { useCallback, useEffect, useMemo, useState } from 'react'

interface CellRevealEffectProps {
	id: string
	col: number
	row: number
	onComplete: (id: string) => void
	duration?: number
}

export const CellRevealEffect = ({
	id,
	col,
	row,
	onComplete,
	duration = 150,
}: CellRevealEffectProps) => {
	const { cellSize } = useViewConfig()
	const { CLOSED } = useGameColors()

	const x = col * cellSize
	const y = row * cellSize

	const [currentOpacity, setCurrentOpacity] = useState(0)

	// Анимация через requestAnimationFrame
	useEffect(() => {
		let startTime: number | null = null
		let animationFrameId: number

		const animate = (timestamp: number) => {
			if (startTime === null) {
				startTime = timestamp
			}
			const elapsedTime = timestamp - startTime
			const progress = Math.min(elapsedTime / duration, 1)

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
	}, [duration, onComplete, id])

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
