# TuitionRider

TuitionRider is a full-stack tutoring marketplace starter for connecting students and tutors for online and offline tuition. It includes a playful React + Tailwind frontend, a Node.js + Express API, MongoDB models, email authentication, Google OAuth wiring, and a protected admin dashboard.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion
- Backend: Node.js, Express, Mongoose
- Auth: JWT, email/password login, Google OAuth with Passport
- Database: MongoDB

## Project Structure

```text
/client    React frontend
/server    Express backend
/assets    Shared branding assets
/admin     Requested admin folder placeholder
```

## Setup

1. Install dependencies:

```bash
npm install
cd client && npm install
cd ../server && npm install
```

2. Copy the example env files:

```bash
cd client
copy .env.example .env
cd ../server
copy .env.example .env
```

3. Update `server/.env` with your MongoDB URI, JWT secret, and Google OAuth credentials.

4. Start MongoDB locally or point `MONGODB_URI` to MongoDB Atlas.

## Run Locally

Open two terminals:

```bash
cd server
npm run dev
```

```bash
cd client
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend runs on `http://localhost:5000`.

## Included Features

- Landing page with hero, features, locations, footer, and floating WhatsApp button
- Login and signup with JWT
- Google OAuth backend flow
- Student registration form saved to MongoDB
- Tutor registration form saved to MongoDB
- Admin login and protected admin dashboard
- Search, filters, mark-as-contacted, and delete actions in the admin dashboard
- Toasts, loading states, and responsive styling

## API Endpoints

### Auth

- `POST /api/auth/login`
- `POST /api/auth/signup`
- `GET /api/auth/google`
- `GET /api/auth/google/callback`

### Student

- `POST /api/student/register`
- `GET /api/student/all`

### Tutor

- `POST /api/tutor/register`
- `GET /api/tutor/all`

### Admin

- `GET /api/admin/students`
- `GET /api/admin/tutors`
- `PATCH /api/admin/student/:id/contacted`
- `PATCH /api/admin/tutor/:id/contacted`
- `DELETE /api/admin/student/:id`
- `DELETE /api/admin/tutor/:id`

## Admin Credentials

- Email: `admin@tuitionrider.com`
- Password: `admin123`

## Google OAuth Notes

Create credentials in Google Cloud Console and add the callback URL:

```text
http://localhost:5000/api/auth/google/callback
```

Also set the frontend origin to:

```text
http://localhost:5173
```

## Build

```bash
cd client
npm run build
```

```bash
cd server
npm start
```
