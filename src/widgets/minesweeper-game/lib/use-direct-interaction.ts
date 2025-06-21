import { Position, ActionResult } from '@/engine'
import { ApplyRevealFunction } from './types'

interface DirectInteractionParams {
	revealCell: (pos: Position) => ActionResult
	toggleFlag: (pos: Position) => ActionResult
	onApplyReveal: ApplyRevealFunction
}

export const useDirectInteraction = ({
	revealCell,
	onApplyReveal,
}: DirectInteractionParams) => {
	const handleCellPress = () => {}

	const handleCellRelease = (isClick: boolean, pos?: Position) => {
		if (isClick && pos) {
			const { data, apply } = revealCell(pos)
			apply()
			onApplyReveal(data)
		}
	}

	const handleToggleFlag = (pos: Position) => {
		revealCell(pos).apply()
	}

	return { handleCellPress, handleCellRelease, handleToggleFlag }
}
