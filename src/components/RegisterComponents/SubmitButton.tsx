'use client'

interface SubmitButtonProps {
  text: string
  loading?: boolean
}

export default function SubmitButton({ text, loading }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`w-full py-3 rounded font-semibold transition ${
        loading
          ? 'bg-gray-400 text-white cursor-not-allowed'
          : 'bg-black text-white hover:bg-red-500'
      }`}
    >
      {loading ? 'Processing...' : text}
    </button>
  )
}
