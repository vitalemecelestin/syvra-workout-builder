// Test de COMPOSANT : on simule le hook useFetch pour vérifier que la page
// affiche correctement les 3 états (chargement, données, erreur).
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../hooks/useFetch', () => ({ useFetch: vi.fn() }));
vi.mock('../api', () => ({ api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), del: vi.fn() } }));

import { useFetch } from '../hooks/useFetch';
import ExercisesPage from './ExercisesPage';

const state = (over) => ({ data: null, loading: false, error: null, reload: vi.fn(), ...over });
const renderPage = () => render(<MemoryRouter><ExercisesPage /></MemoryRouter>);

describe('ExercisesPage', () => {
  it('affiche « Chargement… » pendant le chargement', () => {
    useFetch.mockReturnValue(state({ loading: true }));
    renderPage();
    expect(screen.getByText('Chargement…')).toBeInTheDocument();
  });

  it('affiche les exercices reçus de l’API', () => {
    useFetch.mockImplementation((path) =>
      path.includes('muscle-groups')
        ? state({ data: ['Jambes'] })
        : state({ data: [{ id: 1, name: 'Squat', muscle_group: 'Jambes', description: 'Barre sur les trapèzes' }] })
    );
    renderPage();
    expect(screen.getByText('Squat')).toBeInTheDocument();
    expect(screen.getByText('Barre sur les trapèzes')).toBeInTheDocument();
  });

  it('affiche le message d’erreur si l’API échoue', () => {
    useFetch.mockReturnValue(state({ error: 'API indisponible' }));
    renderPage();
    expect(screen.getByText(/API indisponible/)).toBeInTheDocument();
  });
});
