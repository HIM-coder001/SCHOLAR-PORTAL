 # ScholarHub — Academic Portal

ScholarHub is a modern, database-driven academic portal designed to help college and university students access learning resources, organize study materials, and improve academic productivity through an intuitive digital platform.

The system combines a React frontend built with Tailwind CSS and a Node.js/Express backend powered by MongoDB, providing a scalable and responsive academic resource management solution.

---

## Overview

Many students struggle to locate organized academic resources, manage study notes, and prepare effectively for examinations.

ScholarHub addresses these challenges by providing a centralized platform where students can:

* Access and download past examination papers.
* Organize personal study notes.
* Search academic resources efficiently.
* Interact with a study assistant for academic support.
* Manage their academic profile in a secure environment.

---

## Key Features

### Secure User Authentication & Protected Routes

* User registration and login functionality.
* Secure JWT-based authentication.
* Password hashing using bcryptjs.
* Protected routes preventing unauthorized access.
* Student profile creation with institution and course information.

### Past Papers Archive & Search Engine

* Dynamic retrieval of past papers from MongoDB.
* Search functionality across module codes, course titles, and instructors.
* Department, course, semester, and year filtering.
* Download tracking and statistics.
* Featured papers section for highlighted resources.

### Scholar Assistant (AI Study Assistant)

* Persistent chat session history.
* Suggested prompts for quick interaction.
* Contextual mock AI responses for academic guidance.
* Chat statistics and message tracking.

> Note: The current AI assistant implementation uses simulated responses for demonstration purposes and serves as a foundation for future integration with advanced AI models.

### Quick Notes Pad

* Create study notes.
* Retrieve personal notes.
* Delete notes when no longer needed.
* Persistent storage linked to authenticated user accounts.

### Modern User Experience

* Responsive design for desktop and mobile devices.
* Tailwind CSS v4 styling.
* Lucide React icons.
* Clean dashboard interface.
* Real-time notifications and user feedback.

---

## Technology Stack

### Frontend (Client)

* React 19
* React Router DOM v7
* Tailwind CSS v4
* Lucide React
* Vite

### Backend (Server)

* Node.js
* Express.js
* MongoDB
* Mongoose
* JSON Web Tokens (JWT)
* bcryptjs
* CORS
* dotenv

---

## Directory Structure

```text
LIBRARY PORTAL/
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
│
├── server/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Local Setup & Installation

### Prerequisites

* Node.js v18 or later
* MongoDB Community Edition or MongoDB Atlas

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd "LIBRARY PORTAL"
```

### Step 2: Configure Backend Server

Navigate to the server directory:

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend server:

```bash
npm run dev
```

or

```bash
node index.js
```

If the database is empty, the application will automatically seed sample past paper records.

### Step 3: Configure Frontend Client

Open a new terminal window:

```bash
cd client
npm install
```

Start the frontend development server:

```bash
npm run dev
```

Visit:

```text
http://localhost:5173
```

---

## Environment Variables

Create a `.env` file inside the `server` directory using the following template:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Important:

* Do not commit your `.env` file to GitHub.
* Add `.env` to your `.gitignore`.
* Never expose database credentials or JWT secrets publicly.

---

## API Modules

### Authentication

* User Registration
* User Login
* JWT Authentication

### Past Papers

* Retrieve Papers
* Search Papers
* Filter Papers
* Track Downloads

### Notes

* Create Notes
* Retrieve Notes
* Delete Notes

### Chat Assistant

* Create Chat Sessions
* Save Messages
* Retrieve Chat History

---

## MongoDB Database Schemas

### User Schema (`models/User.js`)

| Field       | Type   | Description          |
| ----------- | ------ | -------------------- |
| fullName    | String | Student full name    |
| email       | String | Unique email address |
| password    | String | Hashed password      |
| institution | String | Academic institution |
| course      | String | Course or program    |

### Paper Schema (`models/Paper.js`)

| Field      | Type    | Description           |
| ---------- | ------- | --------------------- |
| title      | String  | Course title          |
| module     | String  | Module code           |
| instructor | String  | Lecturer name         |
| semester   | String  | Academic semester     |
| downloads  | Number  | Download count        |
| views      | Number  | View count            |
| isFeatured | Boolean | Featured paper status |

### Note Schema (`models/Note.js`)

| Field     | Type     | Description        |
| --------- | -------- | ------------------ |
| userId    | ObjectId | User reference     |
| title     | String   | Note title         |
| content   | String   | Note content       |
| createdAt | Date     | Creation timestamp |

---

## Security Features

* JWT Authentication
* Password Hashing with bcryptjs
* Protected Routes
* Environment Variable Configuration
* MongoDB Data Validation
* CORS Protection

---

## Future Enhancements

* Real AI model integration
* Speech-to-text academic search
* Lecturer content uploads
* Personalized study recommendations
* Machine Learning analytics
* Mobile application support

---

## License

This project is intended for educational and academic purposes.
