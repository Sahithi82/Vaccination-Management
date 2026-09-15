# Database Design

## 1. Database

Name: `vaccination_db`

Create and inspect it with **MySQL Workbench 8**.

Run `database/schema.sql` to create the database, tables, and sample data.

---

## 2. ER View

```text
┌──────────────────────┐       ┌────────────────────────┐       ┌──────────────────────┐
│        users         │       │      vaccinations      │       │       centers        │
├──────────────────────┤       ├────────────────────────┤       ├──────────────────────┤
│ PK id                │◄──────│ FK user_id             │       │ PK id                │
│    name              │       │ FK center_id           │──────►│    name              │
│    email             │       │    vaccine_name        │       │    address           │
│    password          │       │    vaccination_date    │       │    city              │
│    phone             │       │    status              │       │    state             │
│    pin_code          │       │    created_at          │       │    pin_code          │
│    created_at        │       │    updated_at          │       │    contact_number    │
│    updated_at        │       └────────────────────────┘       │    vaccine_name      │
└──────────────────────┘                                        │    available_slots   │
                                                                │    status            │
                                                                │    created_at        │
                                                                │    updated_at        │
                                                                └──────────────────────┘
```

Relationships:

- One user can have many vaccinations
- One center can have many vaccinations
- `vaccinations` is the link table

---

## 3. Why These Tables

| Table | Why it exists |
|-------|----------------|
| `users` | People who register and book |
| `centers` | Places that give vaccines |
| `vaccinations` | A booking that joins one user to one center |

Admin is not a database table. Admin login is hardcoded.

---

## 4. Table Details

### 4.1 `centers`

| Column | Type | Notes |
|--------|------|-------|
| id | INT PK AUTO_INCREMENT | Center ID |
| name | VARCHAR(100) | Required |
| address | VARCHAR(255) | Required |
| city | VARCHAR(50) | Required |
| state | VARCHAR(50) | Required |
| pin_code | VARCHAR(10) | Used to match users |
| contact_number | VARCHAR(15) | Required |
| vaccine_name | VARCHAR(50) | Example: Covishield |
| available_slots | INT | Must not be negative |
| status | VARCHAR(20) | ACTIVE or INACTIVE |
| created_at | DATETIME | Auto filled |
| updated_at | DATETIME | Auto updated |

### 4.2 `users`

| Column | Type | Notes |
|--------|------|-------|
| id | INT PK AUTO_INCREMENT | User ID |
| name | VARCHAR(100) | Required |
| email | VARCHAR(100) UNIQUE | Used for login |
| password | VARCHAR(100) | Plain text for this training project only |
| phone | VARCHAR(15) | Required |
| pin_code | VARCHAR(10) | Used to find a center |
| created_at | DATETIME | Auto filled |
| updated_at | DATETIME | Auto updated |

**Important:** The password column stores plain text only for educational simplification. This is not suitable for production applications.

### 4.3 `vaccinations`

| Column | Type | Notes |
|--------|------|-------|
| id | INT PK AUTO_INCREMENT | Booking ID |
| user_id | INT FK | References `users.id` |
| center_id | INT FK | References `centers.id` |
| vaccine_name | VARCHAR(50) | Copied from the assigned center |
| vaccination_date | DATE | Date chosen while booking |
| status | VARCHAR(20) | BOOKED, COMPLETED, CANCELLED |
| created_at | DATETIME | Auto filled |
| updated_at | DATETIME | Auto updated |

---

## 5. Keys

| Key | Table | Purpose |
|-----|-------|---------|
| Primary key | `users.id` | Identify one user |
| Primary key | `centers.id` | Identify one center |
| Primary key | `vaccinations.id` | Identify one booking |
| Unique key | `users.email` | Prevent duplicate registration |
| Foreign key | `vaccinations.user_id` | Booking belongs to a user |
| Foreign key | `vaccinations.center_id` | Booking belongs to a center |

`pin_code` is not a foreign key. It is a search field used by business logic.

---

## 6. PIN Code Allocation

1. User Rahul registers with `pinCode = 500072`
2. That value is stored in `users.pin_code`
3. On booking, the backend runs:

```sql
SELECT * FROM centers
WHERE pin_code = '500072'
  AND status = 'ACTIVE'
  AND available_slots > 0
ORDER BY available_slots DESC
```

4. The first matching center is assigned
5. A row is inserted into `vaccinations`
6. `available_slots` is reduced by 1

---

## 7. Sample Data

### Centers

| id | name | pin_code | slots | status |
|----|------|----------|-------|--------|
| 1 | Apollo Vaccination Center | 500072 | 50 | ACTIVE |
| 2 | City Care Center | 500072 | 20 | ACTIVE |
| 3 | Sunshine Clinic | 500034 | 15 | ACTIVE |
| 4 | Closed Camp Center | 500002 | 10 | INACTIVE |

### Users

| id | name | email | password | pin_code |
|----|------|-------|----------|----------|
| 1 | Rahul | rahul@gmail.com | Rahul@123 | 500072 |

If Rahul books a vaccination, Apollo is chosen first because it has more slots.

---

## 8. How to Inspect Data in MySQL Workbench 8

```sql
USE vaccination_db;

SELECT * FROM users;
SELECT * FROM centers;
SELECT * FROM vaccinations;

SELECT u.name, c.name AS center_name, v.vaccination_date, v.status
FROM vaccinations v
JOIN users u ON u.id = v.user_id
JOIN centers c ON c.id = v.center_id;
```
