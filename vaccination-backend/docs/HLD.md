# High Level Design (HLD)

## 1. Purpose

This document explains the Vaccination Center Backend at a high level.

The system helps:

- An admin manage vaccination centers
- A user register, login, and book a vaccination
- The backend assign a suitable center using the user's PIN Code

This is a beginner training project. Authentication is intentionally simple.

---

## 2. Actors

| Actor | Role |
|-------|------|
| Admin | Logs in with hardcoded credentials and manages centers |
| User | Registers, logs in, views centers, and books a vaccination |
| React Frontend | Calls the APIs and stores login state in React state / localStorage |
| Postman | Tests APIs without a frontend |
| MySQL | Stores users, centers, and vaccination bookings |

---

## 3. System Context

```text
 ┌─────────────────────┐
 │ React Frontend      │
 │ localhost:3000      │
 └──────────┬──────────┘
            │ HTTP JSON
            │ CORS allowed
            ▼
 ┌─────────────────────┐
 │ Express Backend     │
 │ localhost:5000      │
 └──────────┬──────────┘
            │ SQL
            ▼
 ┌─────────────────────┐
 │ MySQL 8             │
 │ vaccination_db      │
 └─────────────────────┘
```

The React frontend should call:

```text
http://localhost:5000
```

---

## 4. Modules

| Module | Files | Responsibility |
|--------|-------|----------------|
| Server | `server.js` | Start Express, enable CORS, mount routes |
| Database config | `config/db.js` | MySQL connection pool |
| Admin | `adminRoutes.js`, `adminController.js` | Admin login and center CRUD |
| User | `userRoutes.js`, `userController.js` | Register, login, profile |
| Vaccination | `vaccinationRoutes.js`, `vaccinationController.js` | Search centers, book, cancel |
| Models | `userModel.js`, `centerModel.js`, `vaccinationModel.js` | MySQL queries |

---

## 5. Technology Choices

| Choice | Why it is used in this training project |
|--------|----------------------------------------|
| Express | Simple REST APIs for beginners |
| MySQL Workbench 8 | Visual tool to create tables and view data |
| mysql2 | Works well with MySQL 8 |
| cors | Lets React on another port call this API |
| dotenv | Keeps database password out of source code |
| nodemon | Auto-restarts the server after code changes |

Not used on purpose:

- JWT
- bcrypt / password hashing
- Sessions
- Auth middleware
- OAuth

---

## 6. Functional Scope

### Admin

- Login with username `admin` and password `Nimda`
- Create, read, update, and delete vaccination centers
- View all users
- View all vaccination bookings

### User

- Register with name, email, password, phone, and PIN Code
- Login with email and password
- View and update own basic details
- Search centers by PIN Code
- Book a vaccination
- View own bookings
- Cancel a booking

### System

- Assign a center using the user's PIN Code
- Reduce available slots after booking
- Restore a slot when a booked vaccination is cancelled

---

## 7. Authentication Approach

Authentication is only a login check.

**Admin login**

- Credentials are hardcoded in `adminController.js`
- No token is created
- Frontend / Postman can call admin APIs after a successful login response

**User login**

- Email and password are compared with the `users` table
- Password is stored as plain text
- Successful login returns basic user information
- Frontend can keep that user object in React state or localStorage

This is for learning REST and CRUD only. It is not production security.

---

## 8. Data Relationships

```text
users 1 ──────── * vaccinations * ──────── 1 centers
```

- One user can have many vaccination bookings
- One center can have many vaccination bookings
- A vaccination row stores both `user_id` and `center_id`

PIN Code is the business rule used to choose a center. It is not a database foreign key.

---

## 9. Deployment View for Training

Everything runs on one student laptop:

| Process | Address |
|---------|---------|
| React (later) | `http://localhost:3000` |
| Express API | `http://localhost:5000` |
| MySQL | `localhost:3306` |

No Docker, cloud, or extra services are required.

---

## 10. Quality Goals for This Training Project

| Goal | Simple meaning |
|------|----------------|
| Easy to read | Routes, controllers, and models are separate |
| Easy to test | Postman collection covers success and failure cases |
| Clear errors | APIs return `{ success, message }` |
| Learnable | Students can follow request body, path, and query examples |
