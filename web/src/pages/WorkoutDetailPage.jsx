import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { api } from '../api';
import { muscleStyle } from '../muscles';

// Page "détail séance" : liste les exercices de la séance avec séries/répétitions,
// et permet d'AJOUTER, MODIFIER et RETIRER un exercice (table de jonction).
export default function WorkoutDetailPage() {
  const { id } = useParams();
  const { data: workout, loading, error, reload } = useFetch(`/api/workouts/${id}`);
  const { data: allExercises } = useFetch('/api/exercises');

  const [add, setAdd] = useState({ exercise_id: '', sets: 3, reps: 10 });
  const [addError, setAddError] = useState(null);
  const [linkError, setLinkError] = useState(null);

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
    setLinkError(null);
    try {
      await api.put(`/api/workouts/${id}/exercises/${linkId}`, { sets: Number(sets), reps: Number(reps) });
      reload();
    } catch (err) {
      setLinkError(err.message); // ex. séries à 0 -> 400
    }
  }

  async function removeLink(linkId) {
    setLinkError(null);
    try {
      await api.del(`/api/workouts/${id}/exercises/${linkId}`);
      reload();
    } catch (err) {
      setLinkError(err.message);
    }
  }

  if (loading) return <div className="state">Chargement…</div>;
  if (error) return <div className="state error">Erreur : {error}</div>;
  if (!workout) return <div className="state">Introuvable.</div>;

  const exercises = workout.exercises;
  const totalSets = exercises.reduce((sum, ex) => sum + ex.sets, 0);
  const totalReps = exercises.reduce((sum, ex) => sum + ex.sets * ex.reps, 0);
  const groups = new Set(exercises.map((ex) => ex.muscle_group)).size;
  // On ne propose que les exercices qui ne sont pas déjà dans la séance.
  const inWorkout = new Set(exercises.map((ex) => ex.id));
  const available = (allExercises || []).filter((ex) => !inWorkout.has(ex.id));

  return (
    <div>
      <Link to="/workouts" className="back">← Retour aux séances</Link>
      <div className="page-head">
        <div>
          <h1>{workout.name}</h1>
          {workout.description && <p className="subtitle">{workout.description}</p>}
        </div>
      </div>

      <div className="stats">
        <div className="stat"><span className="stat-value">{exercises.length}</span><span className="stat-label">exercices</span></div>
        <div className="stat"><span className="stat-value">{totalSets}</span><span className="stat-label">séries au total</span></div>
        <div className="stat"><span className="stat-value">{totalReps}</span><span className="stat-label">répétitions au total</span></div>
        <div className="stat"><span className="stat-value">{groups}</span><span className="stat-label">groupes musculaires</span></div>
      </div>

      <h2>Exercices de la séance</h2>
      {linkError && <p className="error" style={{ marginBottom: 10 }}>{linkError}</p>}
      {exercises.length === 0 && <div className="card state">Aucun exercice pour l’instant — ajoutez-en un ci-dessous.</div>}

      {exercises.length > 0 && (
        <div className="card table-wrap">
          <table>
            <thead>
              <tr><th>Exercice</th><th>Groupe</th><th>Séries</th><th>Répétitions</th><th></th></tr>
            </thead>
            <tbody>
              {exercises.map((ex) => (
                <tr key={ex.link_id}>
                  <td><Link to={`/exercises/${ex.id}`} className="item-title">{ex.name}</Link></td>
                  <td><span className="badge" style={muscleStyle(ex.muscle_group)}>{ex.muscle_group}</span></td>
                  <td>
                    <input type="number" min="1" defaultValue={ex.sets} aria-label={`Séries pour ${ex.name}`}
                      onBlur={(e) => e.target.value != ex.sets && updateLink(ex.link_id, e.target.value, ex.reps)} />
                  </td>
                  <td>
                    <input type="number" min="1" defaultValue={ex.reps} aria-label={`Répétitions pour ${ex.name}`}
                      onBlur={(e) => e.target.value != ex.reps && updateLink(ex.link_id, ex.sets, e.target.value)} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn-danger" onClick={() => removeLink(ex.link_id)}>Retirer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {exercises.length > 0 && <p className="hint">Astuce : modifiez les séries ou les répétitions directement dans le tableau, c’est enregistré automatiquement.</p>}

      {/* Ajouter un exercice à la séance */}
      <form className="card form-card" onSubmit={addExercise} style={{ marginTop: 24 }}>
        <h3>Ajouter un exercice</h3>
        <div className="form-grid form-grid-add">
          <div>
            <label htmlFor="add-ex">Exercice</label>
            <select id="add-ex" value={add.exercise_id} onChange={(e) => setAdd({ ...add, exercise_id: e.target.value })} required>
              <option value="">— Choisir un exercice —</option>
              {available.map((ex) => (
                <option key={ex.id} value={ex.id}>{ex.name} ({ex.muscle_group})</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="add-sets">Séries</label>
            <input id="add-sets" type="number" min="1" value={add.sets} onChange={(e) => setAdd({ ...add, sets: e.target.value })} required />
          </div>
          <div>
            <label htmlFor="add-reps">Répétitions</label>
            <input id="add-reps" type="number" min="1" value={add.reps} onChange={(e) => setAdd({ ...add, reps: e.target.value })} required />
          </div>
        </div>
        {addError && <p className="error">{addError}</p>}
        <div className="form-actions">
          <button className="btn-primary">Ajouter à la séance</button>
        </div>
      </form>
    </div>
  );
}
