import { GameParams, GameSnapshot } from '@/engine'
import { AnimationQuery } from '@/shared/lib/use-animations'

export const useAnimatedGameOver = (
	addAnimations: (animations: AnimationQuery[]) => void,
	params: GameParams,
	config: { duration: number }
) => {
	const { duration } = config

	const animateLose = (actionSnapshot: GameSnapshot) => {
		const firstExplosionTime = duration

		const { notFoundMines, explodedCells, errorFlags } = actionSnapshot

		addAnimations(
			actionSnapshot.explodedCells.map(cell => ({
				type: 'explosion',
				position: cell.position,
				duration,
			}))
		)

		if (notFoundMines.length > 0) {
			const epicenter = explodedCells[0]?.position || {
				col: Math.floor(params.cols / 2),
				row: Math.floor(params.rows / 2),
			}

			const sortedMines = [...notFoundMines].sort((a, b) => {
				const distA = Math.hypot(
					a.position.col - epicenter.col,
					a.position.row - epicenter.row
				)
				const distB = Math.hypot(
					b.position.col - epicenter.col,
					b.position.row - epicenter.row
				)
				return distA - distB
			})

			addAnimations(
				sortedMines.slice(0, 5).map(cell => ({
					type: 'explosion',
					position: cell.position,
					duration,
				}))
			)

			addAnimations(
				sortedMines.slice(5).map((cell, index) => ({
					type: 'reveal',
					position: cell.position,
					delay: index * 5,
					duration,
				}))
			)
		}

		if (errorFlags.length > 0) {
			addAnimations(
				errorFlags.map(cell => ({
					type: 'error',
					position: cell.position,
					delay: firstExplosionTime * 2,
					duration,
				}))
			)
		}
	}

	const animateWin = (actionSnapshot: GameSnapshot) => {}

	return { animateLose, animateWin }
}
