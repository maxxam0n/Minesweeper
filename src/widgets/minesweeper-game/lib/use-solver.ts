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

export const useSolver = (props: SolverProps) => {
	const [probabilities, setProbabilities] = useState<MineProbability[]>(() =>
		new Solver(props).solve()
	)

	const [connectedRegions, setConnectedRegions] = useState<CellData[][]>(() =>
		new Solver(props).createConnectedRegions()
	)

	const solve = (data: CellData[][]) => {
		setProbabilities(new Solver({ ...props, data }).solve())
	}

	// Отладочные методы
	const findRegions = (data: CellData[][]) => {
		setConnectedRegions(
			new Solver({ ...props, data }).createConnectedRegions()
		)
	}

	return { probabilities, connectedRegions, solve, findRegions }
}
