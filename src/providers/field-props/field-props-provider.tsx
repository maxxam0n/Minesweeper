import { PropsWithChildren } from 'react'
import { GameParams } from '@/engine'
import { FieldPropsContext } from './field-props-context'
import { FieldInteractions } from './types'

interface FieldProviderProps extends PropsWithChildren {
	size: number
	params: GameParams
	gameOver: boolean
	interactions: FieldInteractions
	removeAnimations: (ids: string[]) => void
	showConnectedRegions?: boolean
	showProbabilities?: boolean
}

export const FieldPropsProvider = ({
	size,
	children,
	interactions,
	...config
}: FieldProviderProps) => {
	const { params } = config

	// Размеры игрового поля
	const [width, height] = [params.cols * size, params.rows * size]

	return (
		<FieldPropsContext.Provider
			value={{ width, height, interactions, ...config }}
		>
			{children}
		</FieldPropsContext.Provider>
	)
}
