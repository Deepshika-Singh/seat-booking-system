import { createContext, useCallback, useState } from 'react';
import api from '../services/api';
import { asArray } from '../utils/apiResponse';

export const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/booking/my-bookings');
      setBookings(asArray(response.data));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  const bookSeat = useCallback(async (showId, seats, price) => {
    const response = await api.post('/booking/book-seat', {
      showId,
      seats,
      price,
    });
    return response.data;
  }, []);

  const value = {
    bookings,
    loading,
    error,
    fetchBookings,
    bookSeat,
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
};
