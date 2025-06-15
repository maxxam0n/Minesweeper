import { useContext, useEffect, useId } from 'react'
import { DrawFun, ShapeParams } from './types'
import { CanvasContext } from '../model/canvas-context'

export const useShape = (
	draw: DrawFun,
	shapeParams: ShapeParams,
	deps: React.DependencyList
) => {
	const { setShape, removeShape } = useContext(CanvasContext)
	const id = useId()

	useEffect(() => {
		const shapeData = { id, draw, shapeParams }
		setShape(shapeData)

		return () => removeShape(shapeData)
	}, [
		...deps,
		shapeParams.layer,
		shapeParams.zIndex,
		id,
		setShape,
		removeShape,
	])
}
