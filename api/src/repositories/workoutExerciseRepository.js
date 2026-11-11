// WorkoutExerciseRepository : gère la table de JONCTION
// (ajouter / modifier / retirer un exercice dans une séance).
import { query } from '../db.js';

export const WorkoutExerciseRepository = {
  // Ajoute un exercice à une séance avec ses séries/répétitions.
  // La contrainte UNIQUE(workout_id, exercise_id) empêche les doublons :
  // on attrape l'erreur 23505 (violation d'unicité) pour renvoyer un message clair.
  async add(workoutId, { exercise_id, sets, reps }) {
    try {
      const { rows } = await query(
        `INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [workoutId, exercise_id, sets, reps]
      );
      return rows[0];
    } catch (err) {
      if (err.code === '23505') {
        const e = new Error('Cet exercice est déjà dans la séance.');
        e.status = 409; // Conflict
        throw e;
      }
      throw err;
    }
  },

  // Modifie les séries/répétitions d'un lien existant (par l'id de jonction).
  async update(linkId, { sets, reps }) {
    const { rows } = await query(
      'UPDATE workout_exercises SET sets = $1, reps = $2 WHERE id = $3 RETURNING *',
      [sets, reps, linkId]
    );
    return rows[0];
  },

  // Retire un exercice d'une séance (supprime la ligne de jonction).
  async remove(linkId) {
    const { rowCount } = await query(
      'DELETE FROM workout_exercises WHERE id = $1',
      [linkId]
    );
    return rowCount > 0;
  },
};
