# Vaccination Management System

A full-stack web application for managing vaccination centres and vaccination-related information. The application consists of a React frontend and a Node.js/Express backend connected to a MySQL database.

## 🚀 Technologies Used

### Frontend

* React.js
* JavaScript
* HTML
* CSS
* Axios

### Backend

* Node.js
* Express.js
* REST APIs

### Database

* MySQL

### Development Tools

* Git
* GitHub
* Postman
* npm

## ✨ Features

### Admin

* Admin login
* Admin dashboard
* Create vaccination centres
* View vaccination centres
* Update vaccination centre details
* Delete vaccination centres
* Retrieve vaccination centre information

### User

* Access vaccination-related information
* View available vaccination centre details

## 📁 Project Structure

```text
Vaccination-Management/
│
├── vaccination-frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── vaccination-backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── server.js
│   ├── package.json
│   └── ...
│
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Sahithi82/Vaccination-Management.git
cd Vaccination-Management
```

### 2. Setup MySQL

Create the required MySQL database and configure the database credentials in the backend environment configuration.

Example:

```text
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database
```

> Do not commit your `.env` file or database passwords to GitHub.

### 3. Setup Backend

```bash
cd vaccination-backend
npm install
npm start
```

The backend runs on:

```text
http://localhost:5000
```

### 4. Setup Frontend

Open another terminal:

```bash
cd vaccination-frontend
npm install
npm start
```

The React application runs on:

```text
http://localhost:3000
```

## 🔐 Admin Login

The application provides an admin login interface. After successful authentication, the administrator can access the dashboard and manage vaccination centre information.

## 🔌 API Operations

The backend provides REST APIs for:

* Admin authentication
* Creating vaccination centres
* Retrieving vaccination centres
* Updating vaccination centre details
* Deleting vaccination centres

## 🎯 Project Objective

The project was developed to gain practical experience in full-stack web development, including React frontend development, REST API integration, Node.js/Express backend development, MySQL database operations, and Git/GitHub version control.

## 👩‍💻 Author

**Sahithi Morampudi**

* GitHub: https://github.com/Sahithi82
* LinkedIn: https://linkedin.com/in/sahithi-morampudi08
* Portfolio: https://sahithi-portfolio-websitee.vercel.app
