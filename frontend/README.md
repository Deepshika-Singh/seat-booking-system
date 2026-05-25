# Seat Booking Frontend

React + Vite seat booking app connected to the seat-booking backend API.

## Features

- Browse events and shows
- Select seats and book
- User login / signup (cookie-based auth)
- My Bookings page

## Setup

```bash
npm install
```

Create `.env` (already included):

```
VITE_API_URL=/api
```

The dev server proxies `/api` to `http://localhost:5000`.

## Run

Start the backend first (`seat_booking/backend`), then:

```bash
npm run dev
```

App runs at http://localhost:3000

## Build

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/   # UI components
  context/      # Auth & booking state
  hooks/        # useAuth, useBooking, useFetch
  pages/        # Route pages
  services/     # Axios API client
  App.jsx       # Routes
  main.jsx      # Entry point
```
