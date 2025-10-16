'use client'

interface Props {
  currentStep: number
  setStep: (step: number) => void
}

export default function AppointmentStepTabs({ currentStep, setStep }: Props) {
  const steps = ['Select Service', 'Pick Date & Time', 'Confirm Payment']

  return (
    <div className="flex justify-center items-center gap-4 my-6">
      {steps.map((label, index) => {
        const stepNum = index + 1
        const isActive = currentStep === stepNum
        const isUnlocked = stepNum <= currentStep
        return (
          <button
            key={label}
            disabled={!isUnlocked}
            onClick={() => isUnlocked && setStep(stepNum)}
            className={`px-5 py-2 border rounded-full transition-all ${
              isActive
                ? 'bg-black text-white border-black'
                : isUnlocked
                ? 'bg-white border-gray-400 hover:bg-gray-100'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
