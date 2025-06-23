import { Canvas } from '@/ui-engine'
import { CellData, GameParams, Position } from '@/engine'
import { useViewConfig } from '@/providers/game-view'
import { Animation } from '@/shared/lib/use-animations'
import { SquareStaticField } from './square-static-field'
import { SquareGrid } from './square-grid'
import { SquareAnimationField } from './square-animation-field'
import { MouseEvent } from 'react'

interface SquareFieldProps {
	width: number
	height: number
	gameOver: boolean
	params: GameParams
	field: CellData[][]
	InteractionWrapper: (props: {
		children: React.ReactNode
		getPositionFromEvent: (event: MouseEvent) => Position | null
	}) => JSX.Element
	animations: {
		list: Animation[]
		remove: (ids: string[]) => void
	}
}

export const SquareField = ({
	width,
	height,
	field,
	gameOver,
	params,
	animations,
	InteractionWrapper,
}: SquareFieldProps) => {
	const {
		cell: { size },
		animations: { enabled },
	} = useViewConfig()

	const { cols, rows } = params

	const getPositionFromEvent = (event: MouseEvent): Position | null => {
		const rect = event.currentTarget.getBoundingClientRect()

		const col = Math.floor((event.clientX - rect.left) / size)
		const row = Math.floor((event.clientY - rect.top) / size)

		if (col < 0 || col >= cols || row < 0 || row >= rows) {
			return null
		}
		return { col, row }
	}

	return (
		<InteractionWrapper getPositionFromEvent={getPositionFromEvent}>
			<Canvas width={width} height={height}>
				<SquareStaticField
					zIndex={0}
					gameOver={gameOver}
					width={width}
					height={height}
					data={field}
				/>
				{enabled && (
					<SquareAnimationField
						zIndex={10}
						animations={animations.list}
						onAnimationComplete={animations.remove}
					/>
				)}
				<SquareGrid
					zIndex={20}
					width={width}
					height={height}
					params={params}
				/>
			</Canvas>
		</InteractionWrapper>
	)
}
