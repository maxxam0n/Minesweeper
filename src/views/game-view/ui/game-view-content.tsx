import { MinesweeperGame } from '@/widgets/minesweeper-game'
import { GameViewProvider } from '@/providers/game-view'
import { GameColorsProvider } from '@/providers/game-colors'
import { useUrlConfig } from '../lib/use-url-config'
import { useMockParams } from '../lib/use-mock-params'

export const GameViewContent = () => {
	// оригинальная логика
	const urlConfig = useUrlConfig({
		defaultParams: { cols: 10, mines: 10, rows: 10 },
		defaultType: 'square',
		defaultMode: 'guessing',
	})

	// Debug. Создаем моковые данные
	// const { config, fieldData } = useMockParams()

	return (
		<div className="bg-background h-screen flex justify-center items-center">
			<GameColorsProvider>
				<GameViewProvider>
					<MinesweeperGame config={urlConfig} data={undefined} />
				</GameViewProvider>
			</GameColorsProvider>
		</div>
	)
}
