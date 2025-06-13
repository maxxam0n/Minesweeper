import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { parseToNumber } from '@/shared/utils/parse-to-number'
import { FieldType, GameParams } from '@/engine'
import { GameConfig } from '../lib/types'

export const useUrlConfig = ({
	defaultParams,
	defaultType = 'classic',
}: {
	defaultParams: GameParams
	defaultType: FieldType
}): GameConfig => {
	const [searchParams, setSearchParams] = useSearchParams()

	const [cols, rows, mines] = [
		parseToNumber(searchParams.get('cols')) || defaultParams.cols,
		parseToNumber(searchParams.get('rows')) || defaultParams.rows,
		parseToNumber(searchParams.get('mines')) || defaultParams.mines,
	]

	const type = (searchParams.get('type') as FieldType) ?? defaultType

	const params = { cols, rows, mines }

	useEffect(() => {
		const searchParams = Object.entries({ ...params, type }).map(([k, v]) => [
			k,
			String(v),
		])
		setSearchParams(new URLSearchParams(searchParams))
	}, [cols, rows, mines, type])

	return { params, type }
}
