import { GameWidget } from '@/widgets/game-widget'
import { useUrlConfig } from '../hooks/use-url-config'

export const GameView = () => {
	const config = useUrlConfig({
		defaultParams: { cols: 10, mines: 10, rows: 10 },
		defaultType: 'classic',
	})

	return (
		<div>
			<GameWidget config={config}></GameWidget>
		</div>
	)
}
