import { useContext } from 'react'
import { ColorsContext } from '../model/ColorsContext'

export const useFieldColors = () => {
	const colors = useContext(ColorsContext)

	if (!colors) {
		throw new Error('Ошибка получения цветовой палитры игрового поля')
	}

	return colors
}
