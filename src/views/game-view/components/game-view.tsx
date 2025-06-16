import { GameWidget } from '@/widgets/game-widget'
import { useUrlConfig } from '../hooks/use-url-config'

export const GameView = () => {
	const config = useUrlConfig({
		defaultParams: { cols: 10, mines: 10, rows: 10 },
		defaultType: 'square',
		defaultMode: 'guessing',
	})

	return (
		<div className="bg-background h-screen flex justify-center items-center">
			<GameWidget config={config} />
		</div>
	)
}
