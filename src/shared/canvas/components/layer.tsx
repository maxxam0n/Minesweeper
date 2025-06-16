import {
	PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useMemo,
} from 'react'
import { LayerContext } from '../model/layer-context'
import { ShapeLayerContext } from '../model/shape-layer-context'

interface LayerProps extends PropsWithChildren {
	name: string
	opacity?: number
	zIndex?: number
}

export const Layer = ({
	name,
	children,
	opacity = 0,
	zIndex = 0,
}: LayerProps) => {
	const registry = useContext(LayerContext)

	if (!registry) {
		throw new Error(
			'Ошибка регистрации слоя, Layer может быть использован только внутри Canvas компонента'
		)
	}

	const style = useMemo(() => ({ zIndex }), [zIndex])

	const refCallback = useCallback(
		(canvasElement: HTMLCanvasElement | null) => {
			if (canvasElement && registry) {
				registry.registerLayer(name, canvasElement)
			}
		},
		[name, registry]
	)

	useEffect(() => {
		return () => {
			registry.unregisterLayer(name)
		}
	}, [name, registry])

	const shapeLayerData = useMemo(() => ({ opacity, name }), [name, opacity])

	return (
		<ShapeLayerContext.Provider value={shapeLayerData}>
			<canvas
				className="absolute top-0 left-0"
				ref={refCallback}
				style={style}
			/>
			{children}
		</ShapeLayerContext.Provider>
	)
}
