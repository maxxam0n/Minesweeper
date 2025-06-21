import { useCallback, useEffect, useRef } from 'react'
import { useViewConfig } from '@/providers/game-view-provider'
import { BaseCellShape, CellRevealEffect } from '@/entities/cell-shape'
import { Layer } from '@/shared/canvas'
import { Animation } from '../lib/types'

interface AnimationFieldProps {
	animations: Animation[]
	onAnimationComplete: (id: string[]) => void
}

export const AnimationField = ({
	animations,
	onAnimationComplete,
}: AnimationFieldProps) => {
	const { cellSize } = useViewConfig()
	const removedAnimationIds = useRef<string[]>([])
	const animationFrameId = useRef<number>()

	const removeUnitAnimation = useCallback((id: string) => {
		removedAnimationIds.current.push(id)
	}, [])

	useEffect(() => {
		const checkLoop = () => {
			animationFrameId.current = requestAnimationFrame(checkLoop)

			if (removedAnimationIds.current.length > 0) {
				onAnimationComplete(removedAnimationIds.current)
				removedAnimationIds.current = []
			}
		}

		checkLoop()

		return () => {
			if (animationFrameId.current) {
				cancelAnimationFrame(animationFrameId.current)
			}
		}
	}, [onAnimationComplete])

	const { pressedAnimations, revealingAnimations } = animations.reduce(
		(acc, anim) => {
			const {
				id,
				position: { col, row },
			} = anim
			const x = col * cellSize
			const y = row * cellSize

			if (anim.type === 'press') {
				acc.pressedAnimations.push(
					<BaseCellShape
						key={`press-${col}-${row}`}
						x={x}
						y={y}
						open={true}
					/>
				)
			} else if (anim.type === 'reveal') {
				acc.revealingAnimations.push(
					<CellRevealEffect
						key={id}
						id={id}
						x={x}
						y={y}
						onComplete={removeUnitAnimation}
					/>
				)
			}
			return acc
		},
		{
			pressedAnimations: [] as JSX.Element[],
			revealingAnimations: [] as JSX.Element[],
		}
	)

	return (
		<>
			<Layer name="pressed" zIndex={10}>
				{/* Анимации вдавливания */}
				{pressedAnimations}
			</Layer>

			<Layer name="revealing" zIndex={11}>
				{/* Анимации раскрытия ячеек */}
				{revealingAnimations}
			</Layer>
		</>
	)
}
