import { useRef, useState } from 'react'
import { Animation, AnimationQuery } from './types'

export const useAnimations = () => {
	const nextAnimationId = useRef(0)
	const [animations, setAnimations] = useState<Animation[]>([])

	const addAnimations = (animations: AnimationQuery[]) => {
		const newAnimations = animations.map(animQuery => ({
			id: `animation-${nextAnimationId.current++}`,
			...animQuery,
		}))

		setAnimations(prevAnimations => [...prevAnimations, ...newAnimations])
	}

	const addStaggeredAnimations = (
		anims: Omit<AnimationQuery, 'delay'>[],
		delay: number,
		batchSize: number = 1
	) => {
		let animationsBatch: AnimationQuery[] = []

		let batched = 0
		let batchedDelay = 0

		anims.forEach(anim => {
			let summaryDelay = batchedDelay

			if (batched < batchSize) {
				batched += 1
			} else {
				batched = 0
				batchedDelay += delay
				summaryDelay += batchedDelay
			}

			animationsBatch.push({ ...anim, delay: summaryDelay })
		})

		addAnimations(animationsBatch)
	}

	const removeAnimations = (animationIds: string[]) => {
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
