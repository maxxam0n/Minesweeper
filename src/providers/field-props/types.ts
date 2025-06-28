import { GameParams } from '@/engine'
import { GameInteractionsProps } from '@/shared/lib/use-game-interactions'

export type FieldInteractions = Omit<
	GameInteractionsProps,
	'getPositionFromEvent' | 'gameOver'
>

export type FieldConfig = {
	width: number
	height: number
	params: GameParams
	gameOver: boolean
	interactions: FieldInteractions
	removeAnimations: (ids: string[]) => void
	showConnectedRegions?: boolean
	showProbabilities?: boolean
}
