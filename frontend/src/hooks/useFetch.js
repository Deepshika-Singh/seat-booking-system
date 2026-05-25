import { useEffect, useState } from 'react';
import api from '../services/api';
import { unwrapApiData } from '../utils/apiResponse';

export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!!url);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      setData(null);
      return undefined;
    }

    let active = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(url);
        if (active) {
          setData(unwrapApiData(response.data));
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || err.message);
          setData(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [url]);

  return { data, loading, error };
};
