import { PropsWithChildren, useMemo } from 'react'
import { GameViewContext } from './game-view-context'
import { ViewConfig } from './types'

export const GameViewProvider = ({ children }: PropsWithChildren) => {
	const viewConfig = useMemo<ViewConfig>(
		() => ({
			cell: {
				size: 30,
				font: 'Tektur',
				bevelWidth: 3,
				borderWidth: 0.5,
			},
			animations: {
				enabled: true,
				duration: 300,
			},
		}),
		[]
	)

	return (
		<GameViewContext.Provider value={viewConfig}>
			{children}
		</GameViewContext.Provider>
	)
}
