import React from 'react'

export const FlagIcon: React.FC = () => {
	return (
		<>
			{/* Основание */}
			<rect x="6" y="23" width="18" height="3" fill="#616161" />
			<rect x="9" y="21" width="12" height="2" fill="#616161" />

			{/* Древко */}
			<rect x="13.5" y="4" width="3" height="19" fill="#616161" />

			{/* Флаг */}
			<polygon
				points="16.5,6 24.5,9.5 16.5,13"
				fill="#FF0000"
				stroke="#A00000"
				strokeWidth="0.7"
			/>
		</>
	)
}
