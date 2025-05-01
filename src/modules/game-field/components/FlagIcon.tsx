import { useFieldColors } from '../hooks/useFieldColors'

export const FlagIcon = () => {
	const colors = useFieldColors()

	return (
		<>
			{/* Основание */}
			<rect x="6" y="23" width="18" height="3" fill={colors.FLAG_SHAFT} />
			<rect x="9" y="21" width="12" height="2" fill={colors.FLAG_SHAFT} />

			{/* Древко */}
			<rect x="13.5" y="4" width="3" height="19" fill={colors.FLAG_SHAFT} />

			{/* Флаг */}
			<polygon
				points="16.5,6 24.5,9.5 16.5,13"
				fill={colors.FLAG}
				stroke={colors.FLAG}
				strokeWidth="0.7"
			/>
		</>
	)
}
