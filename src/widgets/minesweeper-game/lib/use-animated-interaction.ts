import { useRef } from 'react'
import {
	ActionChanges,
	GameSnapshot,
	Position,
	RevealActionResult,
} from '@/engine'
import { Animation, ApplyRevealFunction } from './types'

interface AnimatedInteractionParams {
	animations: Animation[]
	revealCell: (pos: Position) => RevealActionResult
	addAnimations: (anims: any[]) => void
	removeAnimations: (ids: string[]) => void
	onApplyReveal: ApplyRevealFunction
}

interface DefferedAction {
	applyAction: () => void
	actionSnapshot: GameSnapshot
	actionChanges: ActionChanges
}

export const useAnimatedInteraction = ({
	animations,
	revealCell,
	addAnimations,
	removeAnimations,
	onApplyReveal,
}: AnimatedInteractionParams) => {
	const defferedAction = useRef<DefferedAction | null>(null)

	const handleCellPress = (pos: Position) => {
		const {
			data: { actionChanges, actionSnapshot },
			apply,
		} = revealCell(pos)

		if (actionChanges.previewPressPositions.length > 0) {
			addAnimations(
				actionChanges.previewPressPositions.map(pos => ({
					type: 'press',
					position: pos,
				}))
			)
			addAnimations(
				actionChanges.previewPressPositions.map(pos => ({
					type: 'reveal',
					position: pos,
				}))
			)
		}
		defferedAction.current = {
			applyAction: apply,
			actionChanges,
			actionSnapshot,
		}
	}

	const handleCellRelease = (isClick: boolean) => {
		removeAnimations(
			animations.filter(anim => anim.type === 'press').map(anim => anim.id)
		)

		if (isClick && defferedAction.current) {
			const { applyAction, actionSnapshot, actionChanges } =
				defferedAction.current

			applyAction()
			onApplyReveal({ actionSnapshot, actionChanges })

			const { revealedPositions } = actionChanges

			if (revealedPositions.length > 0 && revealedPositions.length < 500) {
				addAnimations(
					revealedPositions.map(pos => ({
						type: 'reveal',
						position: pos,
					}))
				)
			}
		}
		defferedAction.current = null
	}

	return { handleCellPress, handleCellRelease }
}
