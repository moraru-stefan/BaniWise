interface DonutChartSlice {
  label: string
  value: number
  color: string
}

interface DonutChartProps {
  data: DonutChartSlice[]
}

const RADIUS = 40
const STROKE_WIDTH = 16
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

interface PositionedSlice extends DonutChartSlice {
  length: number
  offset: number
}

function positionSlices(data: DonutChartSlice[]): PositionedSlice[] {
  const total = data.reduce((sum, slice) => sum + slice.value, 0)

  return data.reduce<PositionedSlice[]>((positioned, slice) => {
    const previous = positioned[positioned.length - 1]
    const offset = previous ? previous.offset + previous.length : 0
    const fraction = total > 0 ? slice.value / total : 0
    const length = fraction * CIRCUMFERENCE

    return [...positioned, { ...slice, length, offset }]
  }, [])
}

/** A hand-built donut chart, no charting library. Each slice is a circle
 * "cut" to the right length with stroke-dasharray, then rotated into place
 * with stroke-dashoffset -- plain SVG, no trigonometry needed. */
export function DonutChart({ data }: DonutChartProps) {
  const slices = positionSlices(data)

  return (
    <svg viewBox="0 0 100 100" className="h-40 w-40 -rotate-90" role="img" aria-label="Spending by category chart">
      <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="#e2e8f0" strokeWidth={STROKE_WIDTH} />
      {slices.map((slice) => (
        <circle
          key={slice.label}
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke={slice.color}
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={`${slice.length} ${CIRCUMFERENCE - slice.length}`}
          strokeDashoffset={-slice.offset}
        />
      ))}
    </svg>
  )
}
