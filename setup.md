# Setup & Run Instructions

This project is a **full-stack Spring Boot + React** app.

- **Backend**: Spring Boot (REST API + serves the built React static files in `target/classes/static`)
- **Database**: PostgreSQL
- **Frontend**: React (development via `npm start`)

---

## 0) Prerequisites

Install:

- **Java 17** (used by `pom.xml`)
- **Maven**
- **Node.js + npm** (for React development; backend build can also auto-install a Node version)
- **PostgreSQL** (either local or via Docker)

---

## 1) Configure PostgreSQL

This project reads DB settings from environment variables (see `src/main/resources/application.properties`).

### Option A: Local PostgreSQL

1. Create a database (example: `amigoscode`).
2. Start PostgreSQL so it listens on `localhost:5432`.
3. Export env vars before running the backend:

```bash
export DB_URL='jdbc:postgresql://localhost:5432/amigoscode'
export DB_USERNAME='postgres'
export DB_PASSWORD='password'
```

> If your DB requires SSL, use `... ?sslmode=require` in `DB_URL`.

### Option B: Use Docker (recommended)

Create/run a PostgreSQL container with:

- database: `amigoscode`
- username: `postgres`
- password: `password`
- port: `5432`

Then run the backend with the same env var pattern:

```bash
export DB_URL='jdbc:postgresql://localhost:5432/amigoscode'
export DB_USERNAME='postgres'
export DB_PASSWORD='password'
```

---

## 2) Run the Backend (Spring Boot)

### Step 2.1: Start locally (development)

From the project root (`spring-boot-fullstack-professional/`):

```bash
./mvnw spring-boot:run
```

Backend will start on **port 8080**.

### Step 2.2: What API endpoints exist?

The React client calls:

- `GET    /api/v1/students`
- `POST   /api/v1/students`
- `DELETE /api/v1/students/{studentId}`

---

## 3) Run the Frontend (React)

### Option A: Development mode (separate process)

From `src/frontend/`:

```bash
cd src/frontend
npm install
npm start
```

React dev server runs on **http://localhost:3000**.

Notes:

- `src/frontend/package.json` includes `proxy: "http://localhost:8080"`, so API calls like `api/v1/students` will be proxied to the backend.

### Option B: Build frontend and serve from backend (single process)

The Maven build includes a `build-frontend` profile (enabled by default) that:

- runs `npm install`
- runs `npm run build`
- copies the built files into `target/classes/static`

Then the backend serves the React app.

To do a full build and run:

```bash
./mvnw clean package
./mvnw spring-boot:run
```

In this mode, open:

- http://localhost:8080

---

## 4) Testing

### Backend tests

```bash
./mvnw test
```

### Frontend tests

```bash
cd src/frontend
npm test
```

---

## 5) Common Errors

### PostgreSQL connection error

- Verify DB name (example: `amigoscode`)
- Verify `DB_USERNAME`, `DB_PASSWORD`, and `DB_URL` are correct
- If your DB requires SSL, ensure `DB_URL` includes `?sslmode=require`

### React API not working

- Ensure Spring Boot is running on **8080**
- Ensure proxy is configured (it is in `src/frontend/package.json`)

---

## 6) Quick “Run Everything” checklist

1. Start PostgreSQL (local or Docker)
2. Set env vars (at least `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`)
3. Run backend:
   ```bash
   ./mvnw spring-boot:run
   ```
4. Run frontend (dev mode):
   ```bash
   cd src/frontend && npm install && npm start
   ```
5. Open http://localhost:3000
