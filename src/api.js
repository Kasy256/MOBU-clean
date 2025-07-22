const API_BASE = '/api';

async function getIdToken() {
  const user = window.firebaseAuth?.currentUser;
  if (!user) throw new Error('Not authenticated');
  return user.getIdToken();
}

async function apiFetch(path, options = {}) {
  const token = await getIdToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.headers || {}),
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return res.json();
  } else {
    const text = await res.text();
    throw new Error(`Unexpected response: ${text}`);
  }
}

export async function generate(prompt, framework) {
  return apiFetch('/generate', {
    method: 'POST',
    body: JSON.stringify({ prompt, framework }),
  });
}

export async function saveProject(prompt, code, framework, expo_url) {
  return apiFetch('/save_project', {
    method: 'POST',
    body: JSON.stringify({ prompt, code, framework, expo_url }),
  });
}

export async function getProjects(user_id) {
  return apiFetch(`/projects/${user_id}`);
}

export async function getProject(project_id) {
  return apiFetch(`/project/${project_id}`);
}

export async function updateProject(project_id, updates) {
  return apiFetch(`/project/${project_id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export async function deleteProject(project_id) {
  return apiFetch(`/project/${project_id}`, {
    method: 'DELETE' });
}

export async function downloadZip(code, project_name) {
  const token = await getIdToken();
  const res = await fetch(`${API_BASE}/download`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code, project_name }),
  });
  if (res.ok) return res.blob();
  const text = await res.text();
  throw new Error(`Unexpected response: ${text}`);
}

export async function getPreview(project_id) {
  return apiFetch(`/preview/${project_id}`);
}

export async function billingInitiate(email, amount) {
  return apiFetch('/billing/initiate', {
    method: 'POST',
    body: JSON.stringify({ email, amount }),
  });
}

export async function billingVerify(reference, user_id) {
  const res = await fetch(`${API_BASE}/billing/verify`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reference, user_id }),
  });
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return res.json();
  } else {
    const text = await res.text();
    throw new Error(`Unexpected response: ${text}`);
  }
}

export async function getBillingHistory(user_id) {
  return apiFetch(`/billing/history/${user_id}`);
}

export async function getUserProfile(user_id) {
  return apiFetch(`/user/${user_id}`);
}

export async function updateUserProfile(user_id, updates) {
  return apiFetch(`/user/${user_id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export async function deleteUser(user_id) {
  return apiFetch(`/user/${user_id}`, {
    method: 'DELETE' });
} 