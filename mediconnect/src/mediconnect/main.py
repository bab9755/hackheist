#!/usr/bin/env python
import sys
from mediconnect.crew import MediconnectCrew

# This main file is intended to be a way for you to run your
# crew locally, so refrain from adding unnecessary logic into this file.
# Replace with inputs you want to test with, it will automatically
# interpolate any tasks and agents information
def generate_patient_report(name, age, symptoms_summary, previous_diagnosis, prescribed_medicine):
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

    Prescribed Medicine:
    ------------------------------
    {prescribed_medicine}

    -------------------------
    Report End
    -------------------------
    """
    return report

# Example usage:
name = "John Doe"
age = 45
symptoms_summary = "Patient reported frequent headaches, fatigue, and occasional nausea."
previous_diagnosis = "Diagnosed with hypertension in 2021. No other chronic conditions noted."
prescribed_medicine = "Lisinopril 10mg once daily; advised to take ibuprofen for headaches if needed."

patient_report = generate_patient_report(name, age, symptoms_summary, previous_diagnosis, prescribed_medicine)
print(patient_report)


def run():
    """
    Run the crew.

    """
    # print("Starting the messaging session...")
    # print("Bot: Hello, how can I help you today?")
    # while True:
    user_message = input("my head hurts")

    inputs = {
                'topic': f'LLMs',
                'patient_report': f'{patient_report}',
                'user_input': f'{user_message}',
                'patient_message': f'{user_message}',
                'doctor_schedule': 'Monday: 9AM - 10AM\nTuesday: 10AM - 11AM\nWednesday: 11AM - 12PM\nThursday: 12PM - 1PM\nFriday: 1PM - 2PM\nSaturday: 2PM - 3PM\nSunday: 3PM - 4PM',
            }
    MediconnectCrew().crew().kickoff(inputs=inputs)
    

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
