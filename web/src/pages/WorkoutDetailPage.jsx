import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { api } from '../api';

// Page "détail séance" : liste les exercices de la séance avec séries/répétitions,
// et permet d'AJOUTER, MODIFIER et RETIRER un exercice (table de jonction).
export default function WorkoutDetailPage() {
  const { id } = useParams();
  const { data: workout, loading, error, reload } = useFetch(`/api/workouts/${id}`);
  const { data: allExercises } = useFetch('/api/exercises');

  const [add, setAdd] = useState({ exercise_id: '', sets: 3, reps: 10 });
  const [addError, setAddError] = useState(null);

  async function addExercise(e) {
    e.preventDefault();
    setAddError(null);
    try {
      await api.post(`/api/workouts/${id}/exercises`, {
        exercise_id: Number(add.exercise_id),
        sets: Number(add.sets),
        reps: Number(add.reps),
      });
      setAdd({ exercise_id: '', sets: 3, reps: 10 });
      reload();
    } catch (err) {
      setAddError(err.message); // ex. "déjà dans la séance" (409)
    }
  }

  async function updateLink(linkId, sets, reps) {
    await api.put(`/api/workouts/${id}/exercises/${linkId}`, { sets: Number(sets), reps: Number(reps) });
    reload();
  }

  async function removeLink(linkId) {
    await api.del(`/api/workouts/${id}/exercises/${linkId}`);
    reload();
  }

  if (loading) return <div className="state">Chargement…</div>;
  if (error) return <div className="state error">Erreur : {error}</div>;
  if (!workout) return <div className="state">Introuvable.</div>;

  return (
    <div>
      <p><Link to="/workouts">← Retour aux séances</Link></p>
      <h1>{workout.name}</h1>
      {workout.description && <p style={{ color: 'var(--muted)' }}>{workout.description}</p>}

      <h2>Exercices de la séance</h2>
      {workout.exercises.length === 0 && <div className="state">Aucun exercice pour l’instant.</div>}

      {workout.exercises.length > 0 && (
        <table className="card">
          <thead>
            <tr><th>Exercice</th><th>Groupe</th><th>Séries</th><th>Reps</th><th></th></tr>
          </thead>
          <tbody>
            {workout.exercises.map((ex) => (
              <tr key={ex.link_id}>
                <td><Link to={`/exercises/${ex.id}`}>{ex.name}</Link></td>
                <td><span className="badge">{ex.muscle_group}</span></td>
                <td>
                  <input type="number" min="1" defaultValue={ex.sets} style={{ width: 70 }}
                    onBlur={(e) => e.target.value != ex.sets && updateLink(ex.link_id, e.target.value, ex.reps)} />
                </td>
                <td>
                  <input type="number" min="1" defaultValue={ex.reps} style={{ width: 70 }}
                    onBlur={(e) => e.target.value != ex.reps && updateLink(ex.link_id, ex.sets, e.target.value)} />
                </td>
                <td><button className="btn-danger" onClick={() => removeLink(ex.link_id)}>Retirer</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Ajouter un exercice à la séance */}
      <form className="card" onSubmit={addExercise}>
        <strong>Ajouter un exercice</strong>
        <label>Exercice</label>
        <select value={add.exercise_id} onChange={(e) => setAdd({ ...add, exercise_id: e.target.value })} required>
          <option value="">— choisir —</option>
          {(allExercises || []).map((ex) => (
            <option key={ex.id} value={ex.id}>{ex.name} ({ex.muscle_group})</option>
          ))}
        </select>
        <div className="toolbar">
          <div><label>Séries</label><input type="number" min="1" value={add.sets}
            onChange={(e) => setAdd({ ...add, sets: e.target.value })} /></div>
          <div><label>Répétitions</label><input type="number" min="1" value={add.reps}
            onChange={(e) => setAdd({ ...add, reps: e.target.value })} /></div>
        </div>
        {addError && <p className="error">{addError}</p>}
        <button className="btn-primary" style={{ marginTop: 10 }}>Ajouter</button>
      </form>
    </div>
  );
}
