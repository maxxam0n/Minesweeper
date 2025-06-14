import { Link } from 'react-router-dom'

export const HomePage = () => {
	return (
		<div>
			<Link to="/game?cols=20&rows=20&mines=30">Game</Link>
		</div>
	)
}
