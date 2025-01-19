import { ReactNode } from 'react'
import { FaPlus } from 'react-icons/fa6'

interface IRoundedButtonProps {
  icon: ReactNode
  className: string
  onClick: () => void
}

function RoundedButton({ icon, onClick, className }: IRoundedButtonProps) {
  return (
    <button
      type="button"
      className={`h-14 w-14 flex items-center justify-center rounded-full bg-blue-400 hover:bg-blue-500 ${className} `}
      onClick={onClick}
    >
      {icon}
    </button>
  )
}

export default RoundedButton
