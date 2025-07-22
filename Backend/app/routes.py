from flask import Blueprint, request, jsonify, send_file, current_app, g
from .auth import verify_firebase_token
from .openai_utils import generate_react_native_code
from .firestore_utils import save_project, get_projects_by_user, get_project_by_id, update_project, delete_project, save_billing, get_billing_history, get_user_profile, update_user_profile, delete_user_and_projects
from .zip_utils import create_project_zip
import os
import requests
import sys
import traceback

bp = Blueprint('api', __name__)

# --- Code Generation ---
@bp.route('/generate', methods=['POST'])
@verify_firebase_token
def generate():
    try:
        data = request.json
        prompt = data.get('prompt')
        framework = data.get('framework')
        user_id = g.user_id
        print(f"[DEBUG] /generate called with prompt: {prompt}, framework: {framework}, user_id: {user_id}")
        if not prompt or not framework or framework != 'react-native':
            print("[DEBUG] Invalid input")
            return jsonify({'error': 'Invalid input'}), 400
        code = generate_react_native_code(prompt)
        print(f"[DEBUG] OpenAI code response: {code}")
        if isinstance(code, dict) and 'error' in code:
            print(f"[DEBUG] OpenAI error: {code['error']}")
            return jsonify({'error': code['error']}), 500
        # Expo preview stub (to be implemented)
        expo_url = None
        # Save project
        project_id = save_project(current_app.db, user_id, prompt, code, framework, expo_url)
        return jsonify({'code': code, 'framework': framework, 'project_id': project_id, 'expo_url': expo_url})
    except Exception as e:
        print("[DEBUG] Exception in /generate:", e)
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# --- Save Project ---
@bp.route('/save_project', methods=['POST'])
@verify_firebase_token
def save_project_route():
    data = request.json
    user_id = g.user_id
    prompt = data.get('prompt')
    code = data.get('code')
    framework = data.get('framework')
    expo_url = data.get('expo_url')
    if not prompt or not code or not framework:
        return jsonify({'error': 'Invalid input'}), 400
    project_id = save_project(current_app.db, user_id, prompt, code, framework, expo_url)
    return jsonify({'project_id': project_id})

# --- Get All Projects ---
@bp.route('/projects/<user_id>', methods=['GET'])
@verify_firebase_token
def get_projects(user_id):
    print(f"[DEBUG] /projects/{user_id} called by {g.user_id}", file=sys.stderr)
    if g.user_id != user_id:
        print("[DEBUG] Unauthorized access", file=sys.stderr)
        return jsonify({'error': 'Unauthorized'}), 403
    projects = get_projects_by_user(current_app.db, user_id)
    print(f"[DEBUG] Returning projects: {projects}", file=sys.stderr)
    return jsonify({'projects': projects})

# --- Get/Update/Delete One Project ---
@bp.route('/project/<project_id>', methods=['GET', 'PUT', 'DELETE'])
@verify_firebase_token
def project_detail(project_id):
    db = current_app.db
    project = get_project_by_id(db, project_id)
    if not project:
        return jsonify({'error': 'Not found'}), 404
    if project['user_id'] != g.user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    if request.method == 'GET':
        return jsonify(project)
    elif request.method == 'PUT':
        updates = request.json
        update_project(db, project_id, updates)
        return jsonify({'success': True})
    elif request.method == 'DELETE':
        delete_project(db, project_id)
        return jsonify({'success': True})

# --- Download Project as Zip ---
@bp.route('/download', methods=['POST'])
@verify_firebase_token
def download():
    data = request.json
    code = data.get('code')
    project_name = data.get('project_name', 'AppBuilderProject')
    if not code:
        return jsonify({'error': 'Missing code'}), 400
    zip_path = create_project_zip(code, project_name)
    return send_file(zip_path, as_attachment=True, download_name=f'{project_name}.zip')

# --- Expo Web Preview (Stub) ---
@bp.route('/preview/<project_id>', methods=['GET'])
@verify_firebase_token
def preview(project_id):
    project = get_project_by_id(current_app.db, project_id)
    if not project or project['user_id'] != g.user_id:
        return jsonify({'error': 'Not found or unauthorized'}), 404
    expo_url = project.get('expo_url')
    if not expo_url:
        return jsonify({'error': 'Preview not available'}), 404
    return jsonify({'expo_url': expo_url})

# --- Billing: Paystack ---
@bp.route('/billing/initiate', methods=['POST'])
@verify_firebase_token
def billing_initiate():
    data = request.json
    user_id = g.user_id
    email = data.get('email')
    amount = data.get('amount')
    if not email or not amount:
        return jsonify({'error': 'Missing email or amount'}), 400
    headers = {'Authorization': f'Bearer {os.getenv("PAYSTACK_SECRET_KEY")}', 'Content-Type': 'application/json'}
    payload = {'email': email, 'amount': int(amount) * 100}  # Paystack expects kobo
    resp = requests.post('https://api.paystack.co/transaction/initialize', json=payload, headers=headers)
    if resp.status_code != 200:
        return jsonify({'error': 'Paystack error', 'details': resp.text}), 500
    return jsonify(resp.json())

@bp.route('/billing/verify', methods=['POST'])
def billing_verify():
    data = request.json
    reference = data.get('reference')
    user_id = data.get('user_id')
    if not reference or not user_id:
        return jsonify({'error': 'Missing reference or user_id'}), 400
    headers = {'Authorization': f'Bearer {os.getenv("PAYSTACK_SECRET_KEY")}', 'Content-Type': 'application/json'}
    resp = requests.get(f'https://api.paystack.co/transaction/verify/{reference}', headers=headers)
    if resp.status_code != 200:
        return jsonify({'error': 'Paystack error', 'details': resp.text}), 500
    billing_data = resp.json()['data']
    save_billing(current_app.db, user_id, billing_data)
    return jsonify({'success': True, 'billing': billing_data})

@bp.route('/billing/history/<user_id>', methods=['GET'])
@verify_firebase_token
def billing_history(user_id):
    if g.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    history = get_billing_history(current_app.db, user_id)
    return jsonify({'history': history})

# --- User Profile (Stub) ---
@bp.route('/user/<user_id>', methods=['GET', 'PUT', 'DELETE'])
@verify_firebase_token
def user_profile(user_id):
    db = current_app.db
    print(f"[DEBUG] /user/{user_id} called by {g.user_id}", file=sys.stderr)
    if g.user_id != user_id:
        print("[DEBUG] Unauthorized access", file=sys.stderr)
        return jsonify({'error': 'Unauthorized'}), 403

    if request.method == 'GET':
        profile = get_user_profile(db, user_id)
        print(f"[DEBUG] Returning profile: {profile}", file=sys.stderr)
        if not profile:
            print("[DEBUG] No profile found, returning empty object", file=sys.stderr)
            return jsonify({}), 200
        return jsonify(profile)

    elif request.method == 'PUT':
        updates = request.json
        update_user_profile(db, user_id, updates)
        return jsonify({'success': True})

    elif request.method == 'DELETE':
        delete_user_and_projects(db, user_id)
        return jsonify({'success': True}) 