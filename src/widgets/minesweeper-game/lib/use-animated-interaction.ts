import { useRef } from 'react'
import { ActionChanges, GameSnapshot, Position, ActionResult } from '@/engine'
import { Animation, AnimationQuery, ApplyRevealFunction } from './types'

interface AnimatedInteractionParams {
	animations: Animation[]
	revealCell: (pos: Position) => ActionResult
	toggleFlag: (pos: Position) => ActionResult
	addAnimations: (anims: AnimationQuery[]) => void
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
	toggleFlag,
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

		const { col, row } = actionChanges.targetPosition
		const targetCell = actionSnapshot.field[row][col].data

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
		// Показываем ошибку только при попытке открития хорды с невыполненными условиями
		// Если клетка не пустая, и выполнены все условия,
		// движок вернет не пустой previewPressPositions и мы сюда не попадем
		else if (!targetCell.isEmpty || targetCell.isFlagged) {
			addAnimations([
				{
					type: 'error',
					position: actionChanges.targetPosition,
				},
			])
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

	const handleToggleFlag = (pos: Position) => {
		const {
			apply,
			data: { actionChanges },
		} = toggleFlag(pos)

		apply()

		const { flaggedPositions, unflaggedPositions } = actionChanges

		if (flaggedPositions.length > 0) {
			addAnimations(
				flaggedPositions.map(pos => ({
					type: 'flag',
					position: pos,
				}))
			)
		} else if (unflaggedPositions.length > 0) {
			addAnimations(
				unflaggedPositions.map(pos => ({
					type: 'unflag',
					position: pos,
				}))
			)
		} else {
			addAnimations([
				{
					type: 'error',
					position: actionChanges.targetPosition,
				},
			])
		}
	}

	return { handleCellPress, handleCellRelease, handleToggleFlag }
}
