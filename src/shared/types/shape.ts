export interface BaseShapeProps {
	x: number
	y: number
	size: number
}

export interface AnimationEffectProps extends BaseShapeProps {
	id: string
	duration: number
	onComplete: (id: string) => void
	delay?: number
}
