export interface BaseShapeProps {
	x: number
	y: number
	size: number
}

export interface EffectProps extends BaseShapeProps {
	id: string
	duration: number
	delay?: number
	onComplete: (id: string) => void
}
