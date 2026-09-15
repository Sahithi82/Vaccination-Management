# API Documentation

Base URL:

```text
http://localhost:5000
```

All request bodies use `Content-Type: application/json`.

Common response fields:

| Field | Meaning |
|-------|---------|
| success | `true` or `false` |
| message | Human-readable result |
| data | Object or array when a result is returned |

---

## 1. Health Check

### GET `/`

Success `200`

```json
{
  "success": true,
  "message": "Vaccination Center API is running"
}
```

---

## 2. Admin APIs

### 2.1 Admin Login

`POST /api/admin/login`

Request body:

```json
{
  "username": "admin",
  "password": "Nimda"
}
```

Success `200`

```json
{
  "success": true,
  "message": "Admin login successful"
}
```

Failure `401`

```json
{
  "success": false,
  "message": "Invalid admin credentials"
}
```

No JWT is returned.

---

### 2.2 Create Center

`POST /api/admin/centers`

Request body:

```json
{
  "name": "Community Health Center",
  "address": "Kukatpally",
  "city": "Hyderabad",
  "state": "Telangana",
  "pinCode": "500072",
  "contactNumber": "04055556666",
  "vaccineName": "Covishield",
  "availableSlots": 30,
  "status": "ACTIVE"
}
```

Success `201` returns the created center.

---

### 2.3 Get All Centers

`GET /api/admin/centers`

Optional query parameter:

```text
GET /api/admin/centers?pinCode=500072
```

Success `200` returns an array of centers.

---

### 2.4 Get Center by ID

`GET /api/admin/centers/:id`

Example:

```text
GET /api/admin/centers/1
```

Not found `404`

```json
{
  "success": false,
  "message": "Vaccination center not found"
}
```

---

### 2.5 Update Center

`PUT /api/admin/centers/:id`

Request body can include any center fields:

```json
{
  "availableSlots": 45,
  "status": "ACTIVE"
}
```

Success `200` returns the updated center.

---

### 2.6 Delete Center

`DELETE /api/admin/centers/:id`

Success `200`

```json
{
  "success": true,
  "message": "Vaccination center deleted"
}
```

Conflict `409` if vaccinations are still linked to the center.

---

### 2.7 Get All Users

`GET /api/admin/users`

Returns users without passwords.

---

### 2.8 Get All Vaccinations

`GET /api/admin/vaccinations`

Returns all bookings with user name and center name.

---

## 3. User APIs

### 3.1 Register

`POST /api/users/register`

Request body:

```json
{
  "name": "Rahul",
  "email": "rahul@gmail.com",
  "password": "Rahul@123",
  "phone": "9876543210",
  "pinCode": "500072"
}
```

Success `201`

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "Rahul",
    "email": "rahul@gmail.com",
    "phone": "9876543210",
    "pinCode": "500072"
  }
}
```

Duplicate email `409`

```json
{
  "success": false,
  "message": "Email is already registered"
}
```

The password is stored in MySQL as plain text for this beginner exercise only.

---

### 3.2 User Login

`POST /api/users/login`

Request body:

```json
{
  "email": "rahul@gmail.com",
  "password": "Rahul@123"
}
```

The backend compares email and password with the database record.

Success `200`

```json
{
  "success": true,
  "message": "User login successful",
  "data": {
    "id": 1,
    "name": "Rahul",
    "email": "rahul@gmail.com",
    "phone": "9876543210",
    "pinCode": "500072"
  }
}
```

Wrong credentials `401`

```json
{
  "success": false,
  "message": "Invalid user credentials"
}
```

No JWT is generated.

---

### 3.3 Get User by ID

`GET /api/users/:id`

Example:

```text
GET /api/users/1
```

This uses a **path parameter**.

---

### 3.4 Update User

`PUT /api/users/:id`

```json
{
  "phone": "9876500000",
  "pinCode": "500034"
}
```

Password is returned never. If `password` is sent, it is stored as plain text again.

---

## 4. Vaccination APIs

### 4.1 Get Centers

`GET /api/vaccinations/centers`

Optional **query parameter**:

```text
GET /api/vaccinations/centers?pinCode=500072
```

When `pinCode` is sent, only ACTIVE centers with slots are returned.

---

### 4.2 Get Center by ID

`GET /api/vaccinations/centers/:id`

---

### 4.3 Book Vaccination

`POST /api/vaccinations/book`

Request body:

```json
{
  "userId": 1,
  "vaccinationDate": "2026-09-20"
}
```

The backend:

1. Loads the user
2. Finds a center using the user's PIN Code
3. Decreases one slot
4. Creates a vaccination row

Success `201` includes user and center details.

No center `404`

```json
{
  "success": false,
  "message": "No vaccination center available for PIN Code 500001"
}
```

---

### 4.4 Get Vaccination by ID

`GET /api/vaccinations/:id`

---

### 4.5 Get Vaccinations by User

`GET /api/vaccinations/user/:userId`

Example:

```text
GET /api/vaccinations/user/1
```

---

### 4.6 Update Vaccination Status

`PUT /api/vaccinations/:id/status`

```json
{
  "status": "COMPLETED"
}
```

Allowed values: `BOOKED`, `COMPLETED`, `CANCELLED`.

---

### 4.7 Cancel Vaccination

`DELETE /api/vaccinations/:id`

If the booking status is `BOOKED`, the center slot is restored.

---

## 5. Quick API Table

| Method | URL | Body / params | Success |
|--------|-----|---------------|---------|
| POST | `/api/admin/login` | username, password | 200 |
| POST | `/api/admin/centers` | center JSON | 201 |
| GET | `/api/admin/centers` | optional `?pinCode=` | 200 |
| GET | `/api/admin/centers/:id` | path id | 200 |
| PUT | `/api/admin/centers/:id` | center JSON | 200 |
| DELETE | `/api/admin/centers/:id` | path id | 200 |
| GET | `/api/admin/users` | none | 200 |
| GET | `/api/admin/vaccinations` | none | 200 |
| POST | `/api/users/register` | user JSON | 201 |
| POST | `/api/users/login` | email, password | 200 |
| GET | `/api/users/:id` | path id | 200 |
| PUT | `/api/users/:id` | user JSON | 200 |
| GET | `/api/vaccinations/centers` | optional `?pinCode=` | 200 |
| GET | `/api/vaccinations/centers/:id` | path id | 200 |
| POST | `/api/vaccinations/book` | userId, vaccinationDate | 201 |
| GET | `/api/vaccinations/:id` | path id | 200 |
| GET | `/api/vaccinations/user/:userId` | path userId | 200 |
| PUT | `/api/vaccinations/:id/status` | status | 200 |
| DELETE | `/api/vaccinations/:id` | path id | 200 |

---

## 6. Frontend Notes

The React frontend can:

1. Call login
2. Store the returned user object in state or localStorage
3. Call booking APIs with `userId`

The backend does not check JWT or session cookies.
