#import libraries to be used
from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
from bson import ObjectId

from datetime import datetime
import certifi


#added for file upload
#added to test PDF implementation
from werkzeug.utils import secure_filename
import os
import pymupdf as fitz


app = Flask(__name__)


CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

#added for file upload
#configure upload folder
UPLOAD_FOLDER = 'backend/uploads/'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER



#using mongodba atlas
client = MongoClient("mongodb+srv://hackprinceton:hackprinceton123@cluster0.djq2l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", tlsCAFile=certifi.where())

#main database
db = client.healthcare 




def pdf_to_text(pdf_path):
    """Convert a PDF file to text using PyMuPDF."""
    text = ""
    with fitz.open(pdf_path) as pdf:
        for page_num in range(pdf.page_count):
            page = pdf[page_num]
            text += page.get_text()
    return text




@app.route('/')
def home():
    return "connected to MongoDB Atlas"


#now we need to set up CRUD operations

# #adding a new patient to patients collection
# @app.route('/add_patient', methods=['POST'])
# def add_patient():
    
#     #test print statement
#     #print("add_patient route loaded")
    
#     #conversion with json
#     data = request.json
    
#     #check whether any fields are missing
#     required_fields = ["patient_id", "first_name", "last_name", "date_of_birth", "gender", "phone_number", "address", "date_of_visit", "doctor_name"]
#     missing_fields = [field for field in required_fields if field not in data]
#     if missing_fields:
#         return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

#     #validate date fields
#     try:
#         datetime.strptime(data["date_of_birth"], "%Y-%m-%d")
#         datetime.strptime(data["date_of_visit"], "%Y-%m-%d")
#     except ValueError:
#         return jsonify({"error": "Incorrect date format. Use YYYY-MM-DD."}), 400

    
#     #insert data into database in the patients collection
#     db.patients.insert_one({
#         "patient_id": data.get("patient_id"),
#         "first_name": data.get("first_name"),
#         "last_name": data.get("last_name"),
#         "date_of_birth": data.get("date_of_birth"),
#         "gender": data.get("gender"),
#         "phone_number": data.get("phone_number"),
#         "address": data.get("address"),
#         "date_of_visit": data.get("date_of_visit"),
#         "pre_existing_conditions": data.get("pre_existing_conditions", []),
#         "symptoms": data.get("symptoms", []),
#         "diagnosis": data.get("diagnosis"),
#         "medical_records": data.get("medical_records", []),
#         "prescriptions": data.get("prescriptions", []),
#         "doctor_name": data.get("doctor")
#     })
    
#     #return message that patient has been added successfully
#     return jsonify({"message": "Patient added successfully!"}), 201

@app.route('/add_patient_with_pdf', methods=['POST'])
def add_patient_with_pdf():

    data = request.form.to_dict()

    print("Date of Birth:", data.get("date_of_birth"))
    required_fields = ["patient_id", "first_name", "last_name", "date_of_birth", "gender", "phone_number", "address", "date_of_visit", "doctor_name"]
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400

    # try:
    #     date_of_birth = str(data.get("date_of_birth"))
    #     date_of_visit = str(data.get("date_of_visit"))
    #     datetime.strptime(date_of_birth, "%Y-%m-%d")
    #     datetime.strptime(date_of_visit, "%Y-%m-%d")
    
    # except ValueError:
    #     return jsonify({"error": "Incorrect date format. Use YYYY-MM-DD."}), 400

    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if not file.filename.endswith('.pdf'):
        return jsonify({"error": "Only PDF files are allowed"}), 400

    filename = secure_filename(file.filename)
    pdf_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(pdf_path)
    pdf_text = pdf_to_text(pdf_path)

    medical_record = {
        "date": data["date_of_visit"],
        "content": pdf_text 
    }

    patient_data = {
        "patient_id": data.get("patient_id"),
        "first_name": data.get("first_name"),
        "last_name": data.get("last_name"),
        "date_of_birth": data.get("date_of_birth"),
        "gender": data.get("gender"),
        "phone_number": data.get("phone_number"),
        "address": data.get("address"),
        "date_of_visit": data.get("date_of_visit"),
        "pre_existing_conditions": data.get("pre_existing_conditions", []),
        "symptoms": data.get("symptoms", []),
        "diagnosis": data.get("diagnosis"),
        "medical_records": [medical_record], 
        "prescriptions": data.get("prescriptions", []),
        "doctor_name": data.get("doctor_name")
    }

    db.patients.insert_one(patient_data)

    os.remove(pdf_path)

    return jsonify({"message": "Patient and medical record added successfully!"}), 201




