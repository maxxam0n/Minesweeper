import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FieldParams } from '@/modules/game-field'
import { parseToNumber } from '@/shared/utils/parseToNumber'

export const useFieldConfig = (params: FieldParams): FieldParams => {
	const [searchParams, setSearchParams] = useSearchParams()

	const cols = parseToNumber(searchParams.get('cols')) || params.cols
	const rows = parseToNumber(searchParams.get('rows')) || params.rows
	const mines = parseToNumber(searchParams.get('mines')) || params.mines

	const type = (searchParams.get('type') as FieldParams['type']) ?? 'classic'

	const config = { cols, rows, mines, type }

	useEffect(() => {
		const params = Object.entries(config).map(([_, val]) => [_, String(val)])
		setSearchParams(new URLSearchParams(params))
	}, [cols, rows, mines, type])

	return config
}
