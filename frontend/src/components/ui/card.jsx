export const Card = ({ className = '', children }) => (
  <div className={`border rounded-lg bg-white ${className}`}>{children}</div>
)

export const CardHeader = ({ className = '', children }) => (
  <div className={`p-4 border-b ${className}`}>{children}</div>
)

export const CardTitle = ({ className = '', children }) => (
  <h3 className={`font-semibold text-gray-900 ${className}`}>{children}</h3>
)

export const CardDescription = ({ className = '', children }) => (
  <p className={`text-sm text-gray-600 ${className}`}>{children}</p>
)

export const CardContent = ({ className = '', children }) => (
  <div className={`p-4 ${className}`}>{children}</div>
)


