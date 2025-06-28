import { MinesweeperGame } from '@/widgets/minesweeper-game'
import { GameSettingsProvider } from '@/providers/game-settings'
import { useUrlConfig } from '../lib/use-url-config'
// import { useMockParams } from '../lib/use-mock-params'

export const GameView = () => {
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
			<GameSettingsProvider>
				<MinesweeperGame config={urlConfig} data={undefined} />
			</GameSettingsProvider>
		</div>
	)
}
