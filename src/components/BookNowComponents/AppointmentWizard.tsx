'use client'

import { useState } from 'react'
import AppointmentStepTabs from './AppointmentStepTabs'
import StepSelectService from './StepSelectService'
import StepPickDate from './StepPickDate'
import StepConfirmPayment from './StepConfirmPayment'

export default function AppointmentWizard() {
  const [step, setStep] = useState(1)
  const [service, setService] = useState('')
  const [datetime, setDatetime] = useState<{ date: string; time: string } | null>(null)

  return (
    <div className="py-10">
      <AppointmentStepTabs currentStep={step} setStep={setStep} />

      {step === 1 && (
        <StepSelectService
          selected={service}
          onSelect={(s) => {
            setService(s)
            setStep(2)
          }}
        />
      )}

      {step === 2 && (
        <StepPickDate
          onNext={(data) => {
            setDatetime(data)
            setStep(3)
          }}
          prevData={datetime || undefined}
        />
      )}

      {step === 3 && datetime && (
        <StepConfirmPayment service={service} date={datetime.date} time={datetime.time} />
      )}
    </div>
  )
}
