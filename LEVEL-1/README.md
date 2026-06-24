# Product Manager — Full-Stack CRUD App

A full-stack inventory management app built for the **Codveda Level 1 Full-Stack Development Internship**. A Node.js/Express REST API backed by MongoDB, consumed by a vanilla HTML/CSS/JavaScript frontend — no frameworks, no build step.

> 🚧 Level 1 complete. Level 2 in progress.

## Features

- Full CRUD on a `Product` resource (name, price, description, in-stock status)
- RESTful API with proper HTTP methods and status codes
- Centralized error handling (validation errors, malformed IDs, server errors)
- Vanilla JS frontend with create/edit/delete, no page reloads
- Light/dark theme toggle, persisted across sessions
- Clean separation of concerns on both backend (routes/controllers/models) and frontend (API layer/DOM layer)

## Screenshots

![mobile](mobile.png )
![mobile_light](mobile_light.png)
![desktop](desktop.png)

## Tech Stack

**Backend:** Node.js, Express.js, Mongoose, MongoDB Atlas, dotenv, cors
**Frontend:** HTML5, CSS3 (custom properties, no preprocessor), vanilla JavaScript (ES Modules, Fetch API)
**Tooling:** Postman (API testing), nodemon (dev reload), Git/GitHub

## Project Structure

```
codveda-level1/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # MongoDB connection
│   │   ├── controllers/
│   │   │   └── product.controller.js
│   │   ├── middlewares/
│   │   │   ├── errorHandler.js    # Centralized error responses
│   │   │   └── validateObjectId.js
│   │   ├── models/
│   │   │   └── product.model.js
│   │   ├── routes/
│   │   │   └── product.routes.js
│   │   ├── utils/
│   │   │   ├── ApiError.js
│   │   │   └── AsyncHandler.js
│   │   └── app.js                 # Express app config (middleware + routes)
│   ├── server.js                  # Entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── api.js                 # All fetch() calls
│   │   ├── main.js                # DOM rendering & events
│   │   └── theme.js                # Light/dark toggle logic
│   └── index.html
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18+) and npm
- A MongoDB Atlas account (free tier is enough)

### Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` based on `.env.example`:

```
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
```

Run the server:

```bash
npm run dev      # development, auto-restarts on save
npm start        # production
```

The API runs at `http://localhost:5000`.

### Frontend setup

From the `frontend/` folder, serve it with any static server (it uses ES Modules, which browsers block on `file://`):

```bash
npx serve .
```

or open `index.html` with the VS Code Live Server extension.

## API Reference

Base URL: `/api/products`

| Method | Endpoint | Description | Body |
|---|---|---|---|
| GET | `/api/health` | Health check | — |
| GET | `/api/products` | Get all products | — |
| GET | `/api/products/:id` | Get a single product | — |
| POST | `/api/products` | Create a product | `{ name, price, description?, inStock? }` |
| PUT/PATCH | `/api/products/:id` | Update a product (partial supported) | any subset of the fields above |
| DELETE | `/api/products/:id` | Delete a product | — |

**Example — create a product**

Request:
```json
POST /api/products
{
  "name": "Wireless Mouse",
  "price": 25.99,
  "description": "Ergonomic mouse",
  "inStock": true
}
```

Response (`201 Created`):
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Wireless Mouse",
    "price": 25.99,
    "description": "Ergonomic mouse",
    "inStock": true,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Error responses** follow a consistent shape:
```json
{ "success": false, "message": "Product not found" }
```

| Status | Meaning |
|---|---|
| 400 | Invalid input or malformed ID |
| 404 | Product not found |
| 500 | Unexpected server error |

## Testing

All endpoints were manually tested in Postman during development, covering success cases, validation failures, and not-found cases for each route.

## What I Learned

- Diagnosed and fixed a Windows-specific MongoDB Atlas connection failure caused by SRV DNS record resolution, by forcing Node to use public DNS servers.
- Practiced writing atomic, scoped git commits rather than batching unrelated changes together.
- Built a centralized Express error handler that correctly distinguishes Mongoose validation errors, cast errors, and generic failures — instead of defaulting everything to a 500.
- Implemented event delegation to handle dynamically rendered Edit/Delete buttons without re-attaching listeners on every render.

## Future Improvements (Level 2+)

- Pagination, filtering, and search on the product list
- Authentication (JWT) and per-user product ownership
- Automated tests (Jest + Supertest for the API)
- Replace `confirm()` with a custom, styled confirmation modal
- Deploy backend (Render/Railway) and frontend (Netlify/Vercel)

## License

MIT