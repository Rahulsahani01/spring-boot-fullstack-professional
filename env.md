# Environment / Configuration

This document explains how runtime configuration is provided to the app.

---

## 1) Spring Boot configuration

### Primary file

- `src/main/resources/application.properties`

This project is configured to read database and Hibernate settings from **environment variables**.

The following properties are mapped:

- `spring.datasource.url=${DB_URL}`
- `spring.datasource.username=${DB_USERNAME}`
- `spring.datasource.password=${DB_PASSWORD}`

Hibernate / logging:

- `spring.jpa.hibernate.ddl-auto=${DDL_AUTO:update}`
- `spring.jpa.show-sql=${SHOW_SQL:true}`
- `spring.jpa.properties.hibernate.format_sql=${FORMAT_SQL:true}`

### Profiles

- The app uses `SPRING_PROFILES_ACTIVE` **if** you introduce profile-specific properties.
- With the current `application.properties`, you mainly control behavior through environment variables.

---

## 2) Required environment variables (PostgreSQL)

To connect to PostgreSQL, set:

- `DB_URL` (example: `jdbc:postgresql://<host>:5432/<db>?sslmode=require`)
- `DB_USERNAME`
- `DB_PASSWORD`

Optional:

- `DDL_AUTO` (default: `update`)
- `SHOW_SQL` (default: `true`)
- `FORMAT_SQL` (default: `true`)

---

## 3) Server port

- Spring Boot runs on **8080** by default (no explicit `server.port` is set in the properties shown).

---

## 4) Frontend configuration

### React development proxy

- `src/frontend/package.json` defines:
  - `proxy: "http://localhost:8080"`

Effect:

- During `npm start`, requests like `api/v1/students` from the React dev server are proxied to the Spring Boot backend at `http://localhost:8080/api/v1/students`.

---

## 5) Docker / Deployment

Your container/platform should provide the required env vars:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`

The backend will pick them up automatically through `application.properties`.

---

## 6) What you may need to change

If local database credentials differ from your deployment credentials:

- do not hardcode values in `application.properties`
- set the environment variables (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`) for your runtime (terminal, Docker, Elastic Beanstalk, etc.)
