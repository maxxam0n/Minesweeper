import { memo, PropsWithChildren } from 'react'
import { Group, RectShape } from '@/ui-engine'
import { useGameSettings } from '@/providers/game-settings'
import { BaseShapeProps } from '@/shared/types/shape'
import { BevelShape } from './bevel-shape'

interface ClosedShapeProps
	extends Omit<BaseShapeProps, 'size'>,
		PropsWithChildren {}

export const CellMask = memo(({ x = 0, y = 0, children }: ClosedShapeProps) => {
	const {
		settings: {
			cell: { size },
			colors: { closed },
		},
	} = useGameSettings()

	return (
		<Group x={x} y={y}>
			<RectShape width={size} height={size} fillColor={closed} />
			<BevelShape />
			{children}
		</Group>
	)
})
