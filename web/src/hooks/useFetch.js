// CUSTOM HOOK demandé par le sujet.
// useFetch(path) : va chercher des données à l'API et expose
// { data, loading, error, reload }. On peut recharger après une modif.
import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';

export function useFetch(path) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useCallback : la fonction garde la même référence tant que `path`
  // ne change pas (évite des rechargements en boucle).
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await api.get(path));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}
