/**
 * Central fetch wrapper for all API calls.
 * - Attaches Authorization: Bearer <token> header automatically
 * - Sets Content-Type: application/json on every request
 * - Throws a structured error object on non-2xx responses
 */

export async function apiFetch(path, options = {}) {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    'Content-Type': 'application/json',
    'x-insp-client': 'riverstone',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  let res;
  try {
    res = await fetch(path, {
      ...options,
      headers,
    });
  } catch (error) {
    console.log("insp-err", error);
    throw error;
  }

  let data;
  try {
    data = await res.json();
  } catch (error) {
    console.log("insp-err", error);
    data = {};
  }

  if (!res.ok) {
    const errorMsg = data.payload?.error || data.error || `Request failed (${res.status})`;
    const err = new Error(errorMsg);
    err.status = res.status;
    throw err;
  }

  // If response matches our wrapped API response shape, return the payload directly
  if (data && data.status === 'ok' && 'payload' in data) {
    return data.payload;
  }

  return data;
}
