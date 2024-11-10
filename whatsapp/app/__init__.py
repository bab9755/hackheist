from flask import Flask
from app.config import load_configurations, configure_logging 
from .views import webhook_blueprint


def create_app():
    app = Flask(__name__)


    # loading config 

    load_configurations(app)

    configure_logging()

    # import and the register blueprint, if any 

    app.register_blueprint(webhook_blueprint)

    return app