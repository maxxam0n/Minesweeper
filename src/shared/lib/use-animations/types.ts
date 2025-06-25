import { Position } from '@/engine'

export type AnimationType =
	| 'press'
	| 'reveal'
	| 'appear'
	| 'disappear'
	| 'error'
	| 'explosion'

export interface Animation {
	id: string
	type: AnimationType
	position: Position
	delay?: number
	duration?: number
}

export interface AnimationQuery {
	type: AnimationType
	position: Position
	duration?: number
	delay?: number
}
