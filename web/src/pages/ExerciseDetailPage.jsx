import { useParams, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { muscleStyle } from '../muscles';

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
      <Link to="/" className="back">← Retour aux exercices</Link>
      <div className="page-head">
        <div>
          <h1>{exercise.name}</h1>
          {exercise.description && <p className="subtitle">{exercise.description}</p>}
        </div>
        <span className="badge badge-lg" style={muscleStyle(exercise.muscle_group)}>{exercise.muscle_group}</span>
      </div>

      <h2>Utilisé dans {exercise.workouts.length} séance{exercise.workouts.length > 1 ? 's' : ''}</h2>
      {exercise.workouts.length === 0 && <div className="card state">Cet exercice n’est encore dans aucune séance.</div>}
      <div className="grid">
        {exercise.workouts.map((w) => (
          <Link to={`/workouts/${w.id}`} className="card item item-link" key={w.id}>
            <span className="item-title">{w.name}</span>
            <span className="volume">
              <strong>{w.sets}</strong> séries × <strong>{w.reps}</strong> répétitions
            </span>
            <span className="btn-link">Voir la séance →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
