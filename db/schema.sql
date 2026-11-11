-- ============================================================
--  Syvra Workout Builder — Schéma de la base de données
--  3 tables : exercises, workouts, workout_exercises (jonction)
--  Relation plusieurs-à-plusieurs entre workouts et exercises
-- ============================================================

-- On repart propre à chaque exécution (pratique en développement).
-- CASCADE supprime aussi les lignes liées dans la table de jonction.
DROP TABLE IF EXISTS workout_exercises CASCADE;
DROP TABLE IF EXISTS workouts CASCADE;
DROP TABLE IF EXISTS exercises CASCADE;

-- ---------- Table 1 : les exercices ----------
CREATE TABLE exercises (
    id            SERIAL PRIMARY KEY,          -- identifiant auto-incrémenté
    name          TEXT NOT NULL,               -- ex. "Développé couché"
    muscle_group  TEXT NOT NULL,               -- ex. "Pectoraux" (sert au filtre)
    description   TEXT                         -- optionnel
);

-- ---------- Table 2 : les séances ----------
CREATE TABLE workouts (
    id            SERIAL PRIMARY KEY,
    name          TEXT NOT NULL,               -- ex. "Push Day"
    description   TEXT
);

-- ---------- Table 3 : la table de JONCTION ----------
-- C'est elle qui crée le lien plusieurs-à-plusieurs.
-- Une ligne = "tel exercice, dans telle séance, avec X séries et Y répétitions".
CREATE TABLE workout_exercises (
    id            SERIAL PRIMARY KEY,
    workout_id    INTEGER NOT NULL REFERENCES workouts(id)  ON DELETE CASCADE, -- clé étrangère 1
    exercise_id   INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE, -- clé étrangère 2
    sets          INTEGER NOT NULL,            -- nombre de séries
    reps          INTEGER NOT NULL,            -- nombre de répétitions
    -- Empêche d'ajouter deux fois le MÊME exercice dans la MÊME séance :
    UNIQUE (workout_id, exercise_id)
);

-- Index pour accélérer les recherches par séance ou par exercice
CREATE INDEX idx_we_workout  ON workout_exercises(workout_id);
CREATE INDEX idx_we_exercise ON workout_exercises(exercise_id);
