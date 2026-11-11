-- ============================================================
--  Données fictives (seed) — ~15 exercices, 5 séances, et leurs liens
--  À exécuter APRÈS schema.sql
-- ============================================================

-- ---------- 15 exercices ----------
INSERT INTO exercises (name, muscle_group, description) VALUES
    ('Développé couché',          'Pectoraux',  'Barre, à plat sur le banc'),
    ('Développé incliné haltères','Pectoraux',  'Haltères, banc incliné'),
    ('Pompes',                    'Pectoraux',  'Au poids du corps'),
    ('Tractions',                 'Dos',        'Prise pronation'),
    ('Rowing barre',              'Dos',        'Buste penché'),
    ('Soulevé de terre',          'Dos',        'Mouvement polyarticulaire'),
    ('Squat',                     'Jambes',     'Barre sur les trapèzes'),
    ('Fentes',                    'Jambes',     'Avec haltères'),
    ('Presse à cuisses',          'Jambes',     'À la machine'),
    ('Développé militaire',       'Épaules',    'Barre au-dessus de la tête'),
    ('Élévations latérales',      'Épaules',    'Haltères sur les côtés'),
    ('Curl biceps',               'Bras',       'Haltères ou barre'),
    ('Dips triceps',              'Bras',       'Aux barres parallèles'),
    ('Planche',                   'Abdos',      'Gainage isométrique'),
    ('Crunch',                    'Abdos',      'Flexion du tronc');

-- ---------- 5 séances ----------
INSERT INTO workouts (name, description) VALUES
    ('Push Day',   'Pectoraux, épaules, triceps'),
    ('Pull Day',   'Dos et biceps'),
    ('Leg Day',    'Bas du corps'),
    ('Full Body',  'Tout le corps en une séance'),
    ('Core & Abs', 'Ceinture abdominale');

-- ---------- Liens (table de jonction) ----------
-- On retrouve les id par le nom pour ne pas coder les chiffres en dur.
-- Push Day
INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps) VALUES
    ((SELECT id FROM workouts WHERE name='Push Day'),  (SELECT id FROM exercises WHERE name='Développé couché'),           4, 8),
    ((SELECT id FROM workouts WHERE name='Push Day'),  (SELECT id FROM exercises WHERE name='Développé incliné haltères'), 3, 10),
    ((SELECT id FROM workouts WHERE name='Push Day'),  (SELECT id FROM exercises WHERE name='Développé militaire'),        3, 10),
    ((SELECT id FROM workouts WHERE name='Push Day'),  (SELECT id FROM exercises WHERE name='Dips triceps'),               3, 12),
-- Pull Day
    ((SELECT id FROM workouts WHERE name='Pull Day'),  (SELECT id FROM exercises WHERE name='Tractions'),                  4, 8),
    ((SELECT id FROM workouts WHERE name='Pull Day'),  (SELECT id FROM exercises WHERE name='Rowing barre'),               4, 10),
    ((SELECT id FROM workouts WHERE name='Pull Day'),  (SELECT id FROM exercises WHERE name='Curl biceps'),                3, 12),
-- Leg Day
    ((SELECT id FROM workouts WHERE name='Leg Day'),   (SELECT id FROM exercises WHERE name='Squat'),                      4, 8),
    ((SELECT id FROM workouts WHERE name='Leg Day'),   (SELECT id FROM exercises WHERE name='Presse à cuisses'),           3, 12),
    ((SELECT id FROM workouts WHERE name='Leg Day'),   (SELECT id FROM exercises WHERE name='Fentes'),                     3, 10),
-- Full Body (réutilise des exercices déjà présents dans d'autres séances → plusieurs-à-plusieurs)
    ((SELECT id FROM workouts WHERE name='Full Body'), (SELECT id FROM exercises WHERE name='Squat'),                      3, 10),
    ((SELECT id FROM workouts WHERE name='Full Body'), (SELECT id FROM exercises WHERE name='Développé couché'),           3, 10),
    ((SELECT id FROM workouts WHERE name='Full Body'), (SELECT id FROM exercises WHERE name='Tractions'),                  3, 8),
    ((SELECT id FROM workouts WHERE name='Full Body'), (SELECT id FROM exercises WHERE name='Planche'),                    3, 1),
-- Core & Abs
    ((SELECT id FROM workouts WHERE name='Core & Abs'),(SELECT id FROM exercises WHERE name='Planche'),                    3, 1),
    ((SELECT id FROM workouts WHERE name='Core & Abs'),(SELECT id FROM exercises WHERE name='Crunch'),                     4, 20);
