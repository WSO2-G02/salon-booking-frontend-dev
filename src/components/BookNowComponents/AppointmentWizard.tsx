"use client";

import { useState } from "react";
import AppointmentStepTabs from "./AppointmentStepTabs";
import StepSelectService from "./StepSelectService";
import StepPickDate from "./StepPickDate";
import StepConfirmPayment from "./StepConfirmPayment";

export default function AppointmentWizard() {
  const [step, setStep] = useState(1);
  const [service, setService] = useState<any>(null);
  const [date, setDate] = useState<{ date: string } | null>(null);
  const [time, setTime] = useState<{ time: string } | null>(null);

  const [staffId, setStaffId] = useState<number | null>(null);
  const [durationMinutes, setDurationMinutes] = useState<number | null>(null);

  return (
    <div className="py-2 ">
      <AppointmentStepTabs currentStep={step} setStep={setStep} />

      {step === 1 && (
        <StepSelectService
          selected={service}
          onSelect={(s) => {
            setService(s);
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <StepPickDate
          onNext={(data) => {
            setDate({ date: data.date });
            setTime({ time: data.time });
            setStaffId(1); // Set the selected staff ID here
            setDurationMinutes(60); // Set the duration in minutes here
            setStep(3);
          }}
          prevData={date && time ? { date: date.date, time: time.time } : undefined}
        />
      )}

      {step === 3 &&
        date &&
        time &&
        staffId !== null &&
        durationMinutes !== null && (
          <StepConfirmPayment
            service={service}
            date={date.date}
            time={time.time}
            staffId={staffId}
            durationMinutes={durationMinutes}
          />
        )}
    </div>
  );
}
