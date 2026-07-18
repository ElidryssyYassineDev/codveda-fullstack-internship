// client/src/components/Skeleton.jsx
// Purpose: single reusable shimmer block. Every skeleton screen below
// is just several of these, sized and arranged to match the real
// layout they're standing in for.

function Skeleton({ width, height = '14px', radius = '6px', className = '' }) {
  return (
    <span
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius: radius }}
      aria-hidden="true"
    />
  )
}

export default Skeleton