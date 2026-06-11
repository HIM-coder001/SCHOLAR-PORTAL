# ScholarHub — Academic Portal

ScholarHub is a high-fidelity, database-driven academic portal designed for college students to manage their studies, access a comprehensive past papers archive, organize study notes, and collaborate with an AI research assistant.

The project integrates a modern React frontend utilizing Tailwind CSS v4 and Lucide React icons with a Node.js/Express backend connected to a MongoDB database.

---

## Key Features

1. ** Secure User Authentication & Protected Routes**:
   - Register email accounts, select your academic institution, and declare your major.
   - Secure token-based user login powered by JWT encryption and bcrypt password hashing.
   - Protected client-side routing; unauthorized portal access automatically intercepts and redirects users to sign in.
2. ** Past Papers Archive & Search Engine**:
   - Access comprehensive syllabus resource records fetched dynamically from MongoDB.
   - Full-text search filters across module codes, course titles, and instructors.
   - Interactive dropdown filters for department, course, exam year, and semester terms.
   - Automated download counter tracking incremented in the database.
3. ** Scholar Assistant (AI Study Assistant)**:
   - Persistent chat session logs saved in MongoDB.
   - Interactive suggestions panel with prompt pre-loads.
   - Contextual mock AI responses answering questions about file uploads and licensing.
   - Message limit counter and progress stats tracking.
4. **Quick Notes Pad**:
   - Create, retrieve, and delete study notes dynamically from the main dashboard.
   - Full note content persists in MongoDB and links directly to the authenticated user profile.
5. ** Premium Visual Polish**:
   - High-contrast typography featuring Outfit and Poppins fonts.
   - Sleek deep green brand color theme (`#004D40`) with balanced contrast, visual alerts, and hover effects.
   - Real-time animated checking toast notifications validating downloads, notes, and bookmark actions.

---

## Technology Stack

### Frontend (Client)
- **Core Framework**: React 19 & React Router DOM v7
- **Styling**: Tailwind CSS v4 (configured via direct CSS directives)
- **Icons**: Lucide React
- **Build Tool**: Vite v8

### Backend (Server)
- **Runtime**: Node.js & Express
- **Database**: MongoDB & Mongoose
- **Security**: JWT (jsonwebtoken), bcryptjs, and CORS policies
- **Configuration**: dotenv

---

## Directory Structure

```text
LIBRARY PORTAL/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── assets/         # Images, mockup graphics, and icons
│   │   ├── components/     # Shared components (Sidebar, Footer, FilterSelect, PaperCard, FeaturedCard, TopBar)
│   │   ├── pages/          # View screens (Landing, Login, Register, Dashboard, PastPapers, AIAssistant)
│   │   ├── App.jsx         # Client-side router & authentication guards
│   │   └── main.jsx        # App entry point
│   ├── vite.config.js      # Vite dev server configuration & API Proxy mapping
│   └── package.json
│
├── server/                 # Express Backend API
│   ├── middleware/         # Authorization check handlers (JWT validator)
│   ├── models/             # Mongoose MongoDB schemas (User, Paper, ChatSession, ChatMessage, Note)
│   ├── routes/             # Controller route endpoints (auth, papers, chats, notes)
│   ├── index.js            # Node startup entry point & database seeder script
│   └── package.json
│
├── .gitignore              # Workspace repository ignore list
└── README.md               # Main project description & setup guide
```

---

## Local Setup & Installation

### Prerequisites
- Install [Node.js](https://nodejs.org/) (v18 or higher recommended).
- Ensure [MongoDB](https://www.mongodb.com/try/download/community) is installed and running on your local machine (`mongodb://127.0.0.1:27017`).

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd "LIBRARY PORTAL"
```

### Step 2: Configure Backend Server
1. Navigate to the `server/` directory and install dependencies:
   ```bash
   cd server
   npm install
   ```
2. Create a `.env` file in the `server/` directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/scholarhub
   JWT_SECRET=scholarhubsecretjwtkeyfortestingpurposes123
   ```
3. Start the backend API server. On start, the database seeder will automatically insert mock past papers into your MongoDB if the collection is empty:
   ```bash
   npm run dev
   # or
   node index.js
   ```

### Step 3: Configure Frontend Client
1. Open a new terminal window, navigate to the `client/` directory, and install dependencies:
   ```bash
   cd client
   npm install
   ```
2. Run the Vite development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to `http://localhost:5173`.

---

## MongoDB Database Schemas Reference

### User Schema (`models/User.js`)
- `fullName` (String, required): Full name of the student.
- `email` (String, required, unique): University email address.
- `password` (String, required): Bcrypt hashed password string.
- `institution` (String): Declared college institution.
- `course` (String): Student's course major.

### Paper Schema (`models/Paper.js`)
- `title` (String, required): Past paper course title.
- `module` (String, required): Module code identifiers.
- `instructor` (String, required): Class instructor/professor.
- `semester` (String, required): Semester term.
- `downloads` (Number): Global download counts metrics.
- `views` (Number): View statistics.
- `isFeatured` (Boolean): Defines if the paper is displayed as a large wide card.

### Note Schema (`models/Note.js`)
- `userId` (ObjectId, ref User): Owner student profile reference.
- `title` (String, required): Title of the quick note.
- `content` (String): Content notes description.
- `createdAt` (Date): Creation timestamp.
