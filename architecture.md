# Architecture

This is a **full-stack** application made of:

- **Backend**: Spring Boot (Java, REST + JPA)
- **Frontend**: React (Create React App)
- **Database**: PostgreSQL

---

## 1) High-level diagram (logical)

```text
Browser
  |
  |  (UI) React
  v
React components (src/frontend/src)
  |
  |  HTTP calls (fetch)
  v
Backend REST API
(Spring Boot: /api/v1/students)
  |
  |  JPA repository calls
  v
PostgreSQL (amigoscode)

Optional (single-process dev/prod build):
Backend also serves the built React bundle
(target/classes/static)
```

---

## 2) Frontend (React)

Location: `src/frontend/`

### Responsibilities

- Render UI to manage **Students** (list, add, delete)
- Call backend REST endpoints using `fetch`

### Key points

- API base path usage:
  - The client calls relative URLs like `api/v1/students`.
  - During local development, `src/frontend/package.json` sets:
    - `proxy: "http://localhost:8080"`
  - This forwards `/api/*` requests from the React dev server to the Spring Boot server.

Files of interest:

- `src/frontend/src/client.js`
  - `getAllStudents()` -> `GET api/v1/students`
  - `addNewStudent()` -> `POST api/v1/students`
  - `deleteStudent()` -> `DELETE api/v1/students/{id}`

---

## 3) Backend (Spring Boot)

Location: `src/main/java/com/example/demo/`

### 3.1 REST Layer (Controller)

- `StudentController`
  - Base path: `api/v1/students`
  - Endpoints:
    - `GET    /api/v1/students` -> list all students
    - `POST   /api/v1/students` -> create a student
    - `DELETE /api/v1/students/{studentId}` -> delete by id

File:

- `src/main/java/com/example/demo/student/StudentController.java`

### 3.2 Business Layer (Service)

- `StudentService`
  - Validates uniqueness of email before saving
  - Throws domain exceptions when constraints are violated

File:

- `src/main/java/com/example/demo/student/StudentService.java`

### 3.3 Data Layer (Repository + Entity)

- Entity:
  - `Student` maps to a PostgreSQL table using JPA annotations
  - Constraints:
    - `name`: `@NotBlank`
    - `email`: `@Email` + unique column
    - `gender`: `@NotNull` and stored as `EnumType.STRING`

- Repository:
  - `StudentRepository extends JpaRepository<Student, Long>`
  - Custom query `selectExistsEmail(email)` used to enforce unique email at the application level

Files:

- `src/main/java/com/example/demo/student/Student.java`
- `src/main/java/com/example/demo/student/StudentRepository.java`

---

## 4) Persistence (PostgreSQL)

Configuration:

- Database connection is configured through environment variables using `src/main/resources/application.properties`.

Required env vars:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`

Hibernate behavior:

- `spring.jpa.hibernate.ddl-auto=${DDL_AUTO:update}`
- `spring.jpa.show-sql=${SHOW_SQL:true}`
- `spring.jpa.properties.hibernate.format_sql=${FORMAT_SQL:true}`

Notes:

- With the default env var values, Hibernate will use `ddl-auto=update` (auto create/update of schema on startup).

---

## 5) Static Frontend Serving

The backend can serve the built React bundle.

Mechanism (Maven):

- `pom.xml` contains a `build-frontend` profile (enabled by default) that runs:
  1. `npm install`
  2. `npm run build`
  3. copies `src/frontend/build` into:
     - `target/classes/static`

Then Spring Boot serves static content from `target/classes/static`, typically on:

- `http://localhost:8080/`

---

## 6) Deployment Notes

There is an Elastic Beanstalk Docker configuration:

- `elasticbeanstalk/docker-compose.yml`
  - Sets `SPRING_PROFILES_ACTIVE: dev`
  - Exposes backend port mapping `80:8080`

---

## 7) End-to-end flow (request lifecycle)

1. User interacts with the React UI.
2. React calls a REST endpoint:
   - `GET/POST/DELETE api/v1/students`
3. Spring Boot controller receives the request.
4. Controller delegates to `StudentService`.
5. Service validates business rules and calls `StudentRepository`.
6. Repository executes JPA queries against PostgreSQL.
7. Response is returned back to React.
8. React updates the UI.

---

## 8) Key directories

- Backend code: `src/main/java/com/example/demo/`
- Frontend code: `src/frontend/src/`
- Backend configuration: `src/main/resources/`
- Frontend dependency manifest: `src/frontend/package.json`

---

## 9) Future improvements (optional)

Not required for running, but typical next steps:

- Move email uniqueness enforcement fully to DB constraints and handle violations cleanly.
- Add pagination/search for students if dataset grows.
- Add global exception handler for consistent error responses.
- Improve CORS/security settings if UI is served from a different domain.
