// import { useState } from 'react';

// interface Medication {
//   medicine: string;
//   repeat: string;
//   duration: string;
//   sideEffects: string;
// }

// export default function CombinedForm() {
//   const [currentStep, setCurrentStep] = useState(1);
//   const [formData, setFormData] = useState({
//     patientId: '',
//     firstName: '',
//     lastName: '',
//     dateOfBirth: '',
//     gender: '',
//     phoneNumber: '',
//     address: '',
//     symptoms: '',
//     preExistingConditions: '',
//     doctorName: '',
//     dateOfVisit: '',
//     initialDiagnosis: '',
//     prescriptions: [] as Medication[],
//   });
//   const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSelectedFiles(e.target.files);
//   };

//   const addMedication = () => {
//     setFormData((prevData) => ({
//       ...prevData,
//       prescriptions: [
//         ...prevData.prescriptions,
//         { medicine: '', repeat: '', duration: '', sideEffects: '' },
//       ],
//     }));
//   };

//   const handleMedicationChange = (index: number, field: keyof Medication, value: string) => {
//     const updatedPrescriptions = formData.prescriptions.map((medication, i) =>
//       i === index ? { ...medication, [field]: value } : medication
//     );
//     setFormData((prevData) => ({
//       ...prevData,
//       prescriptions: updatedPrescriptions,
//     }));
//   };

//   const removeMedication = (index: number) => {
//     const updatedPrescriptions = formData.prescriptions.filter((_, i) => i !== index);
//     setFormData((prevData) => ({
//       ...prevData,
//       prescriptions: updatedPrescriptions,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Prepare form data for submission
//     const data = new FormData();
//     Object.entries(formData).forEach(([key, value]) => {
//       if (key === 'prescriptions') {
//         data.append(key, JSON.stringify(value));
//       } else {
//         data.append(key, value as string);
//       }
//     });

//     if (selectedFiles && selectedFiles.length > 0) {
//       data.append('file', selectedFiles[0]);
//     }

//     try {
//       const response = await fetch('http://127.0.0.1:5000/add_patient_with_pdf', {
//         method: 'POST',
//         body: data,
//       });
//       const result = await response.json();

//       if (response.ok) {
//         alert(result.message);
//       } else {
//         alert(result.error);
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       alert('Failed to submit form');
//     }
//   };

//   const goToNextStep = () => {
//     setCurrentStep((prev) => prev + 1);
//   };

//   const goToPreviousStep = () => {
//     setCurrentStep((prev) => prev - 1);
//   };

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       <div className="max-w-2xl mx-auto bg-white p-8 shadow-md text-black rounded-lg">
//         {currentStep === 1 && (
//           <>
//             <h2 className="text-2xl font-semibold mb-6">Patient Information</h2>
//             <form>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">First Name</label>
//                   <input
//                     type="text"
//                     name="firstName"
//                     placeholder="Your first name"
//                     value={formData.firstName}
//                     onChange={handleInputChange}
//                     className="w-full border border-gray-300 rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Last Name</label>
//                   <input
//                     type="text"
//                     name="lastName"
//                     placeholder="Your last name"
//                     value={formData.lastName}
//                     onChange={handleInputChange}
//                     className="w-full border border-gray-300 rounded-lg p-2"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Date of Birth</label>
//                   <input
//                     type="date"
//                     name="dateOfBirth"
//                     value={formData.dateOfBirth}
//                     onChange={handleInputChange}
//                     className="w-full border border-gray-300 rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Gender</label>
//                   <select
//                     name="gender"
//                     value={formData.gender}
//                     onChange={handleInputChange}
//                     className="w-full border border-gray-300 rounded-lg p-2"
//                   >
//                     <option value="">Select gender</option>
//                     <option value="Male">Male</option>
//                     <option value="Female">Female</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Phone Number</label>
//                   <input
//                     type="tel"
//                     name="phoneNumber"
//                     placeholder="Enter mobile number"
//                     value={formData.phoneNumber}
//                     onChange={handleInputChange}
//                     className="w-full border border-gray-300 rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Address</label>
//                   <input
//                     type="text"
//                     name="address"
//                     placeholder="Enter patient address"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     className="w-full border border-gray-300 rounded-lg p-2"
//                   />
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">Symptoms</label>
//                 <textarea
//                   name="symptoms"
//                   placeholder="Type patient complaints"
//                   value={formData.symptoms}
//                   onChange={handleInputChange}
//                   className="w-full border border-gray-300 rounded-lg p-2 h-24"
//                 ></textarea>
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">Pre-existing conditions</label>
//                 <input
//                   type="text"
//                   name="preExistingConditions"
//                   placeholder="Any pre-existing conditions"
//                   value={formData.preExistingConditions}
//                   onChange={handleInputChange}
//                   className="w-full border border-gray-300 rounded-lg p-2"
//                 />
//               </div>

