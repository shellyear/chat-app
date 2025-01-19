import { ChangeEventHandler, ForwardedRef, forwardRef, MutableRefObject } from 'react'
import { CiSearch } from 'react-icons/ci'

interface ISearchInputProps {
  value: string
  onChange: ChangeEventHandler<HTMLInputElement>
}

const SearchInput = forwardRef(({ value, onChange }: ISearchInputProps, ref: ForwardedRef<HTMLInputElement>) => {
  return (
    <div className="relative">
      <input
        ref={ref}
        type="text"
        placeholder="Search"
        value={value}
        onChange={onChange}
        className="w-full pl-8 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <CiSearch className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-400" />
    </div>
  )
})

export default SearchInput
