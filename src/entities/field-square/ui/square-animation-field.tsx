import { useCallback, useEffect, useRef } from 'react'
import { Layer, RectShape } from '@/ui-engine'
import { useGameColors } from '@/providers/game-colors'
import { useViewConfig } from '@/providers/game-view'
import { Animation } from '@/shared/lib/use-animations'
import { AppearEffect } from '@/shared/shapes/appear-effect'
import { FlagShape } from '@/shared/shapes/flag-shape'
import { DisappearEffect } from '@/shared/shapes/disappear-effect'
import { VibrationEffect } from '@/shared/shapes/vibration-effect'
import { CrossShape } from '@/shared/shapes/cross-shape'
import { ExplosionEffect } from '@/shared/shapes/explosion-effect'
import { MineShape } from '@/shared/shapes/mine-shape'
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
		animations: { duration },
	} = useViewConfig()

	const { REVEALED, FLAG, FLAG_SHAFT, MINE } = useGameColors()

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
		errorAnimation,
		explosionAnimation,
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
			} else if (anim.type === 'flag') {
				acc.flagAnimations.push(
					<AppearEffect
						key={`flag-appear-${id}`}
						duration={duration}
						id={id}
						height={size}
						width={size}
						x={x}
						y={y}
						onComplete={removeUnitAnimation}
					>
						<FlagShape
							x={0}
							y={0}
							size={size}
							flagColor={FLAG}
							shaftColor={FLAG_SHAFT}
						/>
					</AppearEffect>
				)
			} else if (anim.type === 'unflag') {
				acc.unflagAnimations.push(
					<DisappearEffect
						key={`flag-disappear-${id}`}
						id={id}
						amplitude={size / 4}
						x={x}
						y={y}
						duration={duration / 4}
						onComplete={removeUnitAnimation}
					>
						<FlagShape
							x={0}
							y={0}
							size={size}
							flagColor={FLAG}
							shaftColor={FLAG_SHAFT}
						/>
					</DisappearEffect>
				)
			} else if (anim.type === 'error') {
				acc.errorAnimation.push(
					<VibrationEffect
						key={`error-${id}`}
						id={id}
						duration={duration}
						x={x}
						y={y}
						onComplete={removeUnitAnimation}
					>
						<CrossShape x={0} y={0} size={size} />
					</VibrationEffect>
				)
			} else if (anim.type === 'explosion') {
				acc.explosionAnimation.push(
					<ExplosionEffect
						key={`explosion-${id}`}
						x={x}
						y={y}
						id={id}
						size={size}
						duration={duration}
						onComplete={removeUnitAnimation}
					>
						<MineShape x={0} y={0} size={size} color={MINE} />
					</ExplosionEffect>
				)
			}
			return acc
		},
		{
			pressedAnimations: [] as JSX.Element[],
			revealingAnimations: [] as JSX.Element[],
			flagAnimations: [] as JSX.Element[],
			unflagAnimations: [] as JSX.Element[],
			errorAnimation: [] as JSX.Element[],
			explosionAnimation: [] as JSX.Element[],
		}
	)

	return (
		<>
			<Layer name="light-animations" zIndex={zIndex}>
				{/* Анимации вдавливания */}
				{pressedAnimations}

				{/* Анимация ошибки */}
				{errorAnimation}

				{/* Анимации флагов */}
				{flagAnimations}
				{unflagAnimations}

				{/* Анимации раскрытия ячеек */}
				{revealingAnimations}
			</Layer>

			<Layer name="heavy-animations" zIndex={zIndex + 1}>
				{/* Анимация взрыва */}
				{explosionAnimation}
			</Layer>
		</>
	)
}
