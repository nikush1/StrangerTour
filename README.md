# StrangerTour

StrangerTour is a full-stack travel community platform for solo travelers to discover trips, join groups, and connect with like-minded strangers.

## Architecture

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB
- Auth: JWT
- Real-time chat: Socket.io

## Folder structure

- `/frontend` — React app
- `/backend` — Express API and MongoDB models

## Backend setup

1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env`
4. Set `MONGO_URI`, `JWT_SECRET`, and `GOOGLE_CLIENT_ID`
5. `npm run dev`

## Frontend setup

1. `cd frontend`
2. `npm install`
3. Copy `.env.example` to `.env`
4. Set `VITE_GOOGLE_CLIENT_ID`
5. `npm run dev`

## Notes

- The backend exposes auth, trip, user, and chat routes under `/api`
- Chat uses Socket.io for live trip room messaging
- JWT is stored in `localStorage` and sent on API requests
- The app supports dark/light mode and mobile-first UI

## Demo login

Use the seeded demo account to preview the app immediately:

- Email: `demo@strangertour.com`
- Password: `Password123!`
