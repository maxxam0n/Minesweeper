import { useCallback, useRef } from 'react'
import { LayerRenderer, LayerShapes } from '@/shared/canvas'

export const useMaskRender = () => {
	const previousShapes = useRef<LayerShapes>(new Map())

	const maskRenderer = useCallback<LayerRenderer>(
		({ ctx, shapes, drawShapes, opacity }) => {
			previousShapes.current.forEach(shape => {
				// Открыли клетку (кусочек маски)
				if (!shapes.has(shape.id)) {
					const { x, y, width, height } = shape.shapeParams.box
					ctx.clearRect(x, y, width, height)
					previousShapes.current.delete(shape.id)
				}
			})

			const shapesToDraw: LayerShapes = new Map()

			shapes.forEach(shape => {
				// Отрисовка маски
				if (!previousShapes.current.has(shape.id)) {
					previousShapes.current.set(shape.id, shape)
					shapesToDraw.set(shape.id, shape)
				}
			})

			if (shapesToDraw.size) drawShapes(ctx, shapes, opacity)
		},
		[]
	)

	return { maskRenderer }
}
