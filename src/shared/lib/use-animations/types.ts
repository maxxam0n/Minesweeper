import { Position } from '@/engine'

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
