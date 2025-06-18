import { useContext, useEffect, useId } from 'react'
import { DrawFun, ShapeParams } from './types'
import { ShapeRegistryContext } from '../model/shape-registry-context'
import { layerNameContext } from '../model/layer-name-context'

export const useShape = (draw: DrawFun, shapeParams: ShapeParams) => {
	const registry = useContext(ShapeRegistryContext)
	const layerName = useContext(layerNameContext)

	if (!registry || !layerName) {
		throw new Error(`Ошибка регистрации фигуры, отсутствует registry`)
	}

	const { removeShape, setShape } = registry
	const id = useId()

	useEffect(() => {
		const shapeData = { id, draw, layerName, shapeParams }
		setShape(shapeData)

		return () => removeShape(shapeData)
	}, [id, layerName, shapeParams, setShape, removeShape, draw])
}
