import { useRef } from 'react'
import { ActionChanges, GameSnapshot, Position, ActionResult } from '@/engine'
import { Animation, AnimationQuery } from '@/shared/lib/use-animations'
import { ActionCommittedCallback } from './types'

interface AnimatedInteractionParams {
	duration: number
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
	duration,
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
					duration,
				}))
			)
			addAnimations(
				actionChanges.handledCells.map(cel => ({
					type: 'reveal',
					position: cel.position,
					duration,
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
					duration,
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
						duration,
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
					type: 'appear',
					position: cell.position,
					duration,
				}))
			)
		} else if (unflaggedCells.length > 0) {
			addAnimations(
				unflaggedCells.map(cell => ({
					type: 'disappear',
					position: cell.position,
					duration: duration / 4,
				}))
			)
		} else if (!target.isRevealed) {
			addAnimations([
				{
					type: 'error',
					position: target.position,
					duration,
				},
			])
		}
	}

	return { handleCellPress, handleCellRelease, handleToggleFlag }
}
