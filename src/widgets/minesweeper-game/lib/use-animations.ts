import { useRef, useState } from 'react'
import { Animation, AnimationQuery } from './types'

export const useAnimations = (animationsEnabled: boolean) => {
	const nextAnimationId = useRef(0)
	const [animations, setAnimations] = useState<Animation[]>([])

	const addAnimations = (animations: AnimationQuery[]) => {
		if (!animationsEnabled) return

		const newAnimations = animations.map(animQuery => ({
			id: `animation-${nextAnimationId.current++}`,
			...animQuery,
		}))

		setAnimations(prevAnimations => [...prevAnimations, ...newAnimations])
	}

	const addStaggeredAnimations = (
		anims: AnimationQuery[],
		delay: number,
		startDelay: number = 0
	) => {
		anims.forEach((anim, index) => {
			addAnimations([{ ...anim, delay: startDelay + index * delay }])
		})
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
		addStaggeredAnimations,
	}
}
