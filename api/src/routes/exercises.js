// Routes des exercices. Les routes sont "minces" : elles valident l'entrée,
// appellent le repository, et renvoient la réponse. Aucun SQL ici.
import { Router } from 'express';
import { ExerciseRepository } from '../repositories/exerciseRepository.js';

const router = Router();

// GET /api/exercises?muscle_group=Dos   -> liste (filtre optionnel)
router.get('/', async (req, res, next) => {
  try {
    const exercises = await ExerciseRepository.findAll(req.query.muscle_group);
    res.json(exercises);
  } catch (err) { next(err); }
});

// GET /api/exercises/muscle-groups  -> ["Abdos","Bras",...] pour le filtre
router.get('/muscle-groups', async (req, res, next) => {
  try {
    res.json(await ExerciseRepository.muscleGroups());
  } catch (err) { next(err); }
});

// GET /api/exercises/:id  -> un exercice + les séances qui l'utilisent
router.get('/:id', async (req, res, next) => {
  try {
    const exercise = await ExerciseRepository.findById(req.params.id);
    if (!exercise) return res.status(404).json({ error: 'Exercice introuvable.' });
    const workouts = await ExerciseRepository.findWorkoutsUsing(req.params.id);
    res.json({ ...exercise, workouts });
  } catch (err) { next(err); }
});

// POST /api/exercises  -> créer
router.post('/', async (req, res, next) => {
  try {
    const { name, muscle_group } = req.body;
    if (!name || !muscle_group) {
      return res.status(400).json({ error: 'name et muscle_group sont requis.' });
    }
    const created = await ExerciseRepository.create(req.body);
    res.status(201).json(created);
  } catch (err) { next(err); }
});

// PUT /api/exercises/:id  -> modifier
router.put('/:id', async (req, res, next) => {
  try {
    const updated = await ExerciseRepository.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Exercice introuvable.' });
    res.json(updated);
  } catch (err) { next(err); }
});

// DELETE /api/exercises/:id  -> supprimer
router.delete('/:id', async (req, res, next) => {
  try {
    const ok = await ExerciseRepository.remove(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Exercice introuvable.' });
    res.status(204).end();
  } catch (err) { next(err); }
});

export default router;
