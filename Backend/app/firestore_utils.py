from firebase_admin import firestore
from datetime import datetime
import uuid

def save_project(db, user_id, prompt, code, framework, expo_url=None):
    project_id = str(uuid.uuid4())
    doc_ref = db.collection('projects').document(project_id)
    data = {
        'project_id': project_id,
        'user_id': user_id,
        'prompt': prompt,
        'code': code,
        'framework': framework,
        'expo_url': expo_url,
        'timestamp': datetime.utcnow(),
    }
    doc_ref.set(data)
    return project_id

def get_projects_by_user(db, user_id):
    projects = db.collection('projects').where('user_id', '==', user_id).order_by('timestamp', direction=firestore.Query.DESCENDING).stream()
    return [p.to_dict() for p in projects]

def get_project_by_id(db, project_id):
    doc = db.collection('projects').document(project_id).get()
    return doc.to_dict() if doc.exists else None

def update_project(db, project_id, updates):
    db.collection('projects').document(project_id).update(updates)

def delete_project(db, project_id):
    db.collection('projects').document(project_id).delete()

def save_billing(db, user_id, billing_data):
    db.collection('users').document(user_id).collection('billing').add(billing_data)

def get_billing_history(db, user_id):
    bills = db.collection('users').document(user_id).collection('billing').order_by('timestamp', direction=firestore.Query.DESCENDING).stream()
    return [b.to_dict() for b in bills]

# --- User Profile Utilities ---
def get_user_profile(db, user_id):
    doc = db.collection('users').document(user_id).get()
    return doc.to_dict() if doc.exists else None

def update_user_profile(db, user_id, updates):
    db.collection('users').document(user_id).set(updates, merge=True)

def delete_user_and_projects(db, user_id):
    # Delete all projects for this user
    projects = db.collection('projects').where('user_id', '==', user_id).stream()
    for project in projects:
        project.reference.delete()
    # Delete user profile
    db.collection('users').document(user_id).delete() 