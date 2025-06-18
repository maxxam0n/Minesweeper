import {
	useMemo,
	PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
} from 'react'
import { LayerRegistryContext } from '../model/layer-registry-context'
import { layerNameContext } from '../model/layer-name-context'
import { LayerRenderer } from '../lib/types'

interface LayerProps extends PropsWithChildren {
	name: string
	renderer?: LayerRenderer
	opacity?: number
	zIndex?: number
}

export const Layer = ({
	name,
	children,
	renderer,
	opacity,
	zIndex = 0,
}: LayerProps) => {
	const registry = useContext(LayerRegistryContext)

	if (!registry) {
		throw new Error('Ошибка регистрации слоя')
	}
	const { registerLayer, unregisterLayer } = registry

	const refCallback = useCallback(
		(canvasElement: HTMLCanvasElement | null) => {
			if (canvasElement) {
				registerLayer(name, canvasElement, opacity, renderer)
			}
		},
		[name, registerLayer]
	)

	useEffect(() => {
		return () => unregisterLayer(name)
	}, [name, unregisterLayer])

	return (
		<layerNameContext.Provider value={name}>
			<canvas
				className="absolute top-0 left-0"
				ref={refCallback}
				style={useMemo(() => ({ zIndex }), [zIndex])}
			/>
			{children}
		</layerNameContext.Provider>
	)
}
