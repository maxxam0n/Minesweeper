import { FieldType, GameParams } from '@/engine'

export interface GameConfig {
	noGuessing: boolean
	params: GameParams
	type: FieldType
	seed: string
}
