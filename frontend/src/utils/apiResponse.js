const LIST_KEYS = ['events', 'shows', 'bookings', 'items', 'results', 'data'];

/** Unwrap `{ success, data }` (and similar) API envelopes. */
export function unwrapApiData(body) {
  if (body == null) return null;
  if (Array.isArray(body)) return body;

  if (typeof body === 'object') {
    if ('data' in body && body.data !== undefined) {
      return body.data;
    }
  }

  return body;
}

/** Always return an array for list endpoints. */
export function asArray(value) {
  const unwrapped = unwrapApiData(value);

  if (Array.isArray(unwrapped)) {
    return unwrapped;
  }

  if (unwrapped && typeof unwrapped === 'object') {
    for (const key of LIST_KEYS) {
      if (Array.isArray(unwrapped[key])) {
        return unwrapped[key];
      }
    }
  }

  return [];
}
