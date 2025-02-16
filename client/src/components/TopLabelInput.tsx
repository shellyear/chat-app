import { ChangeEventHandler } from 'react'

interface TopLabelInputProps {
  name: string
  label: string
  type?: string
  value: string
  required?: boolean
  pattern?: string
  minLength?: number
  maxLength?: number
  labelClassname?: string
  inputClassname?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
}

function TopLabelInput({
  name,
  label,
  value,
  type = 'text',
  pattern,
  minLength,
  maxLength,
  required = false,
  labelClassname,
  inputClassname,
  onChange
}: TopLabelInputProps) {
  return (
    <div className="relative mb-4 w-full">
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        required={required}
        pattern={pattern}
        minLength={minLength}
        maxLength={maxLength}
        onChange={onChange}
        className={`peer w-full h-[54px] px-4 py-3 text-gray-900 border rounded-md focus:outline-none transition-colors border-gray-300 focus:border-blue-500 focus:bg-white focus:border-2 ${inputClassname}`}
      />
      <label
        htmlFor={name}
        className={`absolute -top-2 left-2 px-1 text-xs bg-white transition-colors tracking-tighter text-gray-600 focus:text-blue-500 peer-focus:font-medium ${labelClassname}`}
      >
        {label}
      </label>
    </div>
  )
}

export default TopLabelInput
