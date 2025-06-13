import { useUrlConfig } from '../hooks/use-url-config'
import { GameLogicWrapper } from './game-logic-wrapper'

export const GameView = () => {
	const config = useUrlConfig({
		defaultParams: { cols: 10, mines: 10, rows: 10 },
		defaultType: 'classic',
	})

	return (
		<div>
			<GameLogicWrapper config={config}></GameLogicWrapper>
		</div>
	)
}
