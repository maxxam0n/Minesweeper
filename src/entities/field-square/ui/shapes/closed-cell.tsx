import { memo, PropsWithChildren } from 'react'
import { Group, RectShape } from '@/ui-engine'
import { useGameColors } from '@/providers/game-colors'
import { useViewConfig } from '@/providers/game-view'
import { BaseShapeProps } from '@/shared/types/shape'
import { BevelShape } from './bevel-shape'

interface ClosedShapeProps
	extends Omit<BaseShapeProps, 'size'>,
		PropsWithChildren {}

export const ClosedCell = memo(({ x, y, children }: ClosedShapeProps) => {
	const { CLOSED } = useGameColors()
	const {
		cell: { size },
	} = useViewConfig()

	return (
		<Group x={x} y={y}>
			<RectShape x={0} y={0} width={size} height={size} fillColor={CLOSED} />
			<BevelShape x={0} y={0} />
			{children}
		</Group>
	)
})
