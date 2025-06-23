import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FieldType, GameMode, GameParams } from '@/engine'
import { parseToNumber } from '@/shared/lib/parse-to-number'

export const useUrlConfig = ({
	defaultParams,
	defaultType = 'square',
	defaultMode = 'guessing',
}: {
	defaultParams: GameParams
	defaultType: FieldType
	defaultMode: GameMode
}) => {
	const [searchParams, setSearchParams] = useSearchParams()

	const [cols, rows, mines] = [
		parseToNumber(searchParams.get('cols')) || defaultParams.cols,
		parseToNumber(searchParams.get('rows')) || defaultParams.rows,
		parseToNumber(searchParams.get('mines')) || defaultParams.mines,
	]

	const params = { cols, rows, mines }
	const type = (searchParams.get('type') as FieldType) || defaultType
	const seed = searchParams.get('seed') || String(Date.now())
	const mode = (searchParams.get('mode') as GameMode) || defaultMode

	useEffect(() => {
		const newSearchParams = Object.entries({
			...params,
			type,
			seed,
			mode,
		}).map(([k, v]) => [k, String(v)])
		setSearchParams(new URLSearchParams(newSearchParams))
	}, [cols, rows, mines, type, seed, setSearchParams])

	return { params, type, seed, mode }
}
