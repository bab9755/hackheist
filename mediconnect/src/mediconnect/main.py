#!/usr/bin/env python
import sys
from mediconnect.crew import MediconnectCrew
import requests
import time

# This main file is intended to be a way for you to run your
# crew locally, so refrain from adding unnecessary logic into this file.
# Replace with inputs you want to test with, it will automatically
# interpolate any tasks and agents information

def generate_patient_report(name, age, symptoms_summary, previous_diagnosis, prescribed_medicine, preexisting_conditiion, doctor):
    report = f"""
    -------------------------
        Patient Report
    -------------------------
    Name: {name}
    Age: {age}

    Last Symptoms / Past Diseases:
    ------------------------------
    {symptoms_summary}

    Previous Diagnosis:
    ------------------------------
    {previous_diagnosis}

    Preexisting Conditions:
    ------------------------------
    {preexisting_conditiion}

    Doctor Name:
    ------------------------------
    {doctor}

    Prescribed Medicine:
    ------------------------------
    {prescribed_medicine}

    -------------------------
    Report End
    -------------------------
    """
    return report



def run():
    """
    Run the crew.
    """

    user_message = "my head hurts and I threw up."

    patient_id = 'patient_003'
    response = requests.get(f"http://127.0.0.1:5000/get_patient/{patient_id}")
    
    patient_metadata = response.json()


    print(patient_metadata)

    name = patient_metadata['first_name'] + ' ' + patient_metadata['last_name']
    age = patient_metadata['date_of_birth']
    symptoms_summary = " ".join(patient_metadata['symptoms'])
    previous_diagnosis = patient_metadata['diagnosis']
    prescribed_medicine = " ".join(patient_metadata['prescriptions'])
    preexisting_conditiion = " ".join(patient_metadata['pre_existing_conditions'])
    doctor = patient_metadata['doctor_name']
    patient_report = generate_patient_report(name, age, symptoms_summary, previous_diagnosis, preexisting_conditiion, doctor, prescribed_medicine)
    print(patient_report)
    # print("Starting the messaging session...")
    # print("Bot: Hello, how can I help you today?")
    # while True:
    

    inputs = {
                'topic': f'LLMs',
                'patient_report': f'{patient_report}',
                'user_input': f'{user_message}',
                'patient_message': f'{user_message}',
                'doctor_schedule': 'Monday: 9AM - 10AM\nTuesday: 10AM - 11AM\nWednesday: 11AM - 12PM\nThursday: 12PM - 1PM\nFriday: 1PM - 2PM\nSaturday: 2PM - 3PM\nSunday: 3PM - 4PM',
            }
    result = MediconnectCrew().crew().kickoff(inputs=inputs)
    print(result)


def train():
    """
    Train the crew for a given number of iterations.
    """
    inputs = {
        "topic": "AI LLMs"
    }
    try:
        MediconnectCrew().crew().train(n_iterations=int(sys.argv[1]), filename=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while training the crew: {e}")

def replay():
    """
    Replay the crew execution from a specific task.
    """
    try:
        MediconnectCrew().crew().replay(task_id=sys.argv[1])

    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}")

def test():
    """
    Test the crew execution and returns the results.
    """
    inputs = {
        "topic": "AI LLMs"
    }
    try:
        MediconnectCrew().crew().test(n_iterations=int(sys.argv[1]), openai_model_name=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}")
