import { useContext } from 'react'
import { GameSettingsContext } from './game-settings-context'

export const useGameSettings = () => {
	const settings = useContext(GameSettingsContext)
	if (!settings) {
		throw new Error('Ошибка получения настроек приложения')
	}

	return settings
}
