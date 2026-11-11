import { useParams, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';

// Page "détail exercice" : montre l'exercice ET les séances qui l'utilisent
// (l'autre côté de la relation plusieurs-à-plusieurs).
export default function ExerciseDetailPage() {
  const { id } = useParams();
  const { data: exercise, loading, error } = useFetch(`/api/exercises/${id}`);

  if (loading) return <div className="state">Chargement…</div>;
  if (error) return <div className="state error">Erreur : {error}</div>;
  if (!exercise) return <div className="state">Introuvable.</div>;

  return (
    <div>
      <p><Link to="/">← Retour aux exercices</Link></p>
      <h1>{exercise.name}</h1>
      <p><span className="badge">{exercise.muscle_group}</span></p>
      {exercise.description && <p>{exercise.description}</p>}

      <h2>Séances qui utilisent cet exercice</h2>
      {exercise.workouts.length === 0 && <div className="state">Aucune séance.</div>}
      <div className="grid">
        {exercise.workouts.map((w) => (
          <div className="card" key={w.id}>
            <div className="row">
              <Link to={`/workouts/${w.id}`}><strong>{w.name}</strong></Link>
              <span className="badge">{w.sets} × {w.reps}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
