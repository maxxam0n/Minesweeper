import { useCallback, useEffect, useRef } from 'react'
import { useViewConfig } from '@/providers/game-view-provider'
import { useGameColors } from '@/providers/game-colors-provider'
import {
	CellRevealEffect,
	FlagAppearEffect,
	FlagDisappearEffect,
	ActionErrorEffect,
} from '@/entities/cell-shape'
import { Layer, RectShape } from '@/shared/canvas'
import { Animation } from '../lib/types'

interface AnimationFieldProps {
	zIndex: number
	animations: Animation[]
	onAnimationComplete: (id: string[]) => void
}

export const AnimationField = ({
	zIndex,
	animations,
	onAnimationComplete,
}: AnimationFieldProps) => {
	const { cellSize } = useViewConfig()
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
			const x = col * cellSize
			const y = row * cellSize

			if (anim.type === 'press') {
				acc.pressedAnimations.push(
					<RectShape
						key={`press-${col}-${row}`}
						x={x}
						y={y}
						width={cellSize}
						height={cellSize}
						fillColor={REVEALED}
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
			} else if (anim.type === 'flag') {
				acc.flagAnimations.push(
					<FlagAppearEffect
						key={id}
						id={id}
						x={x}
						y={y}
						onComplete={removeUnitAnimation}
					/>
				)
			} else if (anim.type === 'unflag') {
				acc.unflagAnimations.push(
					<FlagDisappearEffect
						key={id}
						id={id}
						x={x}
						y={y}
						onComplete={removeUnitAnimation}
					/>
				)
			} else if (anim.type === 'error') {
				acc.limitReached.push(
					<ActionErrorEffect
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
