import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { api } from '../api';

const EMPTY = { name: '', muscle_group: '', description: '' };

export default function ExercisesPage() {
  const [filter, setFilter] = useState('');
  // Le filtre fait partie de l'URL : quand il change, useFetch recharge tout seul.
  const path = filter ? `/api/exercises?muscle_group=${encodeURIComponent(filter)}` : '/api/exercises';
  const { data: exercises, loading, error, reload } = useFetch(path);
  const { data: groups } = useFetch('/api/exercises/muscle-groups');

  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setFormError(null);
    try {
      if (editingId) await api.put(`/api/exercises/${editingId}`, form);
      else await api.post('/api/exercises', form);
      setForm(EMPTY);
      setEditingId(null);
      reload();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(id) {
    if (!confirm('Supprimer cet exercice ?')) return;
    await api.del(`/api/exercises/${id}`);
    reload();
  }

  function startEdit(ex) {
    setEditingId(ex.id);
    setForm({ name: ex.name, muscle_group: ex.muscle_group, description: ex.description || '' });
  }

  return (
    <div>
      <h1>Exercices</h1>

      {/* Formulaire création / édition */}
      <form className="card" onSubmit={submit}>
        <div className="row">
          <strong>{editingId ? 'Modifier un exercice' : 'Nouvel exercice'}</strong>
        </div>
        <label>Nom</label>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <label>Groupe musculaire</label>
        <input value={form.muscle_group} onChange={(e) => setForm({ ...form, muscle_group: e.target.value })} required />
        <label>Description</label>
        <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        {formError && <p className="error">{formError}</p>}
        <div className="row" style={{ marginTop: 12 }}>
          <button className="btn-primary" disabled={busy}>{editingId ? 'Enregistrer' : 'Ajouter'}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(EMPTY); }}>Annuler</button>}
        </div>
      </form>

      {/* Filtre par groupe musculaire */}
      <div className="toolbar">
        <div style={{ minWidth: 220 }}>
          <label>Filtrer par groupe musculaire</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">Tous</option>
            {(groups || []).map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </div>

      {/* États loading / erreur / liste */}
      {loading && <div className="state">Chargement…</div>}
      {error && <div className="state error">Erreur : {error}</div>}
      {exercises && exercises.length === 0 && <div className="state">Aucun exercice.</div>}

      <div className="grid">
        {(exercises || []).map((ex) => (
          <div className="card" key={ex.id}>
            <div className="row">
              <Link to={`/exercises/${ex.id}`}><strong>{ex.name}</strong></Link>
              <span className="badge">{ex.muscle_group}</span>
            </div>
            {ex.description && <p style={{ color: 'var(--muted)' }}>{ex.description}</p>}
            <div className="row">
              <button onClick={() => startEdit(ex)}>Modifier</button>
              <button className="btn-danger" onClick={() => remove(ex.id)}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
