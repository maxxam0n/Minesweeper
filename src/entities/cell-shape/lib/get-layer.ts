import { CellDrawingView } from '@/engine'
import { Layer } from '@/shared/canvas'

export const getLayer = (view: CellDrawingView): Layer => {
	switch (view) {
		case CellDrawingView.Empty:
		case CellDrawingView.Digit:
		case CellDrawingView.Mine:
		case CellDrawingView.Exploded:
		case CellDrawingView.Missed:
			return 'static'

		case CellDrawingView.Closed:
		case CellDrawingView.Flag:
		default:
			return 'dynamic'
	}
}
