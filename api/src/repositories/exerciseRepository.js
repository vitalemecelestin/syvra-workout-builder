// ExerciseRepository : TOUTES les requêtes SQL sur les exercices sont ici.
// (Repository pattern : les routes n'écrivent jamais de SQL directement.)
import { query } from '../db.js';

export const ExerciseRepository = {
  // Liste tous les exercices, avec filtre optionnel par groupe musculaire.
  async findAll(muscleGroup) {
    if (muscleGroup) {
      const { rows } = await query(
        'SELECT * FROM exercises WHERE muscle_group = $1 ORDER BY name',
        [muscleGroup]
      );
      return rows;
    }
    const { rows } = await query('SELECT * FROM exercises ORDER BY name');
    return rows;
  },

  // Un seul exercice par son id (ou undefined s'il n'existe pas).
  async findById(id) {
    const { rows } = await query('SELECT * FROM exercises WHERE id = $1', [id]);
    return rows[0];
  },

  // Les séances qui utilisent cet exercice (page "détail exercice").
  async findWorkoutsUsing(id) {
    const { rows } = await query(
      `SELECT w.id, w.name, w.description, we.sets, we.reps
         FROM workouts w
         JOIN workout_exercises we ON we.workout_id = w.id
        WHERE we.exercise_id = $1
        ORDER BY w.name`,
      [id]
    );
    return rows;
  },

  async create({ name, muscle_group, description }) {
    const { rows } = await query(
      `INSERT INTO exercises (name, muscle_group, description)
       VALUES ($1, $2, $3) RETURNING *`,
      [name, muscle_group, description ?? null]
    );
    return rows[0];
  },

  async update(id, { name, muscle_group, description }) {
    const { rows } = await query(
      `UPDATE exercises
          SET name = $1, muscle_group = $2, description = $3
        WHERE id = $4 RETURNING *`,
      [name, muscle_group, description ?? null, id]
    );
    return rows[0];
  },

  async remove(id) {
    const { rowCount } = await query('DELETE FROM exercises WHERE id = $1', [id]);
    return rowCount > 0; // true si une ligne a été supprimée
  },

  // Liste distincte des groupes musculaires (pour alimenter le filtre côté React).
  async muscleGroups() {
    const { rows } = await query(
      'SELECT DISTINCT muscle_group FROM exercises ORDER BY muscle_group'
    );
    return rows.map((r) => r.muscle_group);
  },
};
