import {
	ActionChanges,
	FieldType,
	GameMode,
	GameParams,
	GameSnapshot,
} from '@/engine'

export interface URLConfig {
	mode: GameMode
	type: FieldType
	params: GameParams
	seed: string
}

export type ActionCommittedCallback = (result: {
	actionSnapshot: GameSnapshot
	actionChanges: ActionChanges
}) => void
