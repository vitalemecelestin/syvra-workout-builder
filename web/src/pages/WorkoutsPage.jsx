import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { api } from '../api';

const EMPTY = { name: '', description: '' };

export default function WorkoutsPage() {
  const { data: workouts, loading, error, reload } = useFetch('/api/workouts');
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      if (editingId) await api.put(`/api/workouts/${editingId}`, form);
      else await api.post('/api/workouts', form);
      setForm(EMPTY);
      setEditingId(null);
      reload();
    } finally {
      setBusy(false);
    }
  }

  async function remove(id) {
    if (!confirm('Supprimer cette séance ?')) return;
    await api.del(`/api/workouts/${id}`);
    reload();
  }

  function startEdit(w) {
    setEditingId(w.id);
    setForm({ name: w.name, description: w.description || '' });
  }

  return (
    <div>
      <h1>Séances</h1>

      <form className="card" onSubmit={submit}>
        <strong>{editingId ? 'Modifier la séance' : 'Nouvelle séance'}</strong>
        <label>Nom</label>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <label>Description</label>
        <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="row" style={{ marginTop: 12 }}>
          <button className="btn-primary" disabled={busy}>{editingId ? 'Enregistrer' : 'Ajouter'}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(EMPTY); }}>Annuler</button>}
        </div>
      </form>

      {loading && <div className="state">Chargement…</div>}
      {error && <div className="state error">Erreur : {error}</div>}
      {workouts && workouts.length === 0 && <div className="state">Aucune séance.</div>}

      <div className="grid">
        {(workouts || []).map((w) => (
          <div className="card" key={w.id}>
            <div className="row">
              <Link to={`/workouts/${w.id}`}><strong>{w.name}</strong></Link>
            </div>
            {w.description && <p style={{ color: 'var(--muted)' }}>{w.description}</p>}
            <div className="row">
              <button onClick={() => startEdit(w)}>Modifier</button>
              <button className="btn-danger" onClick={() => remove(w.id)}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