//               <div className="mb-6">
//                 <label className="block text-sm font-medium mb-1">Past medical reports</label>
//                 <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 text-center text-gray-500">
//                   <input
//                     type="file"
//                     accept=".pdf"
//                     onChange={handleFileChange}
//                     className="hidden"
//                     id="fileUpload"
//                   />
//                   <label htmlFor="fileUpload" className="cursor-pointer text-blue-500 hover:text-blue-700">
//                     Upload a file or drag and drop
//                   </label>
//                   <p className="text-xs mt-1">PDF up to 10MB</p>
//                   {selectedFiles && (
//                     <div className="mt-2 text-sm text-gray-600">
//                       <ul>
//                         {Array.from(selectedFiles).map((file, index) => (
//                           <li key={index}>{file.name}</li>
//                         ))}
//                       </ul>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="flex justify-end">
//                 <button type="button" onClick={goToNextStep} className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
//                   Next
//                 </button>
//               </div>
//             </form>
//           </>
//         )}

//         {currentStep === 2 && (
//           <>
//             <h2 className="text-2xl font-semibold mb-6">Doctor Information</h2>
//             <form onSubmit={handleSubmit}>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Doctor Name</label>
//                   <input
//                     type="text"
//                     name="doctorName"
//                     placeholder="Doctor's name"
//                     value={formData.doctorName}
//                     onChange={handleInputChange}
//                     className="w-full border border-gray-300 rounded-lg p-2"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Date of Visit</label>
//                   <input
//                     type="date"
//                     name="dateOfVisit"
//                     value={formData.dateOfVisit}
//                     onChange={handleInputChange}
//                     className="w-full border border-gray-300 rounded-lg p-2"
//                   />
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">Initial diagnosis and thoughts</label>
//                 <textarea
//                   name="initialDiagnosis"
//                   placeholder="Type diagnosis"
//                   value={formData.initialDiagnosis}
//                   onChange={handleInputChange}
//                   className="w-full border border-gray-300 rounded-lg p-2 h-24"
//                 ></textarea>
//               </div>

//               <h3 className="text-xl font-semibold mb-2">Medications</h3>
//               {formData.prescriptions.map((medication, index) => (
//                 <div key={index} className="mb-4">
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium mb-1">Medicine</label>
//                       <input
//                         type="text"
//                         placeholder="Enter medication"
//                         className="w-full border border-gray-300 rounded-lg p-2"
//                         value={medication.medicine}
//                         onChange={(e) => handleMedicationChange(index, 'medicine', e.target.value)}
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium mb-1">Repeat</label>
//                       <input
//                         type="text"
//                         placeholder="Every X hours"
//                         className="w-full border border-gray-300 rounded-lg p-2"
//                         value={medication.repeat}
//                         onChange={(e) => handleMedicationChange(index, 'repeat', e.target.value)}
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium mb-1">Duration</label>
//                       <input
//                         type="text"
//                         placeholder="For X days"
//                         className="w-full border border-gray-300 rounded-lg p-2"
//                         value={medication.duration}
//                         onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
//                       />
//                     </div>
//                   </div>

//                   <div className="flex items-center mt-4">
//                     <div className="flex-1">
//                       <label className="block text-sm font-medium mb-1">Potential Side Effects</label>
//                       <input
//                         type="text"
//                         placeholder="Enter side effects"
//                         className="w-full border border-gray-300 rounded-lg p-2"
//                         value={medication.sideEffects}
//                         onChange={(e) => handleMedicationChange(index, 'sideEffects', e.target.value)}
//                       />
//                                         </div>
//                     <button
//                       type="button"
//                       onClick={() => removeMedication(index)}
//                       className="ml-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
//                       aria-label="Remove medication"
//                     >
//                       ✕
//                     </button>
//                   </div>
//                 </div>
//               ))}

//               <div className="mb-4">
//                 <button
//                   type="button"
//                   onClick={addMedication}
//                   className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
//                 >
//                   Add Medication
//                 </button>
//               </div>

//               <div className="flex justify-between">
//                 <button type="button" onClick={goToPreviousStep} className="text-gray-500">
//                   Back
//                 </button>
//                 <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
//                   Finish
//                 </button>
//               </div>
//             </form>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

