// Petit client HTTP centralisé pour parler à l'API REST.
// L'URL de base vient d'une variable d'environnement (local vs déployé).
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function handle(res) {
  if (!res.ok) {
    let message = `Erreur ${res.status}`;
    try {
      const body = await res.json();
      if (body.error) message = body.error;
    } catch {
      /* corps vide : on garde le message par défaut */
    }
    throw new Error(message);
  }
  if (res.status === 204) return null; // pas de contenu (DELETE)
  return res.json();
}

export const api = {
  get: (path) => fetch(`${BASE}${path}`).then(handle),
  post: (path, body) =>
    fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(handle),
  put: (path, body) =>
    fetch(`${BASE}${path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(handle),
  del: (path) => fetch(`${BASE}${path}`, { method: 'DELETE' }).then(handle),
};
