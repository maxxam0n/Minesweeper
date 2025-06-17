import { useContext, useEffect, useId } from 'react'
import { ClearFun, DrawFun, ShapeParams } from './types'
import { CanvasContext } from '../model/canvas-context'
import { ShapeLayerContext } from '../model/shape-layer-context'

export const useShape = (
	draw: DrawFun,
	clear: ClearFun,
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
		const shapeData = {
			id,
			draw,
			clear,
			layer: layer.name,
			layerOpacity: layer.opacity,
			shapeParams,
		}
		setShape(shapeData)

		return () => removeShape(shapeData)
	}, [
		...deps,
		id,
		layer,
		shapeParams.zIndex,
		shapeParams.opacity,
		shapeParams.box,
		setShape,
		removeShape,
		draw,
		clear,
	])
}
