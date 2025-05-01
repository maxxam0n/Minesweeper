import { useState, useRef } from 'react'
import { FieldParams } from '@/modules/game-field'

interface StatisticState {
	totalClicks: number
	lastCellsOpened: number
}

export const useStatistic = () => {
	const [score, setScore] = useState(0)
	const [efficiency, setEfficiency] = useState(0)
	const statsRef = useRef<StatisticState>({
		totalClicks: 0,
		lastCellsOpened: 0,
	})

	/**
	 * Calculates game score based on:
	 * - Cells opened (more cells = more points)
	 * - Time (less time = more points)
	 * - Game difficulty (more mines relative to field size = higher difficulty multiplier)
	 */
	const calculateScore = (
		cellsOpened: number,
		time: number,
		config: FieldParams
	): number => {
		if (cellsOpened === 0 || time === 0) return 0

		const totalCells = config.cols * config.rows
		const mineRatio = config.mines / totalCells
		const difficultyMultiplier = 1 + mineRatio * 10 // Higher ratio = higher multiplier

		const basePoints = 10

		// Time penalty - decreases as time increases
		// We use Math.max to ensure we don't go below a minimum value
		const timeMultiplier = Math.max(0.2, 1 - time / 1000) // Time in seconds

		// Calculate score: points per cell * cells opened * difficulty * time factor
		const calculatedScore = Math.round(
			basePoints * cellsOpened * difficultyMultiplier * timeMultiplier
		)

		return calculatedScore
	}

	/**
	 * Calculates efficiency as ratio of opened cells to total clicks
	 * Higher ratio is better (opened more cells with fewer clicks)
	 */
	const calculateEfficiency = (
		cellsOpened: number,
		totalClicks: number
	): number => {
		if (totalClicks === 0 || cellsOpened === 0) return 0

		// Efficiency is the ratio of cells opened to total clicks (max 100%)
		const ratio = cellsOpened / totalClicks
		return Math.min(ratio, 1) * 100 // Convert to percentage, max 100%
	}

	const updateStatistic = ({
		cellsOpened,
		time,
		config,
	}: {
		cellsOpened: number
		time: number
		config: FieldParams
	}) => {
		// If cellsOpened increased, increment total clicks
		if (cellsOpened > statsRef.current.lastCellsOpened) {
			statsRef.current.totalClicks++
			statsRef.current.lastCellsOpened = cellsOpened
		}

		const calculatedScore = calculateScore(cellsOpened, time, config)
		setScore(calculatedScore)

		const calculatedEfficiency = calculateEfficiency(
			cellsOpened,
			statsRef.current.totalClicks
		)
		setEfficiency(calculatedEfficiency)
	}

	return {
		score,
		efficiency,
		updateStatistic,
		formattedEfficiency: `${efficiency.toFixed(1)}%`,
	}
}
