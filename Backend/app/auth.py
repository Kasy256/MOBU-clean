from functools import wraps
from flask import request, jsonify, g
import firebase_admin
from firebase_admin import auth as firebase_auth


def verify_firebase_token(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization', None)
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Missing or invalid Authorization header'}), 401
        id_token = auth_header.split('Bearer ')[-1]
        try:
            decoded_token = firebase_auth.verify_id_token(id_token)
            g.user_id = decoded_token['uid']
            g.user = decoded_token
        except Exception as e:
            return jsonify({'error': 'Invalid or expired token', 'details': str(e)}), 401
        return f(*args, **kwargs)
    return decorated_function 