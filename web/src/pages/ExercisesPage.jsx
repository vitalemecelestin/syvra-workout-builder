import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { api } from '../api';
import { muscleStyle } from '../muscles';

const EMPTY = { name: '', muscle_group: '', description: '' };

export default function ExercisesPage() {
  const [filter, setFilter] = useState('');
  // Le filtre fait partie de l'URL : quand il change, useFetch recharge tout seul.
  const path = filter ? `/api/exercises?muscle_group=${encodeURIComponent(filter)}` : '/api/exercises';
  const { data: exercises, loading, error, reload } = useFetch(path);
  const { data: groups } = useFetch('/api/exercises/muscle-groups');

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
      if (editingId) await api.put(`/api/exercises/${editingId}`, form);
      else await api.post('/api/exercises', form);
      closeForm();
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
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Exercices</h1>
          <p className="subtitle">La bibliothèque d’exercices utilisés dans vos séances.</p>
        </div>
        {!showForm && (
          <button className="btn-primary" onClick={() => setShowForm(true)}>+ Nouvel exercice</button>
        )}
      </div>

      {/* Formulaire création / édition (affiché à la demande) */}
      {showForm && (
        <form className="card form-card" onSubmit={submit}>
          <h3>{editingId ? 'Modifier l’exercice' : 'Nouvel exercice'}</h3>
          <div className="form-grid">
            <div>
              <label htmlFor="ex-name">Nom</label>
              <input id="ex-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required autoFocus />
            </div>
            <div>
              <label htmlFor="ex-group">Groupe musculaire</label>
              <input id="ex-group" list="groups" value={form.muscle_group} onChange={(e) => setForm({ ...form, muscle_group: e.target.value })} required />
              <datalist id="groups">
                {(groups || []).map((g) => <option key={g} value={g} />)}
              </datalist>
            </div>
            <div>
              <label htmlFor="ex-desc">Description</label>
              <input id="ex-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          {formError && <p className="error">{formError}</p>}
          <div className="form-actions">
            <button className="btn-primary" disabled={busy}>{editingId ? 'Enregistrer' : 'Ajouter'}</button>
            <button type="button" className="btn-ghost" onClick={closeForm}>Annuler</button>
          </div>
        </form>
      )}

      {/* Filtre par groupe musculaire */}
      <div className="toolbar">
        <div>
          <label htmlFor="filter">Filtrer par groupe musculaire</label>
          <select id="filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">Tous les groupes</option>
            {(groups || []).map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        {exercises && <span className="count">{exercises.length} exercice{exercises.length > 1 ? 's' : ''}</span>}
      </div>

      {/* États loading / erreur / liste */}
      {loading && <div className="state">Chargement…</div>}
      {error && <div className="state error">Erreur : {error}</div>}
      {exercises && exercises.length === 0 && <div className="state">Aucun exercice.</div>}

      <div className="grid">
        {(exercises || []).map((ex) => (
          <div className="card item" key={ex.id}>
            <div className="row">
              <Link to={`/exercises/${ex.id}`} className="item-title">{ex.name}</Link>
              <span className="badge" style={muscleStyle(ex.muscle_group)}>{ex.muscle_group}</span>
            </div>
            <p className="item-desc">{ex.description || '—'}</p>
            <div className="item-actions">
              <button onClick={() => startEdit(ex)}>Modifier</button>
              <button className="btn-danger" onClick={() => remove(ex.id)}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
