import { useContext } from 'react'
import { GameViewContext } from './game-view-context'

export const useViewConfig = () => {
	const config = useContext(GameViewContext)
	if (!config) {
		throw new Error('Ошибка получения визуальных настроек')
	}

	return config
}
