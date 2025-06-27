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

	const solve = (data: CellData[][]) => {
		setProbabilities(new Solver({ ...props, data }).solve())
	}

	return { probabilities, solve }
}
