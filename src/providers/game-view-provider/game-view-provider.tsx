import { PropsWithChildren, useMemo } from 'react'
import { GameViewContext } from './game-view-context'
import { ViewConfig } from './types'

export const GameViewProvider = ({ children }: PropsWithChildren) => {
	const viewConfig = useMemo<ViewConfig>(
		() => ({ cellSize: 30, font: 'Tektur', bevelWidth: 3, borderWidth: 1 }),
		[]
	)

	return (
		<GameViewContext.Provider value={viewConfig}>
			{children}
		</GameViewContext.Provider>
	)
}
