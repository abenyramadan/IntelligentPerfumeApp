import React, { useState, useRef, useEffect } from 'react'

export const Select = ({ value, onValueChange, children, placeholder }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Find selected label
  let selectedLabel = placeholder || ''
  React.Children.forEach(children, child => {
    if (child.type && child.type.displayName === 'SelectContent') {
      React.Children.forEach(child.props.children, item => {
        if (item.props && item.props.value === value) {
          selectedLabel = item.props.children
        }
      })
    }
  })

  // Inject onSelect handler
  const injectHandler = (child) => {
    if (React.isValidElement(child)) {
      if (child.type && child.type.displayName === 'SelectContent') {
        return React.cloneElement(child, {
          open,
          children: React.Children.map(child.props.children, injectHandler)
        })
      }
      if (child.type && child.type.displayName === 'SelectItem') {
        return React.cloneElement(child, {
          onSelect: (v) => {
            onValueChange(v)
            setOpen(false)
          }
        })
      }
      return child
    }
    return child
  }

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen(!open)}>
        <SelectTrigger>
          <span className={value ? 'text-gray-900' : 'text-gray-500'}>{selectedLabel}</span>
        </SelectTrigger>
      </div>
      {open && injectHandler(children)}
    </div>
  )
}

export const SelectTrigger = ({ children }) => (
  <div className="w-full border rounded-md px-3 py-2 bg-white cursor-pointer">{children}</div>
)

export const SelectValue = ({ placeholder }) => (
  <span className="text-gray-500">{placeholder}</span>
)

export const SelectContent = ({ children, open }) => (
  open ? <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg grid grid-cols-1 gap-1">{children}</div> : null
)
SelectContent.displayName = 'SelectContent'

export const SelectItem = ({ value, children, onSelect }) => (
  <button type="button" className="text-left w-full px-3 py-2 border rounded hover:bg-gray-50" onClick={() => onSelect?.(value)}>
    {children}
  </button>
)
SelectItem.displayName = 'SelectItem'
SelectItem.displayName = 'SelectItem'


