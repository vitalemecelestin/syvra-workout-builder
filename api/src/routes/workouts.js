// Routes des séances + gestion des exercices dans une séance (table de jonction).
import { Router } from 'express';
import { WorkoutRepository } from '../repositories/workoutRepository.js';
import { WorkoutExerciseRepository } from '../repositories/workoutExerciseRepository.js';

const router = Router();

// GET /api/workouts  -> liste des séances
router.get('/', async (req, res, next) => {
  try {
    res.json(await WorkoutRepository.findAll());
  } catch (err) { next(err); }
});

// GET /api/workouts/:id  -> une séance + ses exercices (avec sets/reps)
router.get('/:id', async (req, res, next) => {
  try {
    const workout = await WorkoutRepository.findById(req.params.id);
    if (!workout) return res.status(404).json({ error: 'Séance introuvable.' });
    const exercises = await WorkoutRepository.findExercises(req.params.id);
    res.json({ ...workout, exercises });
  } catch (err) { next(err); }
});

// POST /api/workouts  -> créer
router.post('/', async (req, res, next) => {
  try {
    if (!req.body.name) return res.status(400).json({ error: 'name est requis.' });
    res.status(201).json(await WorkoutRepository.create(req.body));
  } catch (err) { next(err); }
});

// PUT /api/workouts/:id  -> modifier
router.put('/:id', async (req, res, next) => {
  try {
    const updated = await WorkoutRepository.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Séance introuvable.' });
    res.json(updated);
  } catch (err) { next(err); }
});

// DELETE /api/workouts/:id  -> supprimer (les liens partent en cascade)
router.delete('/:id', async (req, res, next) => {
  try {
    const ok = await WorkoutRepository.remove(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Séance introuvable.' });
    res.status(204).end();
  } catch (err) { next(err); }
});

// ----- Exercices DANS une séance (table de jonction) -----

// POST /api/workouts/:id/exercises  -> ajouter un exercice { exercise_id, sets, reps }
router.post('/:id/exercises', async (req, res, next) => {
  try {
    const { exercise_id, sets, reps } = req.body;
    if (!exercise_id || sets == null || reps == null) {
      return res.status(400).json({ error: 'exercise_id, sets et reps sont requis.' });
    }
    const link = await WorkoutExerciseRepository.add(req.params.id, req.body);
    res.status(201).json(link);
  } catch (err) { next(err); }
});

// PUT /api/workouts/:id/exercises/:linkId  -> modifier sets/reps d'un lien
router.put('/:id/exercises/:linkId', async (req, res, next) => {
  try {
    const updated = await WorkoutExerciseRepository.update(req.params.linkId, req.body);
    if (!updated) return res.status(404).json({ error: 'Lien introuvable.' });
    res.json(updated);
  } catch (err) { next(err); }
});

// DELETE /api/workouts/:id/exercises/:linkId  -> retirer un exercice de la séance
router.delete('/:id/exercises/:linkId', async (req, res, next) => {
  try {
    const ok = await WorkoutExerciseRepository.remove(req.params.linkId);
    if (!ok) return res.status(404).json({ error: 'Lien introuvable.' });
    res.status(204).end();
  } catch (err) { next(err); }
});

export default router;
