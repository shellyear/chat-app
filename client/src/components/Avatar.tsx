import React from 'react'

interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

function Avatar({ name, size = 'md', className = '' }: AvatarProps) {
  const firstLetter = name.charAt(0).toUpperCase()

  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg'
  }

  const bgColors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500'
  ]

  const bgColor = bgColors[name.length % bgColors.length]

  return (
    <div
      className={`${sizeClasses[size]} ${bgColor} ${className} rounded-full flex items-center justify-center text-white font-semibold`}
    >
      {firstLetter}
    </div>
  )
}

export default Avatar
