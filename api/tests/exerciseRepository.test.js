// Tests UNITAIRES du repository : on "mocke" la base de données.
// But : vérifier que le repository construit le bon SQL et renvoie les bonnes
// données, SANS avoir besoin d'une vraie base (rapide et fiable).
import { describe, it, expect, vi, beforeEach } from 'vitest';

// On remplace le module db.js par une fausse fonction query().
vi.mock('../src/db.js', () => ({
  query: vi.fn(),
}));

import { query } from '../src/db.js';
import { ExerciseRepository } from '../src/repositories/exerciseRepository.js';

describe('ExerciseRepository', () => {
  beforeEach(() => vi.clearAllMocks());

  it('findAll() sans filtre renvoie tous les exercices', async () => {
    const fake = [{ id: 1, name: 'Squat', muscle_group: 'Jambes' }];
    query.mockResolvedValue({ rows: fake });

    const result = await ExerciseRepository.findAll();

    expect(result).toEqual(fake);
    // Appelé sans paramètre de filtre :
    expect(query).toHaveBeenCalledTimes(1);
    expect(query.mock.calls[0][0]).toContain('SELECT * FROM exercises');
  });

  it('findAll("Dos") ajoute le filtre WHERE muscle_group = $1', async () => {
    query.mockResolvedValue({ rows: [] });

    await ExerciseRepository.findAll('Dos');

    expect(query.mock.calls[0][0]).toContain('WHERE muscle_group = $1');
    expect(query.mock.calls[0][1]).toEqual(['Dos']); // paramètre passé proprement
  });

  it('remove() renvoie true si une ligne est supprimée', async () => {
    query.mockResolvedValue({ rowCount: 1 });
    expect(await ExerciseRepository.remove(5)).toBe(true);
  });

  it('remove() renvoie false si rien n’est supprimé', async () => {
    query.mockResolvedValue({ rowCount: 0 });
    expect(await ExerciseRepository.remove(999)).toBe(false);
  });

  it('create() renvoie l’exercice inséré', async () => {
    const created = { id: 2, name: 'Pompes', muscle_group: 'Pectoraux', description: null };
    query.mockResolvedValue({ rows: [created] });

    const result = await ExerciseRepository.create({ name: 'Pompes', muscle_group: 'Pectoraux' });

    expect(result).toEqual(created);
    expect(query.mock.calls[0][0]).toContain('INSERT INTO exercises');
  });
});
