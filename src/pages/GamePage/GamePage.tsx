import { Game } from '@/widgets/game'
import { useFieldConfig } from './hooks/useFieldConfig'
import { DEFAULT_PARAMS } from './lib/constants'

export const GamePage = () => {
	const config = useFieldConfig(DEFAULT_PARAMS)

	return (
		<div>
			<Game config={config} />
		</div>
	)
}
