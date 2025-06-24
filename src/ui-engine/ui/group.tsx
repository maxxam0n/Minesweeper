import { PropsWithChildren, useContext, useMemo } from 'react'
import { TransformGroup } from './transform-group'
import { GroupContext } from '../model/group-context'

interface GroupProps extends PropsWithChildren {
	x: number
	y: number
	opacity?: number
	zIndex?: number
}

export const Group = ({
	x,
	y,
	opacity = 1,
	zIndex = 0,
	children,
}: GroupProps) => {
	const inherited = useContext(GroupContext)

	const groupParams = useMemo(() => {
		return {
			opacity: 1 - (1 - opacity) * (1 - (inherited?.opacity || 1)),
			zIndex: zIndex + (inherited?.zIndex || 0),
		}
	}, [opacity, zIndex, inherited])

	return (
		<GroupContext.Provider value={groupParams}>
			<TransformGroup
				translate={{
					translateX: x,
					translateY: y,
				}}
			>
				{children}
			</TransformGroup>
		</GroupContext.Provider>
	)
}
