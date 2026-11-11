// Test UNITAIRE du custom hook useFetch (on mocke l'API).
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

vi.mock('../api', () => ({ api: { get: vi.fn() } }));
import { api } from '../api';
import { useFetch } from './useFetch';

describe('useFetch', () => {
  beforeEach(() => vi.clearAllMocks());

  it('commence en loading puis renvoie les données', async () => {
    api.get.mockResolvedValue([{ id: 1, name: 'Squat' }]);

    const { result } = renderHook(() => useFetch('/api/exercises'));

    expect(result.current.loading).toBe(true); // état initial
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual([{ id: 1, name: 'Squat' }]);
    expect(result.current.error).toBe(null);
  });

  it('capture le message d’erreur si l’API échoue', async () => {
    api.get.mockRejectedValue(new Error('API indisponible'));

    const { result } = renderHook(() => useFetch('/api/exercises'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('API indisponible');
    expect(result.current.data).toBe(null);
  });
});
