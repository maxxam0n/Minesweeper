import { useContext, useEffect, useId } from 'react'
import { DrawFun, ShapeParams } from './types'
import { CanvasContext } from '../model/canvas-context'
import { ShapeLayerContext } from '../model/shape-layer-context'

export const useShape = (
	draw: DrawFun,
	shapeParams: ShapeParams,
	deps: React.DependencyList
) => {
	const registry = useContext(CanvasContext)
	const layer = useContext(ShapeLayerContext)

	if (!registry || !layer) {
		throw new Error(
			'useShape должнен быть использован внутри Canvas и Layer компонент'
		)
	}

	const { removeShape, setShape } = registry
	const id = useId()

	useEffect(() => {
		const shapeData = { id, draw, layer, shapeParams }
		setShape(shapeData)

		return () => removeShape(shapeData)
	}, [...deps, layer, shapeParams.zIndex, id, setShape, removeShape])
}
