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
import { RevealingEffect } from '@/shared/shapes/revealing-effect'
import { DelayedAnimation } from '@/shared/shapes/delayed-animation'
import { CellMask } from './shapes/cell-mask'

interface SquareAnimationFieldProps {
	zIndex: number
	animationsList: Animation[]
	onAnimationComplete: (id: string[]) => void
}

export const SquareAnimationField = ({
	zIndex,
	animationsList,
	onAnimationComplete,
}: SquareAnimationFieldProps) => {
	const {
		cell: { size },
		animations: { duration },
	} = useViewConfig()

	const { REVEALED, CLOSED, FLAG, FLAG_SHAFT, MINE } = useGameColors()

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

	const animations: Record<string, JSX.Element[]> = {
		pressedAnimations: [],
		revealingAnimations: [],
		flagAnimations: [],
		unflagAnimations: [],
		errorAnimation: [],
		explosionAnimations: [],
	}

	animationsList.forEach(anim => {
		const {
			id,
			position: { col, row },
		} = anim
		const x = col * size
		const y = row * size

		if (anim.type === 'press') {
			animations.pressedAnimations.push(
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
			if (anim.delay) {
				animations.revealingAnimations.push(
					<DelayedAnimation
						key={`delayed-reveal-${id}`}
						delay={anim.delay}
						fallback={<CellMask x={x} y={y} />}
					>
						<RevealingEffect
							x={x}
							y={y}
							id={id}
							duration={anim.duration || duration}
							onComplete={removeUnitAnimation}
						>
							<RectShape width={size} height={size} fillColor={CLOSED} />
						</RevealingEffect>
					</DelayedAnimation>
				)
			} else
				animations.revealingAnimations.push(
					<RevealingEffect
						key={`reveal-${id}`}
						x={x}
						y={y}
						id={id}
						duration={anim.duration || duration}
						onComplete={removeUnitAnimation}
					>
						<RectShape width={size} height={size} fillColor={CLOSED} />
					</RevealingEffect>
				)
		} else if (anim.type === 'appear') {
			animations.flagAnimations.push(
				<AppearEffect
					key={`flag-appear-${id}`}
					duration={anim.duration || duration}
					id={id}
					height={size}
					width={size}
					x={x}
					y={y}
					onComplete={removeUnitAnimation}
				>
					<FlagShape
						size={size}
						flagColor={FLAG}
						shaftColor={FLAG_SHAFT}
					/>
				</AppearEffect>
			)
		} else if (anim.type === 'disappear') {
			animations.unflagAnimations.push(
				<DisappearEffect
					key={`flag-disappear-${id}`}
					id={id}
					amplitude={size / 4}
					x={x}
					y={y}
					duration={anim.duration || duration}
					onComplete={removeUnitAnimation}
				>
					<FlagShape
						size={size}
						flagColor={FLAG}
						shaftColor={FLAG_SHAFT}
					/>
				</DisappearEffect>
			)
		} else if (anim.type === 'error') {
			animations.errorAnimation.push(
				<VibrationEffect
					key={`error-${id}`}
					x={x}
					y={y}
					id={id}
					duration={anim.duration || duration}
					onComplete={removeUnitAnimation}
				>
					<CrossShape size={size} />
				</VibrationEffect>
			)
		} else if (anim.type === 'explosion') {
			animations.explosionAnimations.push(
				<ExplosionEffect
					key={`explosion-${id}`}
					x={x}
					y={y}
					id={id}
					size={size}
					duration={anim.duration || duration}
					power={50}
					onComplete={removeUnitAnimation}
				>
					<MineShape size={size} color={MINE} />
				</ExplosionEffect>
			)
		}
	})

	return (
		<Layer name="light-animations" zIndex={zIndex}>
			{/* Анимации вдавливания */}
			{animations.pressedAnimations}

			{/* Анимация ошибки */}
			{animations.errorAnimation}

			{/* Анимации флагов */}
			{animations.flagAnimations}
			{animations.unflagAnimations}

			{/* Анимации раскрытия ячеек */}
			{animations.revealingAnimations}

			{/* Анимация взрыва */}
			{animations.explosionAnimations}
		</Layer>
	)
}
