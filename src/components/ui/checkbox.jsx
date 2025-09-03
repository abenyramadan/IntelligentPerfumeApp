export const Checkbox = ({ id, checked, disabled = false, onCheckedChange, className = '' }) => {
  return (
    <input
      id={id}
      type="checkbox"
      checked={!!checked}
      disabled={disabled}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      className={`h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 ${className}`}
    />
  )
}


