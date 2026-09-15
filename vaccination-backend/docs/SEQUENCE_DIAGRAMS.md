# Sequence Diagrams

These diagrams show how requests move through the system.

---

## 1. Admin Login

```text
Postman / React          Express                 adminController
      |                      |                         |
      | POST /api/admin/login|                         |
      | {admin, Nimda}       |                         |
      |--------------------->|                         |
      |                      | login(req, res)         |
      |                      |------------------------>|
      |                      |                         | compare hardcoded values
      |                      |                         |
      | 200 Admin login successful                     |
      |<---------------------|<------------------------|
```

```mermaid
sequenceDiagram
    participant Client as React / Postman
    participant API as Express server.js
    participant Admin as adminController

    Client->>API: POST /api/admin/login
    API->>Admin: login(username, password)
    alt username is admin and password is Nimda
        Admin-->>Client: 200 Admin login successful
    else credentials are wrong
        Admin-->>Client: 401 Invalid admin credentials
    end
```

No database call is made. No JWT is created.

---

## 2. User Registration

```text
React                    userRoutes              userController           userModel              MySQL
  |                          |                         |                      |                    |
  | POST /api/users/register |                         |                      |                    |
  |------------------------->| register()              |                      |                    |
  |                          |------------------------>| findUserByEmail()    |                    |
  |                          |                         |--------------------->| SELECT email       |
  |                          |                         |                      |------------------->|
  |                          |                         | createUser()         |                    |
  |                          |                         |--------------------->| INSERT users       |
  |                          |                         |                      |------------------->|
  | 201 User registered      |                         |                      |                    |
  |<-------------------------|<------------------------|<---------------------|<-------------------|
```

```mermaid
sequenceDiagram
    participant Client as React / Postman
    participant Route as userRoutes
    participant Ctrl as userController
    participant Model as userModel
    participant DB as MySQL

    Client->>Route: POST /api/users/register
    Route->>Ctrl: register(body)
    Ctrl->>Model: findUserByEmail(email)
    Model->>DB: SELECT users
    alt email already exists
        Ctrl-->>Client: 409 Email is already registered
    else new email
        Ctrl->>Model: createUser(name, email, password, phone, pinCode)
        Model->>DB: INSERT users
        Ctrl-->>Client: 201 user details without password
    end
```

The password is stored as plain text for this training project only.

---

## 3. User Login

```mermaid
sequenceDiagram
    participant Client as React / Postman
    participant Ctrl as userController
    participant Model as userModel
    participant DB as MySQL

    Client->>Ctrl: POST /api/users/login
    Ctrl->>Model: findUserByEmailAndPassword(email, password)
    Model->>DB: SELECT * FROM users WHERE email = ? AND password = ?
    alt row found
        Ctrl-->>Client: 200 user details
    else no row
        Ctrl-->>Client: 401 Invalid user credentials
    end
```

React can save the returned user object in state or localStorage.

---

## 4. Admin Creates a Center

```mermaid
sequenceDiagram
    participant Client as React / Postman
    participant Ctrl as adminController
    participant Model as centerModel
    participant DB as MySQL

    Client->>Ctrl: POST /api/admin/centers
    Ctrl->>Ctrl: validate required fields
    Ctrl->>Model: createCenter(...)
    Model->>DB: INSERT centers
    Model->>DB: SELECT created center
    Ctrl-->>Client: 201 center data
```

---

## 5. Search Centers by Query Parameter

```mermaid
sequenceDiagram
    participant Client as React / Postman
    participant Ctrl as vaccinationController
    participant Model as centerModel
    participant DB as MySQL

    Client->>Ctrl: GET /api/vaccinations/centers?pinCode=500072
    Ctrl->>Model: findCentersByPinCode(500072)
    Model->>DB: SELECT ACTIVE centers with slots
    Ctrl-->>Client: 200 center list
```

This is the query-parameter learning example.

---

## 6. Book Vaccination (PIN Code Allocation)

```text
React                 vaccinationController           userModel / centerModel / vaccinationModel              MySQL
  |                            |                                        |                                      |
  | POST /api/vaccinations/book|                                        |                                      |
  | {userId, date}             |                                        |                                      |
  |--------------------------->| findUserById(userId)                   |                                      |
  |                            |--------------------------------------->| SELECT users                         |
  |                            | findCentersByPinCode(user.pin_code)    |                                      |
  |                            |--------------------------------------->| SELECT centers                       |
  |                            | beginTransaction                       |                                      |
  |                            | decreaseSlots(centerId)                | UPDATE available_slots               |
  |                            | createVaccination(...)                 | INSERT vaccinations                  |
  |                            | commit                                 |                                      |
  | 201 booking + center       |                                        |                                      |
  |<---------------------------|                                        |                                      |
```

```mermaid
sequenceDiagram
    participant Client as React / Postman
    participant Ctrl as vaccinationController
    participant User as userModel
    participant Center as centerModel
    participant Vac as vaccinationModel
    participant DB as MySQL

    Client->>Ctrl: POST /api/vaccinations/book
    Ctrl->>User: findUserById(userId)
    User->>DB: SELECT users
    alt user missing
        Ctrl-->>Client: 404 User not found
    else user found
        Ctrl->>Center: findCentersByPinCode(user.pin_code)
        Center->>DB: SELECT ACTIVE centers with slots
        alt no center
            Ctrl-->>Client: 404 No vaccination center available
        else center found
            Ctrl->>DB: BEGIN
            Ctrl->>Center: decreaseSlots(centerId)
            Ctrl->>Vac: createVaccination(...)
            Vac->>DB: INSERT vaccinations
            Ctrl->>DB: COMMIT
            Ctrl-->>Client: 201 booking details
        end
    end
```

---

## 7. Get User by Path Parameter

```mermaid
sequenceDiagram
    participant Client as React / Postman
    participant Ctrl as userController
    participant Model as userModel
    participant DB as MySQL

    Client->>Ctrl: GET /api/users/1
    Note over Client,Ctrl: 1 is a path parameter
    Ctrl->>Model: findUserById(1)
    Model->>DB: SELECT users WHERE id = 1
    alt found
        Ctrl-->>Client: 200 user without password
    else missing
        Ctrl-->>Client: 404 User not found
    end
```

---

## 8. Cancel Vaccination

```mermaid
sequenceDiagram
    participant Client as React / Postman
    participant Ctrl as vaccinationController
    participant Vac as vaccinationModel
    participant Center as centerModel
    participant DB as MySQL

    Client->>Ctrl: DELETE /api/vaccinations/1
    Ctrl->>Vac: findVaccinationById(1)
    alt not found
        Ctrl-->>Client: 404 Vaccination record not found
    else found and BOOKED
        Ctrl->>DB: BEGIN
        Ctrl->>Vac: deleteVaccination(1)
        Ctrl->>Center: increaseSlots(centerId)
        Ctrl->>DB: COMMIT
        Ctrl-->>Client: 200 Vaccination cancelled
    end
```

---

## 9. End-to-End Training Story

Rahul registers with PIN Code `500072`, logs in, and books a vaccination.

```text
Rahul fills the React form
        ↓
POST /api/users/register
        ↓
User row saved in MySQL (plain-text password for training only)
        ↓
POST /api/users/login
        ↓
React stores user id = 1 in state / localStorage
        ↓
POST /api/vaccinations/book { userId: 1, vaccinationDate: "2026-09-20" }
        ↓
Backend reads PIN Code 500072
        ↓
Finds Apollo Vaccination Center (50 slots)
        ↓
Creates vaccination row and reduces slots to 49
        ↓
React shows booking success and assigned center
```
