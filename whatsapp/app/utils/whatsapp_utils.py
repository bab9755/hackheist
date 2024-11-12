import logging 

from flask import current_app,jsonify
import json
import requests
import re 
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../mediconnect/src')))
from mediconnect.crew import MediconnectCrew
#from ....mediconnect.src.mediconnect.crew import MediconnectCrew
from app.services.openai_service import generate_response
def log_http_response(response):
    logging.info(f"Status: {response.status_code}")
    logging.info(f"Content-type: {response.headers.get('content-type')}")
    logging.info(f"Body: {response.text}")


# just like in the quickstart 
def get_text_message_input(recipient,text):
    return json.dumps(
        {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": recipient,
            "type": "text",
            "text": {"preview_url": False, "body": text},
        }
    )

# def generate_response(response):
#     return response.upper()

def send_message(data):
    url = f"https://graph.facebook.com/{current_app.config['VERSION']}/{current_app.config['PHONE_NUMBER_ID']}/messages"    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {current_app.config['ACCESS_TOKEN']}",
    }

    try:
        response = requests.post(
            url,data =data, headers = headers, timeout = 20
        )
        response.raise_for_status() # Raises an HTTPError if the HTTP request returned an unsuccessful status code
    except requests.Timeout:
        logging.error("Timeout occured while sending message")
        return jsonify({"status":"error","message":"Request timed out"}), 408
    except (
        requests.RequestException
    ) as e:
        logging.error(f"Request failed due to: {e}")
        return jsonify({"status":"error", "message":"Failed to send message"}), 500
    else:
        # if everything is normal, process the response as normal

        log_http_response(response)
        Thread = False
        return response 
    

def process_text_for_whatsapp(text):
    # remove brackets
    pattern = r"\【.*?\】"
    text = re.sub(pattern, "", text).strip()


    # patter to find double asterisks including the world(s) in between 

    pattern = r"\*\*(.*?)\*\*"

    # Replacement pattern with single asterisks
    replacement = r"*\1*"

    # Substitute occurrences of the pattern with the replacement
    whatsapp_style_text = re.sub(pattern, replacement, text)

    return whatsapp_style_text

# make sense of this part 

def process_whatsapp_message(body):


    wa_id = body["entry"][0]["changes"][0]["value"]["contacts"][0]["wa_id"]
    name = body["entry"][0]["changes"][0]["value"]["contacts"][0]["profile"]["name"]

    message = body["entry"][0]["changes"][0]["value"]["messages"][0]
    message_body = message["text"]["body"]
    print(message_body)

    #user_message = message_body

    # patient_id = 'patient_003'
    # response = requests.get(f"http://127.0.0.1:5000/get_patient/{patient_id}")
    
    # patient_metadata = response.json()


  

    # name = patient_metadata['first_name'] + ' ' + patient_metadata['last_name']
    # age = patient_metadata['date_of_birth']
    # symptoms_summary = " ".join(patient_metadata['symptoms'])
    # previous_diagnosis = patient_metadata['diagnosis']
    # # ... existing code ...
    # prescribed_medicine = ''
    # for pres in patient_metadata['prescriptions']:
    #     duration = pres.get('duration', '')
    #     frequency = pres.get('frequency', '')
    #     medicine_name = pres.get('medicine_name', '')
    #     once_daily = pres.get('Once daily', '')
    #     prescribed_medicine += f"{duration} {frequency} {medicine_name} {once_daily} ".strip() + ' '
    # # ... existing code ...
    # preexisting_conditiion = " ".join(patient_metadata['pre_existing_conditions'])
    # doctor = patient_metadata['doctor_name']
    # patient_report = generate_patient_report(name, age, symptoms_summary, previous_diagnosis, preexisting_conditiion, doctor, prescribed_medicine)
    # print(patient_report)
    # # print("Starting the messaging session...")
    # # print("Bot: Hello, how can I help you today?")
    # # while True:

    # inputs = {
    #             'topic': f'LLMs',
    #             'patient_report': f'{patient_report}',
    #             'user_input': f'{user_message}',
    #             'patient_message': f'{user_message}',
    #             'doctor_schedule': 'Monday: 9AM - 10AM\nTuesday: 10AM - 11AM\nWednesday: 11AM - 12PM\nThursday: 12PM - 1PM\nFriday: 1PM - 2PM\nSaturday: 2PM - 3PM\nSunday: 3PM - 4PM',
    #         }

  

    #result = MediconnectCrew().crew().kickoff(inputs=inputs)


    # print("is this the result? ",result)
    # print("the recipienat ",current_app.config["RECIPIENT_WAID"])
    # response = get_text_message_input(current_app.config["RECIPIENT_WAID"], str(result))
    # print("response 1: ",response)
    # response = process_text_for_whatsapp(response)
    # print("response2", response)
    #send_message(data)
   

    
    # # OpenAI Integration
    # print("result :", result)
    # print("Type of resutl. ",type(result))
    # print("Type of resutl. ",type(str(result)))

    response = generate_response(message_body, wa_id, name)
    response = process_text_for_whatsapp(response)

    data = get_text_message_input(current_app.config["RECIPIENT_WAID"], response)
    send_message(data)

    


def is_valid_whatsapp_message(body):
    """
    Check if the incoming webhook event has a valid WhatsApp message structure.
    """
    return (
        body.get("object")
        and body.get("entry")
        and body["entry"][0].get("changes")
        and body["entry"][0]["changes"][0].get("value")
        and body["entry"][0]["changes"][0]["value"].get("messages")
        and body["entry"][0]["changes"][0]["value"]["messages"][0]
    )

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