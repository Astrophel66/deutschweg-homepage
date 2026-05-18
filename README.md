# DeutschWeg — German Learning Platform

Modern German learning ecosystem built with React + Vite + TailwindCSS + Framer Motion.

## Tech Stack

- **React 18** + JSX (no TypeScript)
- **Vite** — dev server and bundler
- **TailwindCSS** — utility-first styling
- **Framer Motion** — animations
- **Lucide React** — icons (available, not yet used everywhere)

## Project Structure

```
src/
├── main.jsx              # Entry point
├── App.jsx               # Root — assembles all sections in order
│
├── sections/             # One file per homepage section
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── Stats.jsx
│   ├── Features.jsx
│   ├── HowItWorks.jsx
│   ├── Teachers.jsx
│   ├── Courses.jsx
│   ├── Resources.jsx
│   ├── Testimonials.jsx
│   ├── CTA.jsx
│   └── Footer.jsx
│
├── components/
│   ├── ui/               # Reusable primitives
│   │   ├── Button.jsx    # variant: primary|ghost|outline|danger|white
│   │   ├── Badge.jsx     # variant: gold|red|green|blue|gray
│   │   ├── Avatar.jsx    # Initials circle avatar
│   │   └── ProgressBar.jsx
│   │
│   └── shared/           # Layout helpers
│       ├── FadeIn.jsx        # Framer Motion whileInView wrapper
│       └── SectionHeader.jsx # Eyebrow + title + subtitle block
│
├── data/                 # Mock data — swap with API calls later
│   ├── teachers.js       # → GET /api/teachers/
│   ├── courses.js        # → GET /api/courses/
│   ├── resources.js      # → GET /api/resources/
│   ├── testimonials.js   # → GET /api/testimonials/
│   └── features.js       # Static — no API needed
│
└── styles/
    └── index.css         # Tailwind directives + CSS variables
```

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Connecting the Backend (Django REST Framework)

Each `data/*.js` file maps to a DRF endpoint. When your API is ready:

1. Install axios: `npm install axios`
2. Create `src/services/api.js` with your base URL
3. Replace the mock import in each section with a `useEffect` + `useState` fetch

Example for `Teachers.jsx`:
```js
// Before (mock):
import { teachers } from '../data/teachers.js'

// After (API):
const [teachers, setTeachers] = useState([])
useEffect(() => {
  fetch('/api/teachers/').then(r => r.json()).then(setTeachers)
}, [])
```

## Color Tokens (CSS Variables)

| Variable | Value | Usage |
|---|---|---|
| `--cream` | `#FAF8F4` | Page background |
| `--charcoal` | `#1C1C1E` | Primary text, buttons |
| `--red-brand` | `#C0392B` | Accent, CTA |
| `--gold-brand` | `#B8860B` | Secondary accent |
| `--warm-gray` | `#8A8680` | Muted text |
| `--border-color` | `#E8E4DE` | Borders |
