import {
	ActionChanges,
	FieldType,
	GameMode,
	GameParams,
	GameSnapshot,
	Position,
} from '@/engine'

export interface GameConfig {
	mode: GameMode
	type: FieldType
	params: GameParams
	seed: string
}

export type AnimationType =
	| 'press'
	| 'reveal'
	| 'flag'
	| 'unflag'
	| 'error'
	| 'explosion'
	| 'flag-missed'

export interface Animation {
	id: string
	type: AnimationType
	position: Position
	delay?: number
}

export interface AnimationQuery {
	type: AnimationType
	position: Position
	delay?: number
}

export type ActionCommittedCallback = (result: {
	actionSnapshot: GameSnapshot
	actionChanges: ActionChanges
}) => void
