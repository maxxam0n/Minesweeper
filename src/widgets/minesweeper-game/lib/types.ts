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
	| 'reveal'
	| 'press'
	| 'flag'
	| 'unflag'
	| 'error'
	| 'explosion'

export interface Animation {
	id: string
	type: AnimationType
	position: Position
}

export interface AnimationQuery {
	type: AnimationType
	position: Position
}

export type ApplyRevealFunction = (result: {
	actionSnapshot: GameSnapshot
	actionChanges: ActionChanges
}) => void
