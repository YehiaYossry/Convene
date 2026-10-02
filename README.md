# Convene

> A single-page event management platform: create, browse, and manage events from one fast, clean interface.

![Status](https://img.shields.io/badge/status-active-brightgreen)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/license-MIT-blue)

<!-- Add a screenshot or GIF here: ![Convene screenshot](./docs/screenshot.png) -->

## Overview

**Convene** is a JavaScript single-page application (SPA) for organizing events. Users can create events, edit them, and browse what's coming up, all without full page reloads. Navigation is handled by a custom hash-based router, and forms are handled client-side for a smooth experience.

The project started as a university web development assignment and is being extended into a fuller version with a dedicated backend and a redesigned UI.

## Features

- **Create and edit events** through a validated form
- **Browse events** in a clean list/detail view
- **Client-side routing** using a custom hash router (no page reloads)
- **Form handling** with `submit` listeners and `preventDefault()` to avoid native browser submits
- **Responsive layout** that works on desktop and mobile

## Tech Stack

| Layer     | Technology                              |
| --------- | --------------------------------------- |
| Frontend  | Vanilla JavaScript (ES6+), HTML5, CSS3  |
| Routing   | Custom hash router                      |
| Backend   | Node.js *(v2, in progress)*             |
| Database  | MongoDB Atlas *(v2, in progress)*       |

## Getting Started

### Prerequisites

- A modern web browser
- [Node.js](https://nodejs.org/) 18+ (only needed for the v2 backend)

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/convene.git
cd convene

# Install dependencies (if applicable)
npm install
```

### Running locally

```bash
# Serve the frontend (pick whichever you prefer)
npx serve .
# or open index.html directly in your browser
```

For the v2 backend, create a `.env` file in the project root:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

Then start the server:

```bash
npm start
```

## Project Structure

```
convene/
├── index.html          # App entry point
├── css/                # Stylesheets
├── js/
│   ├── router.js       # Hash-based router
│   ├── views/          # Page/view renderers
│   └── app.js          # App bootstrap
├── server/             # Backend (v2)
└── README.md
```

> Adjust this tree to match your actual folders.

## Roadmap

- [x] Hash router and view switching
- [x] Create/edit event form
- [ ] Redesigned v2 UI (dark "box office" theme)
- [ ] Layered backend architecture (routes, controllers, services)
- [ ] MongoDB persistence
- [ ] User authentication
- [ ] Event search and filtering

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to open an issue or submit a pull request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m "Add amazing feature"`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a pull request

## License

Distributed under the MIT License. See `LICENSE` for details.

## Author

**Yehia**
Computer and AI Engineering student, Ain Shams University

- GitHub: [YehiaYossry](https://github.com/YehiaYossry)
