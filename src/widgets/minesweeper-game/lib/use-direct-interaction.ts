import { Position, RevealActionResult } from '@/engine'
import { ApplyRevealFunction } from './types'

interface DirectInteractionParams {
	revealCell: (pos: Position) => RevealActionResult
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

	return { handleCellPress, handleCellRelease }
}
