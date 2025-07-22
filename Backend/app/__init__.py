import os
from flask import Flask
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv
from .routes import bp

load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # More permissive CORS for development
    CORS(app, 
         origins=[
             os.getenv('FRONTEND_ORIGIN', 'http://localhost:5173'),
             'http://localhost:3000',
             'http://localhost:5173',
             'http://127.0.0.1:5173',
             'http://127.0.0.1:3000'
         ], 
         supports_credentials=True,
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
         allow_headers=['Content-Type', 'Authorization'])

    # Initialize Firebase Admin
    if not firebase_admin._apps:
        cred = credentials.Certificate(os.getenv('GOOGLE_APPLICATION_CREDENTIALS'))
        firebase_admin.initialize_app(cred)
    app.db = firestore.client()

    # Register blueprints/routes here (to be added)
    app.register_blueprint(bp, url_prefix='/api')

    return app 