#adding a new reminder to reminders collection
@app.route('/add_reminder', methods=['POST'])
def add_reminder():
    
    #test print statement
    #print("add_reminder route loaded")
    
    data = request.json
    
    #check whether any fields are missing
    if not all(key in data for key in ["patient_id", "type", "message", "schedule"]):
        return jsonify({"error": "Missing fields: patient_id, type, message, and schedule are required."}), 400

    #ensure schedule is a list
    if not isinstance(data["schedule"], list):
        return jsonify({"error": "Schedule must be a list of date-time strings."}), 400



    #insert data in reminders collection
    db.reminders.insert_one({
        "patient_id": data.get("patient_id"),
        "type": data.get("type"),
        "message": data.get("message"),
        "schedule": data.get("schedule", [])
    })
    
    #success return message
    return jsonify({"message": "Reminder added successfully!"}), 201


#testing route
@app.route('/test_route', methods=['GET'])
def test_route():
    print("Test route accessed")
    return jsonify({"message": "Test route works!"})


# #getting a patient from patients collection
# @app.route('/get_patient/<patient_id>', methods=['GET'])
# def get_patient(patient_id):
#     #find patient document in patients collection
#     patient = db.patients.find_one({"patient_id": patient_id})
    
#     #if patient exists
#     if patient:
#         #convert MongoDB document to JSON-serializable dictionary
#         patient['_id'] = str(patient['_id'])
#         return jsonify(patient), 200
#     else:
#         return jsonify({"error": "Patient not found"}), 404

@app.route('/get_patient/<patient_id>', methods=['GET'])
def get_patient(patient_id):
    """
    Fetch patient data by patient_id.
    """
    patient = db.patients.find_one({"patient_id": patient_id})
    
    if patient:
        # Convert MongoDB ObjectId to string for JSON serialization
        patient['_id'] = str(patient['_id'])
        return jsonify(patient), 200
    else:
        return jsonify({"error": "Patient not found"}), 404

@app.route('/update_patient/<patient_id>', methods=['PUT'])
def update_patient(patient_id):
    """
    Update only the fields in the patient's record that are currently empty.
    """
    data = request.json
    patient = db.patients.find_one({"patient_id": patient_id})

    if not patient:
        return jsonify({"error": "Patient not found"}), 404
    
    # Only update fields if they are empty in the database
    update_fields = {}
    for key, value in data.items():
        # Only update if field is empty or not present in the database
        if not patient.get(key):  
            update_fields[key] = value

    if not update_fields:
        return jsonify({"message": "No fields to update."}), 400

    result = db.patients.update_one({"patient_id": patient_id}, {"$set": update_fields})
    
    if result.matched_count > 0:
        return jsonify({"message": "Patient information updated successfully!"}), 200
    else:
        return jsonify({"error": "Failed to update patient information"}), 500


#getting a reminder from reminders collection
@app.route('/get_reminders/<patient_id>', methods=['GET'])
def get_reminders(patient_id):
    #find all reminder documents for given patient_id
    reminders = list(db.reminders.find({"patient_id": patient_id}))
    
    #check if reminders exist for the patient
    if reminders:
        for reminder in reminders:
            reminder['_id'] = str(reminder['_id'])
        return jsonify(reminders), 200
    else:
        return jsonify({"error": "No reminders found for this patient"}), 404

# #updating patient information in patients collection
# @app.route('/update_patient/<patient_id>', methods=['PUT'])
# def update_patient(patient_id):
#     data = request.json
    
