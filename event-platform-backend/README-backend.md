# Convene — Event Platform Backend

REST API for Convene, an event management platform. Built with Node.js, Express, and MongoDB (via Mongoose).

## Features

- Full CRUD for events
- Attendee registration with duplicate-email prevention
- Cancel registrations
- Dashboard stats via MongoDB aggregation (total events, upcoming events, total registrations, most popular event)
- Search and filter events by title, category, location, and date
- Centralized error handling (404 / 500)

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- dotenv, cors, morgan

## Getting Started

### Prerequisites
- Node.js installed
- A MongoDB connection string (MongoDB Atlas or a local instance)

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/event-platform-backend.git
cd event-platform-backend
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your own values:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
CLIENT_ORIGIN=http://localhost:5500
```

### Running the server

```bash
npm run dev     # development, with auto-restart via nodemon
npm start       # production
```

Server runs on `http://localhost:5000` by default.

## API Endpoints

### Events
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/events` | List all events (supports `?search`, `?category`, `?location`, `?date`) |
| POST | `/api/events` | Create a new event |
| GET | `/api/events/:id` | Get a single event (includes `registrationsCount`) |
| PUT | `/api/events/:id` | Update an event |
| DELETE | `/api/events/:id` | Delete an event and its registrations |

### Registrations
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/events/:id/register` | Register an attendee (name + email) |
| GET | `/api/events/:id/attendees` | List attendees for an event |
| DELETE | `/api/events/:id/registrations/:registrationId` | Cancel a registration |

### Dashboard & Health
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard` | Platform-wide stats |
| GET | `/api/health` | Health check |

## Response Format

All responses follow a consistent envelope:

```json
{ "success": true, "data": { ... } }
```
or
```json
{ "success": false, "message": "..." }
```

## Project Structure

```
event-platform-backend/
├── controllers/
├── middleware/
├── models/
├── routes/
├── server.js
├── .env.example
└── .gitignore
```
