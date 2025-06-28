import { useState } from 'react'
import {
	CellData,
	FieldType,
	GameParams,
	MineProbability,
	Solver,
} from '@/engine'

interface SolverProps {
	data: CellData[][]
	params: GameParams
	type: FieldType
}

export const useSolver = (config: SolverProps) => {
	const [probabilities, setProbabilities] = useState<MineProbability[]>([])
	const [connectedRegions, setConnectedRegions] = useState<CellData[][]>([])

	const solve = (data: CellData[][]) => {
		setProbabilities(new Solver({ ...config, data }).solve())
	}

	// Отладочные методы
	const findRegions = (data: CellData[][]) => {
		setConnectedRegions(
			new Solver({ ...config, data }).createConnectedRegions()
		)
	}

	return { probabilities, connectedRegions, solve, findRegions }
}
