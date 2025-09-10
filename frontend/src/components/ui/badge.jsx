export const Badge = ({ children, variant = 'secondary', className = '' }) => {
  const variants = {
    secondary: 'bg-gray-100 text-gray-800',
    outline: 'border border-gray-300 text-gray-800',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${variants[variant] || variants.secondary} ${className}`}>
      {children}
    </span>
  )
}


