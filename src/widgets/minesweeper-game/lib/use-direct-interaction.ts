import { Position, ActionResult } from '@/engine'
import { ActionCommittedCallback } from './types'

interface DirectInteractionParams {
	revealCell: (pos: Position) => ActionResult
	toggleFlag: (pos: Position) => ActionResult
	onActionCommitted: ActionCommittedCallback
}

export const useDirectInteraction = ({
	revealCell,
	toggleFlag,
	onActionCommitted,
}: DirectInteractionParams) => {
	const handleCellPress = () => {}

	const handleCellRelease = (isClick: boolean, pos?: Position) => {
		if (isClick && pos) {
			const { data, apply } = revealCell(pos)
			apply()
			onActionCommitted(data)
		}
	}

	const handleToggleFlag = (pos: Position) => {
		toggleFlag(pos).apply()
	}

	return { handleCellPress, handleCellRelease, handleToggleFlag }
}
