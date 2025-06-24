import { memo, useEffect, useState } from 'react'
import { CircleShape } from '@/ui-engine'

interface Particle {
	id: number
	x: number
	y: number
	vx: number
	vy: number
	life: number
	initialLife: number
	color: string
	size: number
}

interface ParticleEffectProps {
	id: string
	onComplete: (id: string) => void
	cx: number
	cy: number
	particleCount?: number
	duration?: number
}

const createParticles = (cx: number, cy: number, count: number): Particle[] => {
	const particles: Particle[] = []
	const colors = ['#ff4500', '#ff8c00', '#ffd700', '#ff6347']

	for (let i = 0; i < count; i++) {
		const angle = Math.random() * Math.PI * 2
		const speed = Math.random() * 3 + 1 // Случайная скорость от 1 до 4
		const life = Math.random() * 60 + 30 // Время жизни от 30 до 90 кадров (~0.5-1.5с)

		particles.push({
			id: i,
			x: cx,
			y: cy,
			vx: Math.cos(angle) * speed,
			vy: Math.sin(angle) * speed,
			life: life,
			initialLife: life,
			color: colors[Math.floor(Math.random() * colors.length)],
			size: Math.random() * 2 + 1, // Размер от 1 до 3
		})
	}
	return particles
}

export const ParticleEffect = memo(
	({
		id,
		onComplete,
		cx,
		cy,
		particleCount = 15,
		duration = 1500,
	}: ParticleEffectProps) => {
		// Создаем частицы один раз при монтировании
		const [particles, setParticles] = useState(() =>
			createParticles(cx, cy, particleCount)
		)

		useEffect(() => {
			let frameId: number
			let effectStartTime: number | null = null
			const gravity = 0.05 // Сила "гравитации"

			const animate = (timestamp: number) => {
				if (effectStartTime === null) effectStartTime = timestamp

				setParticles(prevParticles => {
					const updatedParticles = prevParticles
						.map(p => {
							return {
								...p,
								x: p.x + p.vx,
								y: p.y + p.vy,
								vy: p.vy + gravity,
								life: p.life - 1,
							}
						})
						.filter(p => p.life > 0) // Удаляем "мертвые" частицы

					if (updatedParticles.length === 0) {
						onComplete(id)
						cancelAnimationFrame(frameId)
					}

					return updatedParticles
				})

				if (timestamp - effectStartTime < duration) {
					frameId = requestAnimationFrame(animate)
				} else {
					onComplete(id)
				}
			}

			frameId = requestAnimationFrame(animate)
			return () => cancelAnimationFrame(frameId)
		}, [id, onComplete, duration])

		return (
			<>
				{particles.map(p => (
					<CircleShape
						key={p.id}
						cx={p.x}
						cy={p.y}
						radius={p.size}
						fillColor={p.color}
						opacity={p.life / p.initialLife}
					/>
				))}
			</>
		)
	}
)
