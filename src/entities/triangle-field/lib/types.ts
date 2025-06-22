export interface BaseCellProps {
	x: number
	y: number
}

export interface EffectProps extends BaseCellProps {
	id: string
	onComplete: (id: string) => void
}
