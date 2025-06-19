import { useState, useRef } from 'react'
import { GameParams } from '@/engine'

interface StatisticState {
	totalClicks: number
	lastRevealed: number
}

export const useStatistic = () => {
	const [score, setScore] = useState(0)
	const [efficiency, setEfficiency] = useState(0)

	const statsRef = useRef<StatisticState>({ totalClicks: 0, lastRevealed: 0 })

	/**
	 * Calculates game score based on:
	 * - Cells revealed (more cells = more points)
	 * - Time (less time = more points)
	 * - Game difficulty (more mines relative to field size = higher difficulty multiplier)
	 */
	const calculateScore = (
		revealed: number,
		time: number,
		params: GameParams
	): number => {
		if (revealed === 0 || time === 0) return 0

		const totalCells = params.cols * params.rows
		const mineRatio = params.mines / totalCells
		const difficultyMultiplier = 1 + mineRatio * 10 // Higher ratio = higher multiplier

		const basePoints = 10

		// Time penalty - decreases as time increases
		// We use Math.max to ensure we don't go below a minimum value
		const timeMultiplier = Math.max(0.2, 1 - time / 1000) // Time in seconds

		// Calculate score: points per cell * cells revealed * difficulty * time factor
		const calculatedScore = Math.round(
			basePoints * revealed * difficultyMultiplier * timeMultiplier
		)

		return calculatedScore
	}

	/**
	 * Calculates efficiency as ratio of revealed cells to total clicks
	 * Higher ratio is better (revealed more cells with fewer clicks)
	 */
	const calculateEfficiency = (
		revealed: number,
		totalClicks: number
	): number => {
		if (totalClicks === 0 || revealed === 0) return 0

		// Efficiency is the ratio of cells revealed to total clicks (max 100%)
		const ratio = revealed / totalClicks
		return Math.min(ratio, 1) * 100 // Convert to percentage, max 100%
	}

	const updateStatistic = ({
		revealed,
		time,
		params,
	}: {
		revealed: number
		time: number
		params: GameParams
	}) => {
		// If revealed cells increased, increment total clicks
		if (revealed > statsRef.current.lastRevealed) {
			statsRef.current.totalClicks++
			statsRef.current.lastRevealed = revealed
		}

		const calculatedScore = calculateScore(revealed, time, params)
		setScore(calculatedScore)

		const calculatedEfficiency = calculateEfficiency(
			revealed,
			statsRef.current.totalClicks
		)
		setEfficiency(calculatedEfficiency)
	}

	const resetStatistic = () => {
		statsRef.current = { totalClicks: 0, lastRevealed: 0 }
		setScore(0)
		setEfficiency(0)
	}

	return {
		score,
		efficiency,
		updateStatistic,
		resetStatistic,
	}
}
