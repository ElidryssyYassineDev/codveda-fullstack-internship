// client/src/hooks/useCountUp.js
// Animates a number from 0 up to `target` using requestAnimationFrame —
// this is the real version of the concept mockup's demo count-up.

import { useState, useEffect, useRef } from 'react'

function useCountUp(target, duration = 700) {
  const [value, setValue] = useState(0)
  const startRef = useRef(null)

  useEffect(() => {
    if (typeof target !== 'number' || Number.isNaN(target)) return
    startRef.current = null
    let frameId

    function step(timestamp) {
      if (startRef.current === null) startRef.current = timestamp
      const progress = Math.min((timestamp - startRef.current) / duration, 1)
      setValue(Math.round(progress * target))
      if (progress < 1) frameId = requestAnimationFrame(step)
    }

    frameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frameId)
  }, [target, duration])

  return value
}

export default useCountUp