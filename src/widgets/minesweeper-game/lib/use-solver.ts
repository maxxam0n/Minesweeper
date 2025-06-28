import { useState } from 'react'
import {
	CellData,
	FieldType,
	GameParams,
	MineProbability,
	Solver,
} from '@/engine'

interface SolverProps {
	skipImmediatelySolve?: boolean
	data: CellData[][]
	params: GameParams
	type: FieldType
}

export const useSolver = ({ skipImmediatelySolve, ...config }: SolverProps) => {
	const [probabilities, setProbabilities] = useState<MineProbability[]>(() =>
		skipImmediatelySolve ? [] : new Solver(config).solve()
	)

	const [connectedRegions, setConnectedRegions] = useState<CellData[][]>(() =>
		skipImmediatelySolve ? [] : new Solver(config).createConnectedRegions()
	)

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
