import { useContext } from 'react'
import { FieldPropsContext } from './field-props-context'

export const useFieldProps = () => {
	const fieldProps = useContext(FieldPropsContext)
	if (!fieldProps) {
		throw new Error('Ошибка получения конфигурации игрового поля')
	}

	return fieldProps
}
