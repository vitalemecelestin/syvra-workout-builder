// Tests UNITAIRES du repository de la table de JONCTION (base simulée).
// On vérifie surtout la logique métier : la traduction d'une violation
// d'unicité Postgres (23505) en erreur 409 "déjà dans la séance".
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/db.js', () => ({
  query: vi.fn(),
}));

import { query } from '../src/db.js';
import { WorkoutExerciseRepository } from '../src/repositories/workoutExerciseRepository.js';

describe('WorkoutExerciseRepository', () => {
  beforeEach(() => vi.clearAllMocks());

  it('add() insère le lien avec les paramètres dans le bon ordre', async () => {
    const inserted = { id: 7, workout_id: 1, exercise_id: 3, sets: 4, reps: 10 };
    query.mockResolvedValue({ rows: [inserted] });

    const result = await WorkoutExerciseRepository.add(1, { exercise_id: 3, sets: 4, reps: 10 });

    expect(result).toEqual(inserted);
    expect(query.mock.calls[0][0]).toContain('INSERT INTO workout_exercises');
    expect(query.mock.calls[0][1]).toEqual([1, 3, 4, 10]);
  });

  it('add() transforme un doublon (code 23505) en erreur 409', async () => {
    const pgError = Object.assign(new Error('duplicate key'), { code: '23505' });
    query.mockRejectedValue(pgError);

    await expect(
      WorkoutExerciseRepository.add(1, { exercise_id: 3, sets: 3, reps: 8 })
    ).rejects.toMatchObject({ status: 409, message: 'Cet exercice est déjà dans la séance.' });
  });

  it('add() laisse passer les autres erreurs telles quelles', async () => {
    const other = Object.assign(new Error('connexion perdue'), { code: '08006' });
    query.mockRejectedValue(other);

    await expect(
      WorkoutExerciseRepository.add(1, { exercise_id: 3, sets: 3, reps: 8 })
    ).rejects.toBe(other);
  });

  it('update() renvoie le lien modifié', async () => {
    const updated = { id: 7, sets: 5, reps: 5 };
    query.mockResolvedValue({ rows: [updated] });

    expect(await WorkoutExerciseRepository.update(7, { sets: 5, reps: 5 })).toEqual(updated);
    expect(query.mock.calls[0][1]).toEqual([5, 5, 7]);
  });

  it('remove() renvoie true/false selon qu’une ligne est supprimée', async () => {
    query.mockResolvedValueOnce({ rowCount: 1 }).mockResolvedValueOnce({ rowCount: 0 });

    expect(await WorkoutExerciseRepository.remove(7)).toBe(true);
    expect(await WorkoutExerciseRepository.remove(999)).toBe(false);
  });
});
