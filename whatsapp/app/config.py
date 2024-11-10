import sys
import os 

from dotenv import load_dotenv

import logging 

#dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '..', '..', '.env')

load_dotenv(dotenv_path)

def load_configurations(app):
    
    app.config["ACCESS_TOKEN"] = os.getenv("ACCESS_TOKEN")
    print(f"ACCESS_TOKEN: {app.config['ACCESS_TOKEN']}")
    app.config["OUR_PHONE_NUMBER"] = os.getenv("OUR_PHONE_NUMBER")
    app.config["APP_ID"] = os.getenv("APP_ID")
    app.config["APP_SECRET"] = os.getenv("APP_SECRET")
    app.config["RECIPIENT_WAID"] = os.getenv("WANUMBER")
    app.config["VERSION"] = os.getenv("VERSION")
    app.config["PHONE_NUMBER_ID"] = os.getenv("PHONE_NUMBER_ID")
    app.config["VERIFY_TOKEN"] = os.getenv("VERIFY_TOKEN")
    print(f"Verifytoken: {app.config['VERIFY_TOKEN']}")


def configure_logging():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        stream=sys.stdout,
    )