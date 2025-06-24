import { useContext, useEffect, useId } from 'react'
import { ShapeRenderer, ShapeParams, ShapeDrawingData } from './types'
import { ShapeRegistryContext } from '../model/shape-registry-context'
import { LayerNameContext } from '../model/layer-name-context'
import { TransformContext } from '../model/transform-context'
import { GroupContext } from '../model/group-context'

export const useShape = (draw: ShapeRenderer, shapeParams: ShapeParams) => {
	const registry = useContext(ShapeRegistryContext)
	const layerName = useContext(LayerNameContext)
	const transforms = useContext(TransformContext)
	const groupParams = useContext(GroupContext)

	if (!registry || !layerName) {
		throw new Error(`Ошибка регистрации фигуры, отсутствует registry`)
	}

	const { removeShape, setShape } = registry
	const id = useId()

	useEffect(() => {
		const { opacity = 1, zIndex = 0 } = groupParams ?? {}

		const prepareTransform = (ctx: CanvasRenderingContext2D) => {
			transforms.forEach(transform => {
				if (transform.type === 'translate') {
					ctx.translate(transform.translateX, transform.translateY)
				} else if (transform.type === 'scale') {
					ctx.scale(transform.scaleX, transform.scaleY)
				} else if (transform.type === 'rotation' && transform.angle !== 0) {
					ctx.rotate(transform.angle)
				}
			})
		}

		const shapeData: ShapeDrawingData = {
			id,
			draw,
			transform: prepareTransform,
			layerName,
			shapeParams: {
				box: shapeParams.box,
				opacity: 1 - (1 - opacity) * (1 - (shapeParams.opacity ?? 1)),
				zIndex: zIndex + (shapeParams.zIndex ?? 0),
			},
		}

		setShape(shapeData)

		return () => removeShape(shapeData)
	}, [
		id,
		layerName,
		shapeParams,
		groupParams,
		transforms,
		setShape,
		removeShape,
		draw,
	])
}
