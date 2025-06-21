import { MinesweeperGame } from '@/widgets/minesweeper-game'
import { GameViewProvider } from '@/providers/game-view-provider'
import { GameColorsProvider } from '@/providers/game-colors-provider'
import { useUrlConfig } from '../hooks/use-url-config'

export const GameViewContent = () => {
	const config = useUrlConfig({
		defaultParams: { cols: 10, mines: 10, rows: 10 },
		defaultType: 'square',
		defaultMode: 'guessing',
	})

	return (
		<div className="bg-background h-screen flex justify-center items-center">
			<GameColorsProvider>
				<GameViewProvider>
					<MinesweeperGame gameConfig={config} />
				</GameViewProvider>
			</GameColorsProvider>
		</div>
	)
}
