// shared/ui/animations/BevelPressAnimation.tsx
import { useEffect, useRef } from 'react'
import { useGameColors } from '@/providers/game-colors-provider'
import { Position } from '@/engine'
import { useShape } from '@/shared/canvas/lib/use-shape'

interface BevelPressAnimationProps {
	pos: Position
	cellSize: number
	onComplete: () => void
}

export const BevelPressAnimation = ({
	pos,
	cellSize,
	onComplete,
}: BevelPressAnimationProps) => {
	const frame = useRef(0)
	const { DARK_BEVEL, LIGHT_BEVEL } = useGameColors()

	const draw = (ctx: CanvasRenderingContext2D) => {
		const x = pos.col * cellSize
		const y = pos.row * cellSize
		const width = 3

		// 1-й кадр: рисуем инвертированную фаску
		// (Этот код нужно будет адаптировать под твой BevelShape)
		ctx.fillStyle = LIGHT_BEVEL // Темная сторона становится светлой
		ctx.beginPath()
		ctx.moveTo(x, y)
		ctx.lineTo(x + cellSize, y)
		ctx.lineTo(x + cellSize - width, y + width)
		ctx.lineTo(x + width, y + cellSize - width)
		ctx.lineTo(x + width, y + width)
		ctx.lineTo(x, y)
		ctx.fill()

		ctx.fillStyle = DARK_BEVEL // Светлая сторона становится темной
		ctx.beginPath()
		ctx.moveTo(x + cellSize, y + cellSize)
		ctx.lineTo(x, y + cellSize)
		ctx.lineTo(x + width, y + cellSize - width)
		ctx.lineTo(x + cellSize - width, y + width)
		ctx.lineTo(x + cellSize, y + width)
		ctx.lineTo(x + cellSize, y + cellSize)
		ctx.fill()
	}

	// Регистрируем фигуру на канвасе
	useShape(draw, { zIndex: 1, opacity: 0 }, [pos, cellSize])

	useEffect(() => {
		const animate = () => {
			if (frame.current >= 2) {
				onComplete()
			} else {
				frame.current++
				requestAnimationFrame(animate)
			}
		}
		const id = requestAnimationFrame(animate)
		return () => cancelAnimationFrame(id)
	}, [onComplete])

	return null
}
