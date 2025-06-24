export interface BaseShapeProps {
	x: number
	y: number
	size: number
}

export interface AnimationEffectProps {
	x: number
	y: number
	id: string
	duration: number
	onComplete: (id: string) => void
	delay?: number
}
