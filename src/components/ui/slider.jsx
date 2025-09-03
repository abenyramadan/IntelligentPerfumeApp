export const Slider = ({ value = [0], min = 0, max = 100, step = 1, onValueChange, className = '' }) => {
  const current = Array.isArray(value) ? value[0] : value
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={current}
      onChange={(e) => onValueChange?.([Number(e.target.value)])}
      className={`w-full ${className}`}
    />
  )
}


