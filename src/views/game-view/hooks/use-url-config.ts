import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FieldType, GameParams } from '@/engine'
import { parseToNumber } from '@/shared/utils/parse-to-number'

export const useUrlConfig = ({
	defaultParams,
	defaultType = 'classic',
}: {
	defaultParams: GameParams
	defaultType: FieldType
}) => {
	const [searchParams, setSearchParams] = useSearchParams()

	const [cols, rows, mines] = [
		parseToNumber(searchParams.get('cols')) || defaultParams.cols,
		parseToNumber(searchParams.get('rows')) || defaultParams.rows,
		parseToNumber(searchParams.get('mines')) || defaultParams.mines,
	]

	const type = (searchParams.get('type') as FieldType) || defaultType
	const seed = searchParams.get('seed') || String(Date.now())
	const params = { cols, rows, mines }

	useEffect(() => {
		const newSearchParams = Object.entries({ ...params, type, seed }).map(
			([k, v]) => [k, String(v)]
		)
		setSearchParams(new URLSearchParams(newSearchParams))
	}, [cols, rows, mines, type, seed, setSearchParams])

	return { params, type, seed }
}
