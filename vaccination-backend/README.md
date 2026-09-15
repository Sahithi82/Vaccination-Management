# Vaccination Center Backend

Beginner-level training project for learning REST APIs with **Express** and **MySQL**.

This project teaches:

- React API integration (backend ready for a React frontend)
- REST API concepts
- Express routes
- Controllers
- MySQL queries
- CRUD operations
- Request body
- Path parameters
- Query parameters
- CORS
- Basic login / registration flow
- Database relationships

It is **not** a production application.

---

## Important Security Note

**Plain-text passwords are used ONLY for educational simplification and are NOT suitable for production applications.**

This training project stores user passwords directly in MySQL and compares them as plain text during login.

Do **not** use this approach in a real application.

This project does **not** use:

- JWT
- jsonwebtoken
- bcrypt
- Password hashing
- Password encryption / decryption
- OAuth
- Sessions
- Refresh tokens
- Authentication middleware

Admin credentials are hardcoded. User login only compares the request email/password with the database record.

The frontend or Postman can call the login API first, then call the other APIs. The React frontend can keep the logged-in user in React state or `localStorage`.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Node.js + Express | REST API server |
| MySQL Workbench 8 | Create and inspect the database |
| mysql2 | Connect Express to MySQL 8 |
| cors | Allow the React frontend to call this API |
| dotenv | Load `.env` values |
| nodemon | Restart the server during development |

---

## Project Structure

```text
vaccination-backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── adminController.js
│   ├── userController.js
│   └── vaccinationController.js
│
├── models/
│   ├── userModel.js
│   ├── centerModel.js
│   └── vaccinationModel.js
│
├── routes/
│   ├── adminRoutes.js
│   ├── userRoutes.js
│   └── vaccinationRoutes.js
│
├── database/
│   └── schema.sql
│
├── docs/
│   ├── HLD.md
│   ├── LLD.md
│   ├── DB_DESIGN.md
│   ├── API_DOCUMENTATION.md
│   └── SEQUENCE_DIAGRAMS.md
│
├── postman/
│   └── Vaccination-Center-API.postman_collection.json
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```

---

## How a Request Travels

```text
React / Postman
      ↓
   server.js
      ↓
    routes
      ↓
  controllers
      ↓
    models
      ↓
    MySQL
```

---

## Setup

### 1. Install Node.js

Install Node.js LTS from [https://nodejs.org](https://nodejs.org).

### 2. Create the MySQL database

1. Open **MySQL Workbench 8**.
2. Connect to your local MySQL server.
3. Open `database/schema.sql`.
4. Run the full script.

This creates:

- database `vaccination_db`
- tables `centers`, `users`, `vaccinations`
- sample centers
- sample user Rahul

### 3. Configure environment variables

Copy `.env.example` to `.env` if needed, then set your MySQL password:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=vaccination_db
```

### 4. Install packages

```bash
cd vaccination-backend
npm install
```

### 5. Start the server

Development:

```bash
npm run dev
```

Normal start:

```bash
npm start
```

The API runs at:

```text
http://localhost:5000
```

Open `http://localhost:5000` in a browser. You should see:

```json
{
  "success": true,
  "message": "Vaccination Center API is running"
}
```

---

## CORS

CORS is enabled in `server.js`:

```js
const cors = require("cors");
app.use(cors());
```

Requests from any origin are allowed for this training project.

A React app can call:

```text
http://localhost:5000
```

---

## Sample Login Credentials

### Admin

These values are hardcoded in `adminController.js`.

```text
Username: admin
Password: Nimda
```

```http
POST http://localhost:5000/api/admin/login
```

```json
{
  "username": "admin",
  "password": "Nimda"
}
```

Success:

```json
{
  "success": true,
  "message": "Admin login successful"
}
```

Failure:

```json
{
  "success": false,
  "message": "Invalid admin credentials"
}
```

### User

Sample user from `schema.sql`:

```text
Email: rahul@gmail.com
Password: Rahul@123
```

```http
POST http://localhost:5000/api/users/login
```

```json
{
  "email": "rahul@gmail.com",
  "password": "Rahul@123"
}
```

Success returns basic user information. No JWT is generated.

---

## Main Learning Flows

### Register a user

```http
POST http://localhost:5000/api/users/register
```

```json
{
  "name": "Rahul",
  "email": "rahul@gmail.com",
  "password": "Rahul@123",
  "phone": "9876543210",
  "pinCode": "500072"
}
```

The password is stored in MySQL as plain text for this exercise only.

### Admin creates a vaccination center

```http
POST http://localhost:5000/api/admin/centers
```

### User books a vaccination

The backend reads the user's PIN Code, finds an ACTIVE center with available slots, books the slot, and stores the relationship.

```http
POST http://localhost:5000/api/vaccinations/book
```

```json
{
  "userId": 1,
  "vaccinationDate": "2026-09-20"
}
```

### Search centers with a query parameter

```http
GET http://localhost:5000/api/vaccinations/centers?pinCode=500072
```

### Get one user with a path parameter

```http
GET http://localhost:5000/api/users/1
```

---

## API Groups

| Group | Base path | Purpose |
|-------|-----------|---------|
| Admin | `/api/admin` | Login, center CRUD, view users and bookings |
| Users | `/api/users` | Register, login, view, update |
| Vaccinations | `/api/vaccinations` | View centers, book, update status, cancel |

Full request and response examples are in [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md).

Import [postman/Vaccination-Center-API.postman_collection.json](postman/Vaccination-Center-API.postman_collection.json) into Postman to test every API.

---

## Documentation

| File | What it explains |
|------|------------------|
| [docs/HLD.md](docs/HLD.md) | High level design |
| [docs/LLD.md](docs/LLD.md) | Low level design |
| [docs/DB_DESIGN.md](docs/DB_DESIGN.md) | Tables and relationships |
| [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) | All APIs |
| [docs/SEQUENCE_DIAGRAMS.md](docs/SEQUENCE_DIAGRAMS.md) | Request flows |

---

## PIN Code Allocation Rule

1. User registers with a PIN Code.
2. When the user books a vaccination, the backend reads that PIN Code.
3. It searches ACTIVE centers with the same PIN Code and `available_slots > 0`.
4. If more than one center matches, it picks the center with the most slots.
5. It creates a `vaccinations` row and decreases `available_slots` by 1.
6. If no center is available, the API returns `404`.

Sample PIN Codes from `schema.sql`:

| PIN Code | Result |
|----------|--------|
| `500072` | Apollo or City Care (ACTIVE, has slots) |
| `500034` | Sunshine Clinic |
| `500002` | Center exists but INACTIVE, treated as unavailable |
| `500001` | No center |

---

## Suggested Practice Order

1. Run `schema.sql` in MySQL Workbench 8.
2. Start the server.
3. Test admin login in Postman.
4. Create / update / delete a center.
5. Register and login a user.
6. Search centers by PIN Code.
7. Book a vaccination.
8. Get the booking by ID and by user ID.
9. Cancel a booking and confirm the slot is restored.

---

## License

Training / educational use only.
