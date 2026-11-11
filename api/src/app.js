// Construction de l'application Express (séparée de server.js pour les tests).
import express from 'express';
import cors from 'cors';
import exercisesRouter from './routes/exercises.js';
import workoutsRouter from './routes/workouts.js';

export function createApp() {
  const app = express();

  app.use(cors());          // autorise le front (autre domaine) à appeler l'API
  app.use(express.json());  // parse le corps JSON des requêtes

  // Petite route de santé (pratique pour vérifier que l'API tourne).
  app.get('/', (req, res) => res.json({ status: 'ok', service: 'syvra-workout-api' }));

  app.use('/api/exercises', exercisesRouter);
  app.use('/api/workouts', workoutsRouter);

  // 404 pour toute route inconnue.
  app.use((req, res) => res.status(404).json({ error: 'Route introuvable.' }));

  // Gestionnaire d'erreurs central : chaque route fait next(err) et on arrive ici.
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Erreur serveur.' });
  });

  return app;
}
