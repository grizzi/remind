import { useMemo, useRef, useEffect, useState } from 'react'
import TagChip from './TagChip'
import { Label } from '../../api/schema'

function TagDisplay({ labels }: { labels: Label[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [visibleCount, setVisibleCount] = useState(labels.length)

  // Calculate how many tags can be shown
  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const containerWidth = container.offsetWidth

    const children = Array.from(container.children) as HTMLDivElement[]

    // Approximate tag width fallback, in case measurement is unavailable
    const moreChipReserve = 40
    let usedWidth = 0
    let count = 0

    for (let i = 0; i < labels.length; i++) {
      const childWidth = children[i]?.offsetWidth
      if (usedWidth + childWidth + moreChipReserve > containerWidth) break
      usedWidth += childWidth
      count++
    }

    setVisibleCount(count)
  }, [labels])

  const displayedTags = useMemo(
    () => labels.slice(0, visibleCount),
    [labels, visibleCount],
  )
  const hiddenCount = labels.length - visibleCount

  return (
    <div
      className='flex flex-wrap items-start justify-end overflow-hidden max-w-full'
      ref={containerRef}
    >
      {displayedTags.map(label => (
        <TagChip key={label.name} name={label.name} />
      ))}
      {hiddenCount > 0 && (
        <span className='rounded-full bg-gray-200 px-2 py-1 mt-1 text-xs text-gray-700'>
          +{hiddenCount}
        </span>
      )}
    </div>
  )
}

export default TagDisplay