#     # update_fields = {}
#     # for key in ["first_name", "last_name", "date_of_birth", "gender", "phone_number", "address", "date_of_visit", "pre_existing_conditions", "symptoms", "diagnosis", "medical_records", "prescriptions", "doctor_name"]:
#     #     if key in data:
#     #         update_fields[key] = data[key]
    
#     allowed_fields = ["first_name", "last_name", "date_of_birth", "gender", "phone_number", "address", "date_of_visit", "pre_existing_conditions", "symptoms", "diagnosis", "medical_records", "prescriptions", "doctor_name"]
#     #validate provided fields
#     update_fields = {key: data[key] for key in allowed_fields if key in data}

#     #check if any update fields are provided
#     if not update_fields:
#         return jsonify({"error": "No valid fields to update."}), 400

#     result = db.patients.update_one({"patient_id": patient_id}, {"$set": update_fields})
    
#     if result.matched_count > 0:
#         return jsonify({"message": "Patient information updated successfully!"}), 200
#     else:
#         return jsonify({"error": "Patient not found"}), 404


#updating reminder information in reminders collection
@app.route('/update_reminder/<reminder_id>', methods=['PUT'])
def update_reminder(reminder_id):
    data = request.json

    # reminder_object_id = ObjectId(reminder_id)
    # update_fields = {}
    # for key in ["type", "message", "schedule"]:
    #     if key in data:
    #         update_fields[key] = data[key]
    
    allowed_fields = ["type", "message", "schedule"]

    try:
        reminder_object_id = ObjectId(reminder_id)
    except Exception as e:
        return jsonify({"error": "Invalid reminder_id format"}), 400

    #validate provided fields
    update_fields = {key: data[key] for key in allowed_fields if key in data}
    if not update_fields:
        return jsonify({"error": "No valid fields to update."}), 400

    #update the reminder document
    result = db.reminders.update_one({"_id": reminder_object_id}, {"$set": update_fields})
    
    if result.matched_count > 0:
        return jsonify({"message": "Reminder updated successfully!"}), 200
    else:
        return jsonify({"error": "Reminder not found"}), 404


#delete patient from patients collection
@app.route('/delete_patient/<patient_id>', methods=['DELETE'])
def delete_patient(patient_id):
    # result = db.patients.delete_one({"patient_id": patient_id})
    # if result.deleted_count > 0:
    #     return jsonify({"message": "Patient deleted successfully!"}), 200
    # else:
    #     return jsonify({"error": "Patient not found"}), 404
    
     #check if the patient exists before deleting
    patient = db.patients.find_one({"patient_id": patient_id})
    if not patient:
        return jsonify({"error": "Patient not found"}), 404

    #delete patient from patients collection
    result = db.patients.delete_one({"patient_id": patient_id})

    if result.deleted_count > 0:
        return jsonify({"message": "Patient deleted successfully!"}), 200
    else:
        return jsonify({"error": "Failed to delete patient"}), 500  
    
#delete reminder from reminders collection
@app.route('/delete_reminder/<reminder_id>', methods=['DELETE'])
def delete_reminder(reminder_id):
    # reminder_object_id = ObjectId(reminder_id)
    # result = db.reminders.delete_one({"_id": reminder_object_id})
    # if result.deleted_count > 0:
    #     return jsonify({"message": "Reminder deleted successfully!"}), 200
    # else:
    #     return jsonify({"error": "Reminder not found"}), 404
    
    try:
        reminder_object_id = ObjectId(reminder_id)
    except Exception:
        return jsonify({"error": "Invalid reminder_id format"}), 400

    #check if the reminder exists before deleting
    reminder = db.reminders.find_one({"_id": reminder_object_id})
    if not reminder:
        return jsonify({"error": "Reminder not found"}), 404

    #delete the reminder from reminders collection
    result = db.reminders.delete_one({"_id": reminder_object_id})

    if result.deleted_count > 0:
        return jsonify({"message": "Reminder deleted successfully!"}), 200
    else:
        return jsonify({"error": "Failed to delete reminder"}), 500 
    


if __name__ == "__main__":
    app.run(debug=True)

