# Low Level Design (LLD)

## 1. Purpose

This document explains how each module works and how a request is processed.

---

## 2. Layer Responsibilities

```text
server.js          Receive HTTP request, apply CORS and JSON parsing
   ↓
routes/*.js        Map URL + HTTP method to a controller function
   ↓
controllers/*.js   Validate input, call models, send JSON response
   ↓
models/*.js        Run SQL with mysql2
   ↓
MySQL              Store and return rows
```

Rules for this project:

- Routes do not contain SQL
- Controllers do not create the Express app
- Models do not send HTTP responses

---

## 3. Server Design

File: `server.js`

Startup steps:

1. Load `.env` with dotenv
2. Create the Express app
3. Enable CORS for any origin
4. Parse JSON request bodies
5. Mount three route groups
6. Listen on port `5000`
7. Test the MySQL connection

Route mounts:

| Prefix | Route file |
|--------|------------|
| `/api/admin` | `adminRoutes.js` |
| `/api/users` | `userRoutes.js` |
| `/api/vaccinations` | `vaccinationRoutes.js` |

---

## 4. Database Connection

File: `config/db.js`

- Uses `mysql2/promise`
- Creates a connection pool
- Exports `pool` for queries
- Exports `testConnection()` for startup check

Controllers that need a transaction (book and cancel) take a connection from the same pool.

---

## 5. Admin Module

### 5.1 Hardcoded credentials

```text
username = admin
password = Nimda
```

These values live in `adminController.js`. They are not stored in MySQL.

### 5.2 Functions

| Function | Input | Output |
|----------|-------|--------|
| `login` | `{ username, password }` | success / invalid credentials |
| `createCenter` | center JSON | created center |
| `getCenters` | optional `?pinCode=` | center list |
| `getCenterById` | path `:id` | one center |
| `updateCenter` | path `:id` + JSON | updated center |
| `deleteCenter` | path `:id` | success or conflict |
| `getUsers` | none | users without passwords |
| `getVaccinations` | none | all bookings |

### 5.3 Delete rule

If a center still has vaccination rows, MySQL returns a foreign key error. The controller converts that to HTTP `409`.

---

## 6. User Module

### 6.1 Registration fields

| Field | Stored as |
|-------|-----------|
| name | `users.name` |
| email | `users.email` (unique) |
| password | `users.password` (plain text) |
| phone | `users.phone` |
| pinCode | `users.pin_code` |

### 6.2 Functions

| Function | Behaviour |
|----------|-----------|
| `register` | Reject duplicate email with `409` |
| `login` | Compare email + password with one SQL query |
| `getUserById` | Return user without password |
| `updateUser` | Update provided fields, keep old values for missing fields |

Login SQL:

```sql
SELECT * FROM users WHERE email = ? AND password = ?
```

No hashing. No JWT.

---

## 7. Vaccination Module

### 7.1 Center search

`GET /api/vaccinations/centers?pinCode=500072`

If `pinCode` is present, only ACTIVE centers with slots are returned.

If `pinCode` is absent, all centers are returned.

### 7.2 Booking algorithm

`POST /api/vaccinations/book`

1. Validate `userId` and `vaccinationDate`
2. Load the user
3. Search ACTIVE centers for `user.pin_code` with `available_slots > 0`
4. Sort by `available_slots DESC` and pick the first center
5. Start a transaction
6. Decrease slots
7. Insert vaccination row with status `BOOKED`
8. Commit
9. Return booking + user + center details

If no center matches, return `404`.

### 7.3 Cancel algorithm

`DELETE /api/vaccinations/:id`

1. Load the vaccination
2. Delete the row
3. If status was `BOOKED`, increase the center slot by 1
4. Return success

### 7.4 Status values

| Status | Meaning |
|--------|---------|
| `BOOKED` | Slot reserved |
| `COMPLETED` | Vaccination done |
| `CANCELLED` | Marked cancelled without deleting the row |

`PUT /api/vaccinations/:id/status` only accepts those three values.

---

## 8. Response Shape

Success:

```json
{
  "success": true,
  "message": "User login successful",
  "data": {}
}
```

Failure:

```json
{
  "success": false,
  "message": "Invalid user credentials"
}
```

Admin login uses the exact messages requested for this training project:

- `Admin login successful`
- `Invalid admin credentials`

---

## 9. HTTP Status Codes Used

| Code | When |
|------|------|
| 200 | Login success, fetch, update, delete |
| 201 | Register, create center, book vaccination |
| 400 | Missing or invalid fields |
| 401 | Wrong admin or user credentials |
| 404 | User, center, booking, or PIN Code center not found |
| 409 | Duplicate email or center still has bookings |
| 500 | Unexpected database or server error |

---

## 10. Parameter Types

| Type | Example |
|------|---------|
| Request body | `{ "email": "rahul@gmail.com", "password": "Rahul@123" }` |
| Path parameter | `/api/users/1` |
| Query parameter | `/api/vaccinations/centers?pinCode=500072` |

---

## 11. Error Logging

Controllers use `console.error` with a short function name and `error.message`.

Technical SQL details are not sent to the client.

---

## 12. What Is Intentionally Missing

These files are not created:

- `authMiddleware.js`
- `adminMiddleware.js`

The frontend keeps login state. Backend APIs perform the required database work directly.
