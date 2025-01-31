import { ChangeEventHandler } from 'react'

interface TopLabelInputProps {
  name: string
  label: string
  type?: string
  required?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
}

function TopLabelInput({ name, label, type = 'text', required = false, onChange }: TopLabelInputProps) {
  return (
    <div className="relative mb-4 w-full">
      <label
        htmlFor={name}
        className="absolute -top-2 left-2 px-1 text-xs bg-white transition-colors text-gray-600 focus:text-blue-500"
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        required={required}
        onChange={onChange}
        className="w-full px-4 py-3 text-gray-900 border rounded-md focus:outline-none transition-colors border-gray-300 focus:border-blue-500 focus:bg-white"
      />
    </div>
  )
}

export default TopLabelInput
