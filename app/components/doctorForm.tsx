// components/DoctorForm.tsx
import { useState } from 'react';

interface DoctorFormProps {
  goToPreviousStep: () => void;
}

interface Medication {
  medicine: string;
  repeat: string;
  duration: string;
  sideEffects: string;
}

export default function DoctorForm({ goToPreviousStep }: DoctorFormProps) {
  const [formData, setFormData] = useState({
    doctorName: '',
    dateOfVisit: '',
    initialDiagnosis: '',
  });
  const [medications, setMedications] = useState<Medication[]>([
    { medicine: '', repeat: '', duration: '', sideEffects: '' },
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addMedication = () => {
    setMedications([
      ...medications,
      { medicine: '', repeat: '', duration: '', sideEffects: '' },
    ]);
  };

  const handleMedicationChange = (index: number, field: keyof Medication, value: string) => {
    const updatedMedications = medications.map((medication, i) =>
      i === index ? { ...medication, [field]: value } : medication
    );
    setMedications(updatedMedications);
  };

  const removeMedication = (index: number) => {
    const updatedMedications = medications.filter((_, i) => i !== index);
    setMedications(updatedMedications);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append('doctor_name', formData.doctorName);
    data.append('date_of_visit', formData.dateOfVisit);
    data.append('diagnosis', formData.initialDiagnosis);
    data.append('prescriptions', JSON.stringify(medications));

    try {
      const response = await fetch('/add_patient_with_pdf', {
        method: 'POST',
        body: data,
      });
      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        goToPreviousStep();
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form');
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white p-8 shadow-md text-black rounded-lg">
        <h2 className="text-2xl font-semibold mb-6">Doctor&apos;s Input</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Doctor&apos;s Name</label>
              <input
                type="text"
                name="doctorName"
                placeholder="Doctor's name"
                value={formData.doctorName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date of Visit</label>
              <input
                type="date"
                name="dateOfVisit"
                value={formData.dateOfVisit}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Initial diagnosis and thoughts</label>
            <textarea
              name="initialDiagnosis"
              placeholder="Type diagnosis"
              value={formData.initialDiagnosis}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg p-2 h-24"
            ></textarea>
          </div>

          <h3 className="text-xl font-semibold mb-2">Medications</h3>
          {medications.map((medication, index) => (
            <div key={index} className="mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Medicine</label>
                  <input
                    type="text"
                    placeholder="Enter medication"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={medication.medicine}
                    onChange={(e) => handleMedicationChange(index, 'medicine', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Repeat</label>
                  <input
                    type="text"
                    placeholder="Every X hours"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={medication.repeat}
                    onChange={(e) => handleMedicationChange(index, 'repeat', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Duration</label>
                  <input
                    type="text"
                    placeholder="For X days"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={medication.duration}
                    onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center mt-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Potential Side Effects</label>
                  <input
                    type="text"
                    placeholder="Enter side effects"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={medication.sideEffects}
                    onChange={(e) => handleMedicationChange(index, 'sideEffects', e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeMedication(index)}
                  className="ml-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  aria-label="Remove medication"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          <div className="mb-4">
            <button
              type="button"
              onClick={addMedication}
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
            >
              Add Medication
            </button>
          </div>

          <div className="flex justify-between">
            <button type="button" onClick={goToPreviousStep} className="text-gray-500">
              Back
            </button>
            <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
              Finish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

