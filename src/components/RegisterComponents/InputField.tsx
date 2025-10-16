'use client'

interface InputFieldProps {
  label: string
  name: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function InputField({ label, name, type = 'text', value, onChange }: InputFieldProps) {
  return (
    <div className="flex flex-col mb-4">
      <label htmlFor={name} className="text-sm font-medium mb-1 text-gray-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-red-400"
        required
      />
    </div>
  )
}
