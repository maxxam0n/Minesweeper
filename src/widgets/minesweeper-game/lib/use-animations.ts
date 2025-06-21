import { useRef, useState } from 'react'
import { Animation, AnimationQuery } from './types'

export const useAnimations = (animationsEnabled: boolean) => {
	const nextAnimationId = useRef(0)
	const [animations, setAnimations] = useState<Animation[]>([])

	const addAnimations = (animations: AnimationQuery[]) => {
		if (!animationsEnabled) return

		const newAnimations = animations.map(({ type, position }) => ({
			id: `animation-${nextAnimationId.current++}`,
			type,
			position,
		}))

		setAnimations(prevAnimations => [...prevAnimations, ...newAnimations])
	}

	const removeAnimations = (animationIds: string[]) => {
		if (!animationsEnabled) return

		setAnimations(prev => {
			const remainingAnimations = prev.filter(
				anim => !animationIds.includes(anim.id)
			)
			if (remainingAnimations.length === 0) {
				nextAnimationId.current = 0
			}
			return remainingAnimations
		})
	}
	return {
		animations,
		addAnimations,
		removeAnimations,
	}
}
