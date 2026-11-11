import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { api } from '../api';

const EMPTY = { name: '', description: '' };

export default function WorkoutsPage() {
  const { data: workouts, loading, error, reload } = useFetch('/api/workouts');
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState(null);

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY);
    setFormError(null);
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setFormError(null);
    try {
      if (editingId) await api.put(`/api/workouts/${editingId}`, form);
      else await api.post('/api/workouts', form);
      closeForm();
      reload();
    } catch (err) {
      setFormError(err.message);
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
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Séances</h1>
          <p className="subtitle">Composez vos entraînements à partir de la bibliothèque d’exercices.</p>
        </div>
        {!showForm && (
          <button className="btn-primary" onClick={() => setShowForm(true)}>+ Nouvelle séance</button>
        )}
      </div>

      {showForm && (
        <form className="card form-card" onSubmit={submit}>
          <h3>{editingId ? 'Modifier la séance' : 'Nouvelle séance'}</h3>
          <div className="form-grid">
            <div>
              <label htmlFor="w-name">Nom</label>
              <input id="w-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required autoFocus />
            </div>
            <div>
              <label htmlFor="w-desc">Description</label>
              <input id="w-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          {formError && <p className="error">{formError}</p>}
          <div className="form-actions">
            <button className="btn-primary" disabled={busy}>{editingId ? 'Enregistrer' : 'Ajouter'}</button>
            <button type="button" className="btn-ghost" onClick={closeForm}>Annuler</button>
          </div>
        </form>
      )}

      {loading && <div className="state">Chargement…</div>}
      {error && <div className="state error">Erreur : {error}</div>}
      {workouts && workouts.length === 0 && <div className="state">Aucune séance.</div>}

      <div className="grid">
        {(workouts || []).map((w) => (
          <div className="card item" key={w.id}>
            <div className="row">
              <Link to={`/workouts/${w.id}`} className="item-title">{w.name}</Link>
              <span className="badge">
                {w.exercise_count ?? 0} exercice{(w.exercise_count ?? 0) > 1 ? 's' : ''}
              </span>
            </div>
            <p className="item-desc">{w.description || '—'}</p>
            <div className="item-actions">
              <Link to={`/workouts/${w.id}`} className="btn-link">Ouvrir →</Link>
              <button onClick={() => startEdit(w)}>Modifier</button>
              <button className="btn-danger" onClick={() => remove(w.id)}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
