import { PropsWithChildren, useMemo } from 'react'
import { GameViewContext } from './game-view-context'
import { ViewConfig } from './types'

export const GameViewProvider = ({ children }: PropsWithChildren) => {
	const viewConfig = useMemo<ViewConfig>(
		() => ({
			cellSize: 30,
			font: 'Tektur',
			animationDuration: 300,
			bevelWidth: 3,
			borderWidth: 0.5,
			animationsEnabled: true,
		}),
		[]
	)

	return (
		<GameViewContext.Provider value={viewConfig}>
			{children}
		</GameViewContext.Provider>
	)
}
