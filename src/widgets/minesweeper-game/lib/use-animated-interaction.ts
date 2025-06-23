import { useRef } from 'react'
import { Animation, AnimationQuery } from '@/shared/lib/use-animations'
import { ActionChanges, GameSnapshot, Position, ActionResult } from '@/engine'
import { ActionCommittedCallback } from './types'

interface AnimatedInteractionParams {
	animations: Animation[]
	revealCell: (pos: Position) => ActionResult
	toggleFlag: (pos: Position) => ActionResult
	addAnimations: (anims: AnimationQuery[]) => void
	removeAnimations: (ids: string[]) => void
	onActionCommitted: ActionCommittedCallback
}

interface DefferedAction {
	apply: () => void
	actionSnapshot: GameSnapshot
	actionChanges: ActionChanges
}

export const useAnimatedInteraction = ({
	animations,
	revealCell,
	toggleFlag,
	addAnimations,
	removeAnimations,
	onActionCommitted,
}: AnimatedInteractionParams) => {
	const defferedAction = useRef<DefferedAction | null>(null)

	const handleCellPress = (pos: Position) => {
		const {
			data: { actionChanges, actionSnapshot },
			apply,
		} = revealCell(pos)

		const targetCell = actionChanges.target

		if (actionChanges.handledCells.length > 0) {
			addAnimations(
				actionChanges.handledCells.map(cel => ({
					type: 'press',
					position: cel.position,
				}))
			)
			addAnimations(
				actionChanges.handledCells.map(cel => ({
					type: 'reveal',
					position: cel.position,
				}))
			)
		}
		// Показываем ошибку только при попытке открития аккордом с невыполненными условиями
		// Если клетка не пустая, и выполнены все условия,
		// движок вернет не пустой previewPressPositions и мы сюда не попадем
		else if (!targetCell.isEmpty || targetCell.isFlagged) {
			addAnimations([
				{
					type: 'error',
					position: targetCell.position,
				},
			])
		}

		defferedAction.current = {
			actionChanges,
			actionSnapshot,
			apply,
		}
	}

	const handleCellRelease = (isClick: boolean) => {
		removeAnimations(
			animations.filter(anim => anim.type === 'press').map(anim => anim.id)
		)

		if (isClick && defferedAction.current) {
			const { apply, actionSnapshot, actionChanges } = defferedAction.current

			apply()
			onActionCommitted({ actionSnapshot, actionChanges })

			const { revealedCells } = actionChanges

			if (revealedCells.length > 0 && revealedCells.length < 500) {
				addAnimations(
					revealedCells.map(cell => ({
						type: 'reveal',
						position: cell.position,
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

		const { target, flaggedCells, unflaggedCells } = actionChanges

		if (flaggedCells.length > 0) {
			addAnimations(
				flaggedCells.map(cell => ({
					type: 'flag',
					position: cell.position,
				}))
			)
		} else if (unflaggedCells.length > 0) {
			addAnimations(
				unflaggedCells.map(cell => ({
					type: 'unflag',
					position: cell.position,
				}))
			)
		} else if (!target.isEmpty) {
			addAnimations([
				{
					type: 'error',
					position: target.position,
				},
			])
		}
	}

	return { handleCellPress, handleCellRelease, handleToggleFlag }
}
