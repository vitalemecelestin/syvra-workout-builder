// WorkoutRepository : toutes les requêtes SQL sur les séances.
import { query } from '../db.js';

export const WorkoutRepository = {
  // Liste des séances avec le nombre d'exercices de chacune (LEFT JOIN :
  // une séance sans exercice apparaît quand même, avec 0).
  async findAll() {
    const { rows } = await query(
      `SELECT w.*, COUNT(we.id)::int AS exercise_count
         FROM workouts w
         LEFT JOIN workout_exercises we ON we.workout_id = w.id
        GROUP BY w.id
        ORDER BY w.name`
    );
    return rows;
  },

  async findById(id) {
    const { rows } = await query('SELECT * FROM workouts WHERE id = $1', [id]);
    return rows[0];
  },

  // Les exercices d'une séance AVEC leurs séries/répétitions (page "détail séance").
  // On renvoie aussi l'id de la ligne de jonction (link_id) pour pouvoir
  // modifier/retirer précisément ce lien ensuite.
  async findExercises(workoutId) {
    const { rows } = await query(
      `SELECT e.id, e.name, e.muscle_group,
              we.id AS link_id, we.sets, we.reps
         FROM workout_exercises we
         JOIN exercises e ON e.id = we.exercise_id
        WHERE we.workout_id = $1
        ORDER BY e.name`,
      [workoutId]
    );
    return rows;
  },

  async create({ name, description }) {
    const { rows } = await query(
      'INSERT INTO workouts (name, description) VALUES ($1, $2) RETURNING *',
      [name, description ?? null]
    );
    return rows[0];
  },

  async update(id, { name, description }) {
    const { rows } = await query(
      'UPDATE workouts SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description ?? null, id]
    );
    return rows[0];
  },

  async remove(id) {
    const { rowCount } = await query('DELETE FROM workouts WHERE id = $1', [id]);
    return rowCount > 0;
  },
};
