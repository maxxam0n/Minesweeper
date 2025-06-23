import { useCallback, useEffect, useRef } from 'react'
import { Layer, RectShape } from '@/ui-engine'
import { useGameColors } from '@/providers/game-colors'
import { useViewConfig } from '@/providers/game-view'
import { Animation } from '@/shared/lib/use-animations'
import { CellRevealEffect } from './shapes/cell-reveal-effect'

interface SquareAnimationFieldProps {
	zIndex: number
	animations: Animation[]
	onAnimationComplete: (id: string[]) => void
}

export const SquareAnimationField = ({
	zIndex,
	animations,
	onAnimationComplete,
}: SquareAnimationFieldProps) => {
	const {
		cell: { size },
	} = useViewConfig()

	const { REVEALED } = useGameColors()

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

	const {
		pressedAnimations,
		revealingAnimations,
		flagAnimations,
		unflagAnimations,
		limitReached,
	} = animations.reduce(
		(acc, anim) => {
			const {
				id,
				position: { col, row },
			} = anim
			const x = col * size
			const y = row * size

			if (anim.type === 'press') {
				acc.pressedAnimations.push(
					<RectShape
						key={`press-${col}-${row}`}
						x={x}
						y={y}
						width={size}
						height={size}
						fillColor={REVEALED}
					/>
				)
			} else if (anim.type === 'reveal') {
				acc.revealingAnimations.push(
					<CellRevealEffect
						key={`reveal-${id}`}
						id={id}
						x={x}
						y={y}
						onComplete={removeUnitAnimation}
					/>
				)
			}
			// else if (anim.type === 'flag') {
			// 	acc.flagAnimations.push(
			// 		<FlagAppearEffect
			// 			key={`flag-appear-${id}`}
			// 			id={id}
			// 			x={x}
			// 			y={y}
			// 			onComplete={removeUnitAnimation}
			// 		/>
			// 	)
			// } else if (anim.type === 'unflag') {
			// 	acc.unflagAnimations.push(
			// 		<FlagDisappearEffect
			// 			key={`flag-disappear-${id}`}
			// 			id={id}
			// 			x={x}
			// 			y={y}
			// 			onComplete={removeUnitAnimation}
			// 		/>
			// 	)
			// } else if (anim.type === 'error') {
			// 	acc.limitReached.push(
			// 		<ActionErrorEffect
			// 			key={`error-${id}`}
			// 			id={id}
			// 			x={x}
			// 			y={y}
			// 			onComplete={removeUnitAnimation}
			// 		/>
			// 	)
			// }
			return acc
		},
		{
			pressedAnimations: [] as JSX.Element[],
			revealingAnimations: [] as JSX.Element[],
			flagAnimations: [] as JSX.Element[],
			unflagAnimations: [] as JSX.Element[],
			limitReached: [] as JSX.Element[],
		}
	)

	return (
		<>
			<Layer name="light-animations" zIndex={zIndex}>
				{/* Анимации вдавливания */}
				{pressedAnimations}

				{/* Анимации флагов */}
				{flagAnimations}
				{unflagAnimations}
				{limitReached}
			</Layer>

			<Layer name="heavy-animations" zIndex={zIndex + 1}>
				{/* Анимации раскрытия ячеек */}
				{revealingAnimations}
			</Layer>
		</>
	)
}
