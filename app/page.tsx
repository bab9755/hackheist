'use client'
import { useState } from 'react';
import PatientForm from './components/patientForm';
import DoctorForm from './components/doctorForm';

export default function Home() {
  const [step, setStep] = useState(1);

  const goToNextStep = () => setStep(step + 1);
  const goToPreviousStep = () => setStep(step - 1);

  return (
    <div className="App">
      {step === 1 && <PatientForm goToNextStep={goToNextStep} />}
      {step === 2 && <DoctorForm goToPreviousStep={goToPreviousStep} />}
    </div>
  );
}
