// Tests UNITAIRES du WorkoutRepository (base simulée).
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/db.js', () => ({
  query: vi.fn(),
}));

import { query } from '../src/db.js';
import { WorkoutRepository } from '../src/repositories/workoutRepository.js';

describe('WorkoutRepository', () => {
  beforeEach(() => vi.clearAllMocks());

  it('findAll() renvoie les séances triées par nom avec leur nombre d’exercices', async () => {
    const fake = [{ id: 1, name: 'Leg Day', exercise_count: 4 }, { id: 2, name: 'Push Day', exercise_count: 0 }];
    query.mockResolvedValue({ rows: fake });

    expect(await WorkoutRepository.findAll()).toEqual(fake);
    const sql = query.mock.calls[0][0];
    expect(sql).toContain('LEFT JOIN workout_exercises');
    expect(sql).toContain('COUNT(we.id)');
    expect(sql).toContain('ORDER BY w.name');
  });

  it('findById() renvoie undefined si la séance n’existe pas', async () => {
    query.mockResolvedValue({ rows: [] });
    expect(await WorkoutRepository.findById(999)).toBeUndefined();
    expect(query.mock.calls[0][1]).toEqual([999]);
  });

  it('findExercises() joint la table de jonction et expose link_id, sets et reps', async () => {
    const rows = [{ id: 3, name: 'Squat', muscle_group: 'Jambes', link_id: 7, sets: 4, reps: 8 }];
    query.mockResolvedValue({ rows });

    const result = await WorkoutRepository.findExercises(1);

    expect(result).toEqual(rows);
    const sql = query.mock.calls[0][0];
    expect(sql).toContain('JOIN exercises');
    expect(sql).toContain('we.id AS link_id');
    expect(query.mock.calls[0][1]).toEqual([1]);
  });

  it('create() remplace une description absente par null', async () => {
    query.mockResolvedValue({ rows: [{ id: 5, name: 'Core', description: null }] });

    await WorkoutRepository.create({ name: 'Core' });

    expect(query.mock.calls[0][1]).toEqual(['Core', null]);
  });

  it('update() renvoie la séance modifiée', async () => {
    const updated = { id: 1, name: 'Push Day v2', description: 'Pecs' };
    query.mockResolvedValue({ rows: [updated] });

    expect(await WorkoutRepository.update(1, { name: 'Push Day v2', description: 'Pecs' })).toEqual(updated);
    expect(query.mock.calls[0][1]).toEqual(['Push Day v2', 'Pecs', 1]);
  });

  it('remove() renvoie true/false selon qu’une ligne est supprimée', async () => {
    query.mockResolvedValueOnce({ rowCount: 1 }).mockResolvedValueOnce({ rowCount: 0 });
    expect(await WorkoutRepository.remove(1)).toBe(true);
    expect(await WorkoutRepository.remove(999)).toBe(false);
  });
});
