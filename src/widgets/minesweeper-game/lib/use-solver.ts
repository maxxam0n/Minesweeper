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
		new Solver(props).analyze()
	)

	const analyze = (data: CellData[][]) => {
		setProbabilities(new Solver({ ...props, data }).analyze())
	}

	return { probabilities, analyze }
}
