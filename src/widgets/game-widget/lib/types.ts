import { FieldType, GameMode, GameParams } from '@/engine'

export interface GameConfig {
	mode: GameMode
	type: FieldType
	params: GameParams
	seed: string
}
