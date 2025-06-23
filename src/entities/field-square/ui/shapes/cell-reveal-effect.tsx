import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { ShapeParams, useShape } from '@/ui-engine'
import { useGameColors } from '@/providers/game-colors'
import { useViewConfig } from '@/providers/game-view'
import { AnimationEffectProps } from '@/shared/types/shape'

export const CellRevealEffect = memo(
	({
		id,
		x,
		y,
		onComplete,
	}: Omit<AnimationEffectProps, 'size' | 'duration'>) => {
		const {
			cell: { size },
			animations: { duration },
		} = useViewConfig()
		const { CLOSED } = useGameColors()

		const [opacity, setOpacity] = useState(1)

		useEffect(() => {
			let startTime: number | null = null
			let animationFrameId: number

			const animate = (timestamp: number) => {
				if (startTime === null) startTime = timestamp
				const elapsed = timestamp - startTime
				const progress = Math.min(elapsed / duration, 1)

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

		const drawFlash = useCallback(
			(ctx: CanvasRenderingContext2D) => {
				ctx.fillStyle = CLOSED
				ctx.fillRect(x, y, size, size)
			},
			[x, y, size, CLOSED]
		)

		const shapeParams = useMemo<ShapeParams>(
			() => ({
				zIndex: 1,
				opacity,
				box: { x, y, width: size, height: size },
			}),
			[opacity, x, y, size]
		)

		useShape(drawFlash, shapeParams)

		return null
	}
)
