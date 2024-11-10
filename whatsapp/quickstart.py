import json 
from dotenv import load_dotenv
import os 
import requests
# import aiohttp
# import asyncio

dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path) 


ACCESS_TOKEN = os.getenv("ACCESS_TOKEN")
RECIPIENT_WAID = os.getenv("WANUMBER")
PHONE_NUMBER_ID = os.getenv("PHONE_NUMBER_ID")
VERSION = os.getenv("VERSION")

APP_ID = os.getenv("APP_ID")
APP_SECRET = os.getenv("APP_SECRET")


#template from whatsapp 

def send_watsapp_message():
    url = f"https://graph.facebook.com/{VERSION}/{PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization":"Bearer " + ACCESS_TOKEN,
        "Content-Type": "application/json",
    }
    data = {
        "messaging_product":"whatsapp",
        "to":RECIPIENT_WAID ,
        "type":"template",
        "template": {"name":"hello_world","language":{"code":"en_US"}},

    }

    response = requests.post(url,headers = headers,json=data)
    print(f"recipient number:{RECIPIENT_WAID}")

    return response
## call the function 
#response = send_watsapp_message()

#print(response.status_code)
#print(response.json())

## CUSTOM MESSAGE TEST 

def get_text_message_input(recipient,text):
    return json.dumps(
        {
            "messaging_product":"whatsapp",
            "recipient_type": "individual",
            "to": recipient,
            "type":"text",
            "text":{"preview_url":False, "body":text},

        }
    )

def send_message(data):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f'Bearer {ACCESS_TOKEN}',

    }
    url = f"https://graph.facebook.com/{VERSION}/{PHONE_NUMBER_ID}/messages"

    response = requests.post(url,data = data, headers = headers)
    if response.status_code ==200:
        print("Status: ",response.status_code)
        print("Content-Type: ", response.headers["content-type"])
        print("Body: ", response.text)

        return response
    else:
        print(response.status_code)
        print(response.text)
        return response
    
data = get_text_message_input(recipient=RECIPIENT_WAID,text="HELLO BIGMAN, THIS IS A TEST, SUCCESFULL? ")

response = send_message(data)