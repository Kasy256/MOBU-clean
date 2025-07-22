import os
import zipfile
import tempfile

def create_project_zip(code, project_name):
    temp_dir = tempfile.mkdtemp()
    project_dir = os.path.join(temp_dir, 'project')
    screens_dir = os.path.join(project_dir, 'screens')
    os.makedirs(screens_dir)

    # Write files
    with open(os.path.join(project_dir, 'App.js'), 'w', encoding='utf-8') as f:
        f.write(f"import GeneratedScreen from './screens/GeneratedScreen';\n\nexport default function App() {{\n  return <GeneratedScreen />;\n}}\n")
    with open(os.path.join(screens_dir, 'GeneratedScreen.js'), 'w', encoding='utf-8') as f:
        f.write(code)
    with open(os.path.join(project_dir, 'package.json'), 'w', encoding='utf-8') as f:
        f.write('''{
  "name": "{0}",
  "main": "App.js",
  "dependencies": {{
    "react": "^18.0.0",
    "react-native": "^0.72.0",
    "nativewind": "^2.0.11"
  }}
}}'''.format(project_name))
    with open(os.path.join(project_dir, 'README.md'), 'w', encoding='utf-8') as f:
        f.write(f"# {project_name}\n\nGenerated with App Builder.\n")

    # Create zip
    zip_path = os.path.join(temp_dir, f'{project_name}.zip')
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, _, files in os.walk(project_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, temp_dir)
                zipf.write(file_path, arcname)
    return zip_path 