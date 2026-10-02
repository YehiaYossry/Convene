# Convene — Event Platform Frontend

A vanilla JavaScript Single-Page Application (SPA) frontend for Convene, an event management platform. Communicates with the [Convene backend API](https://github.com/YOUR_USERNAME/event-platform-backend) over `fetch()`.

## Features

- **Dashboard** — live platform stats (total events, upcoming events, total registrations, most popular event)
- **Events List** — browsable event cards with search and filters (title, category, location, date)
- **Event Detail** — full event info, remaining spots, attendee list, registration form, cancel registration
- **Create / Edit Event** — shared form with client-side validation
- Hash-based client-side routing (no page reloads)
- Toast notifications for success/error states
- Confirmation modal before deleting an event
- Responsive layout (mobile, tablet, desktop)

## Tech Stack

- Vanilla HTML, CSS, and JavaScript (no frameworks)
- `fetch()` for all API communication

## Getting Started

### Prerequisites
- The [Convene backend](https://github.com/YOUR_USERNAME/event-platform-backend) running locally on `http://localhost:5000`
- A local static server (e.g. VS Code's Live Server extension)

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/event-platform-frontend.git
cd event-platform-frontend
```

No build step or dependencies — it's plain HTML/CSS/JS.

### Running

Open `index.html` with a local static server on **port 5500** (e.g. VS Code Live Server), so the URL is `http://localhost:5500`. This must match the backend's `CLIENT_ORIGIN` setting for CORS to work correctly.

Make sure the backend is running first at `http://localhost:5000`.

## Project Structure

```
event-platform-frontend/
├── index.html      # single-page shell with all four views
├── style.css
└── app.js          # routing, fetch calls, rendering
```

## Views

| View | Hash | Description |
|---|---|---|
| Dashboard | `#dashboard` | Platform stats overview |
| Events List | `#events` | Browse, search, filter, edit, delete events |
| Event Detail | `#detail/:id` | Event info, attendees, registration |
| Create/Edit | `#create` or `#create/:id` | Create a new event or edit an existing one |
