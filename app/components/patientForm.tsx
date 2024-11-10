// import { useState } from 'react';

// interface PatientFormProps {
//   goToNextStep: () => void;
// }

// export default function PatientForm({ goToNextStep }: PatientFormProps) {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     dateOfBirth: '',
//     gender: '',
//     phoneNumber: '',
//     address: '',
//     symptoms: '',
//     preExistingConditions: '',
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

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
  
//     // Prepare form data for submission
//     const data = new FormData();
//     data.append('first_name', formData.firstName);
//     data.append('last_name', formData.lastName);
//     data.append('date_of_birth', formData.dateOfBirth);
//     data.append('gender', formData.gender);
//     data.append('phone_number', formData.phoneNumber);
//     data.append('address', formData.address);
//     data.append('symptoms', formData.symptoms);
//     data.append('pre_existing_conditions', formData.preExistingConditions);
//     data.append('doctor_name', ''); // Include doctor_name as an empty string for this form
//     data.append('date_of_visit', ''); // Placeholder for date_of_visit
//     data.append('patient_id',"")

//     // Only accept the first selected file, as the backend is designed for a single PDF
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
//         goToNextStep();
//       } else {
//         alert(result.error);
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       alert('Failed to submit form');
//     }
//   };

//   return (
//     <div className="p-8 bg-gray-50 min-h-screen">
//       <div className="max-w-2xl mx-auto bg-white p-8 shadow-md text-black rounded-lg">
//         <h2 className="text-2xl font-semibold mb-6">Patient Information</h2>

//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">First Name</label>
//               <input
//                 type="text"
//                 name="firstName"
//                 placeholder="Your first name"
//                 value={formData.firstName}
//                 onChange={handleInputChange}
//                 className="w-full border border-gray-300 rounded-lg p-2"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Last Name</label>
//               <input
//                 type="text"
//                 name="lastName"
//                 placeholder="Your last name"
//                 value={formData.lastName}
//                 onChange={handleInputChange}
//                 className="w-full border border-gray-300 rounded-lg p-2"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Date of Birth</label>
//               <input
//                 type="date"
//                 name="dateOfBirth"
//                 value={formData.dateOfBirth}
//                 onChange={handleInputChange}
//                 className="w-full border border-gray-300 rounded-lg p-2"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Gender</label>
//               <select
//                 name="gender"
//                 value={formData.gender}
//                 onChange={handleInputChange}
//                 className="w-full border border-gray-300 rounded-lg p-2"
//               >
//                 <option value="">Select gender</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//               </select>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Phone Number</label>
//               <input
//                 type="tel"
//                 name="phoneNumber"
//                 placeholder="Enter mobile number"
//                 value={formData.phoneNumber}
//                 onChange={handleInputChange}
//                 className="w-full border border-gray-300 rounded-lg p-2"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Address</label>
//               <input
//                 type="text"
//                 name="address"
//                 placeholder="Enter patient address"
//                 value={formData.address}
//                 onChange={handleInputChange}
//                 className="w-full border border-gray-300 rounded-lg p-2"
//               />
//             </div>
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-1">Symptoms</label>
//             <textarea
//               name="symptoms"
//               placeholder="Type patient complaints"
//               value={formData.symptoms}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 rounded-lg p-2 h-24"
//             ></textarea>
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium mb-1">Pre-existing conditions</label>
//             <input
//               type="text"
//               name="preExistingConditions"
//               placeholder="Any pre-existing conditions"
//               value={formData.preExistingConditions}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 rounded-lg p-2"
//             />
//           </div>

//           <div className="mb-6">
//             <label className="block text-sm font-medium mb-1">Past medical reports</label>
//             <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 text-center text-gray-500">
//               <input
//                 type="file"
//                 accept=".pdf"
//                 onChange={handleFileChange}
//                 className="hidden"
//                 id="fileUpload"
//               />
//               <label htmlFor="fileUpload" className="cursor-pointer text-blue-500 hover:text-blue-700">
//                 Upload a file or drag and drop
//               </label>
//               <p className="text-xs mt-1">PDF up to 10MB</p>
//               {selectedFiles && (
//                 <div className="mt-2 text-sm text-gray-600">
//                   <ul>
//                     {Array.from(selectedFiles).map((file, index) => (
//                       <li key={index}>{file.name}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="flex justify-end">
//             <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
//               Submit
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

import { useState } from 'react';

interface PatientFormProps {
  goToNextStep: () => void;
}

export default function PatientForm({ goToNextStep }: PatientFormProps) {
  const [formData, setFormData] = useState({
    patientId: '', // Unique identifier
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    address: '',
    symptoms: '',
    preExistingConditions: '',
  });
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Prepare form data for submission
    const data = new FormData();
    data.append('patient_id', formData.patientId); // Send patient_id
    data.append('first_name', formData.firstName);
    data.append('last_name', formData.lastName);
    data.append('date_of_birth', formData.dateOfBirth);
    data.append('gender', formData.gender);
    data.append('phone_number', formData.phoneNumber);
    data.append('address', formData.address);
    data.append('symptoms', formData.symptoms);
    data.append('pre_existing_conditions', formData.preExistingConditions);
    data.append('doctor_name', ''); // Placeholder for doctor_name
    data.append('date_of_visit', ''); // Placeholder for date_of_visit

    // Attach the selected file (if any) as a PDF
    if (selectedFiles && selectedFiles.length > 0) {
      data.append('file', selectedFiles[0]);
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/add_patient_with_pdf', {
        method: 'POST',
        body: data,
      });
      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        goToNextStep();
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
        <h2 className="text-2xl font-semibold mb-6">Patient Information</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Patient ID</label>
            <input
              type="text"
              name="patientId"
              placeholder="Unique Patient ID"
              value={formData.patientId}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="Your first name"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Your last name"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Enter mobile number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                name="address"
                placeholder="Enter patient address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Symptoms</label>
            <textarea
              name="symptoms"
              placeholder="Type patient complaints"
              value={formData.symptoms}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg p-2 h-24"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Pre-existing conditions</label>
            <input
              type="text"
              name="preExistingConditions"
              placeholder="Any pre-existing conditions"
              value={formData.preExistingConditions}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Past medical reports</label>
            <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 text-center text-gray-500">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="fileUpload"
              />
              <label htmlFor="fileUpload" className="cursor-pointer text-blue-500 hover:text-blue-700">
                Upload a file or drag and drop
              </label>
              <p className="text-xs mt-1">PDF up to 10MB</p>
              {selectedFiles && (
                <div className="mt-2 text-sm text-gray-600">
                  <ul>
                    {Array.from(selectedFiles).map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

