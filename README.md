# Job Application Tracker

A clean, modern, and minimal full-stack web application designed for students and job seekers to track, organize, and manage their recruitment pipelines in one centralized dashboard.

Built with **React**, **Node.js/Express**, and **Supabase (PostgreSQL & Auth)**. Designed as a portfolio project showcasing clean code architecture, robust authentication, database Row Level Security (RLS), and a professional SaaS user experience without overengineered frameworks.

---

## 🌟 Key Features

* **Secure Authentication**: User registration and login powered by **Supabase Auth** with persistent session storage, error alerts, and password validation.
* **Real-Time Dynamic Metrics**: Dashboard overview cards displaying dynamic counts for:
  * Total Applications
  * Applied
  * Interview
  * Offers
* **Full CRUD Operations**:
  * **Create**: Intuitive form to log applications with company, role, type, posting URL, date, status, and custom notes.
  * **Read**: Clean tabular display on desktop and responsive card presentation on mobile.
  * **Update**: Quick modal to edit application status and details.
  * **Delete**: Safe deletion protected by a confirmation dialog.
* **Search & Filter**:
  * Real-time search by company name or job role.
  * Status filtering (`Applied`, `Assessment`, `Interview`, `Offer`, `Rejected`).
  * Automatic sorting with newest applications first.
* **Strict Backend Security**:
  * Supabase JWT verification on all protected endpoints.
  * Enforced server-side user ownership (`req.user.id`).
  * Row Level Security (RLS) on PostgreSQL so users can only ever access their own data.
* **Professional UI/UX**:
  * Clean, minimal, non-distracting SaaS aesthetic using pure CSS.
  * Soft gray, navy blue, white, and muted blue palette.
  * Fully responsive across desktop, tablet, and mobile devices.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18 (JavaScript) | Functional components with hooks (`useState`, `useEffect`, `useMemo`, `useContext`) |
| **Styling** | Standard CSS3 | Custom design system with CSS variables, responsive grids, and zero CSS frameworks |
| **Frontend Tooling** | Vite | Fast local development and production bundling |
| **Backend** | Node.js & Express.js | REST API with modular controllers, routes, and middleware |
| **Database** | Supabase PostgreSQL | Relational database with automated timestamps and foreign key constraints |
| **Authentication** | Supabase Auth | Secure user management, token issuance, and password hashing |
| **Security** | Row Level Security (RLS) | Database-level authorization rules isolating user records |

---

## 📁 Project Structure

```text
job-application-tracker/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ApplicationCard.jsx     # Responsive card view for mobile screens
│   │   │   ├── ApplicationTable.jsx    # Tabular layout for desktop
│   │   │   ├── ConfirmModal.jsx        # Deletion confirmation dialog
│   │   │   ├── EditModal.jsx           # Modal dialog to edit application details
│   │   │   ├── Navbar.jsx              # Dashboard header with user greeting
│   │   │   ├── ProtectedRoute.jsx      # Route guard requiring valid session
│   │   │   ├── Sidebar.jsx             # Navigation sidebar with responsive drawer
│   │   │   ├── StatCard.jsx            # Metric summary card
│   │   │   └── StatusBadge.jsx         # Accessible, muted status indicator
│   │   ├── hooks/
│   │   │   └── useAuth.jsx             # AuthContext & custom auth hook
│   │   ├── pages/
│   │   │   ├── AddApplication.jsx      # Form to submit a new application
│   │   │   ├── Applications.jsx        # My Applications view with search & filter
│   │   │   ├── Dashboard.jsx           # Main overview with metrics & recent apps
│   │   │   ├── Login.jsx               # Login page
│   │   │   └── Register.jsx            # Registration page
│   │   ├── services/
│   │   │   ├── api.js                  # Backend API client with Bearer token injection
│   │   │   └── supabaseClient.js       # Frontend Supabase initialization
│   │   ├── styles/
│   │   │   ├── applications.css        # Search, filters, and responsive cards
│   │   │   ├── auth.css                # Login and Register layouts
│   │   │   ├── dashboard.css           # Metric grid and recent table styling
│   │   │   ├── form.css                # Add/Edit form layout
│   │   │   ├── index.css               # Global tokens, resets, typography, badges
│   │   │   ├── layout.css              # App shell, sidebar, and header
│   │   │   └── modal.css               # Dialog overlays and action footers
│   │   ├── App.jsx                     # Router and route configurations
│   │   └── main.jsx                    # Application entry point
│   ├── .env.example                    # Sample frontend environment file
│   ├── index.html                      # HTML document shell
│   ├── package.json                    # Frontend dependencies
│   └── vite.config.js                  # Vite configuration
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── applicationController.js # Input validation and database operations
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js        # Supabase Bearer token verification
│   │   │   └── errorHandler.js          # Centralized error formatting
│   │   ├── routes/
│   │   │   └── applicationRoutes.js     # Protected REST endpoints
│   │   ├── services/
│   │   │   └── supabaseClient.js        # Backend Supabase client
│   │   └── server.js                    # Express server initialization
│   ├── .env.example                     # Sample backend environment file
│   └── package.json                     # Backend dependencies
│
├── supabase/
│   └── schema.sql                       # PostgreSQL table definition and RLS policies
│
├── .gitignore                           # Git exclusions (node_modules, .env, dist)
├── package.json                         # Root helper scripts
└── README.md                            # Project documentation
```

---

## 📋 Prerequisites

Before getting started, make sure you have:

* **Node.js** (v18.0.0 or higher) installed on your machine.
* **npm** (v9.0.0 or higher) installed with Node.js.
* A free account on [Supabase](https://supabase.com).

---

## 🚀 Setup and Installation

Follow these step-by-step instructions to get the application running on your local machine.

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/job-application-tracker.git
cd job-application-tracker
```

---

### Step 2: Configure Supabase Database & Auth

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) and click **"New Project"**.
2. Give your project a name (e.g., `job-application-tracker`), set a secure database password, and select your region.
3. Once the project finishes provisioning:
   * In the left sidebar, click on **SQL Editor**.
   * Click **"New query"**.
   * Copy the entire contents of [`supabase/schema.sql`](./supabase/schema.sql) and paste it into the editor.
   * Click **"Run"** (or press `Ctrl+Enter`).
   * This creates the `applications` table, constraints, indices, updated_at trigger, and Row Level Security policies.
4. Retrieve your API credentials:
   * In the Supabase sidebar, go to **Project Settings** (gear icon) -> **API**.
   * Copy your **Project URL**.
   * Copy your **anon / public key** (used for frontend).
   * Copy your **service_role key** (used for backend only).

---

### Step 3: Configure the Backend

1. Navigate to the `backend` directory:

   ```bash
   cd backend
   ```

2. Install the backend dependencies:

   ```bash
   npm install
   ```

3. Create your `.env` file from the example:

   ```bash
   # Windows PowerShell
   Copy-Item .env.example .env

   # Mac / Linux
   cp .env.example .env
   ```

4. Open `backend/.env` and fill in your Supabase credentials:

   ```env
   PORT=5000
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here
   ```

5. Start the backend development server:

   ```bash
   npm run dev
   ```

   The backend will be running at `http://localhost:5000`. You can test health by visiting `http://localhost:5000/api/health`.

---

### Step 4: Configure the Frontend

1. Open a new terminal window and navigate to the `frontend` directory:

   ```bash
   cd frontend
   ```

2. Install the frontend dependencies:

   ```bash
   npm install
   ```

3. Create your `.env` file from the example:

   ```bash
   # Windows PowerShell
   Copy-Item .env.example .env

   # Mac / Linux
   cp .env.example .env
   ```

4. Open `frontend/.env` and fill in your Supabase project credentials:

   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-or-publishable-key-here
   VITE_API_URL=http://localhost:5000/api
   ```

5. Start the frontend development server:

   ```bash
   npm run dev
   ```

   Open `http://localhost:5173` in your browser.

---

## 💻 Convenience Root Commands

From the root directory of the project, you can also run:

| Command | Action |
| :--- | :--- |
| `npm run install:all` | Installs dependencies for both `backend` and `frontend` |
| `npm run backend:dev` | Starts the Express server with live reload |
| `npm run frontend` | Starts the Vite React frontend development server |
| `npm run build:frontend` | Generates an optimized production build of the frontend |

---

## 🔒 API Endpoints & Security

All `/api/applications` endpoints require an `Authorization: Bearer <token>` header containing a valid Supabase JWT.

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/health` | Health check endpoint | No |
| `GET` | `/api/applications` | Retrieve all applications for the authenticated user | **Yes** |
| `GET` | `/api/applications/:id` | Retrieve a single application by ID | **Yes** |
| `POST` | `/api/applications` | Create a new application (enforces `user_id` server-side) | **Yes** |
| `PUT` | `/api/applications/:id` | Update an existing application belonging to the user | **Yes** |
| `DELETE` | `/api/applications/:id` | Delete an application belonging to the user | **Yes** |

---

## 📸 Screenshots

*(Replace with screenshots of your running application)*

### Dashboard Overview
> Dynamic summary cards, greeting, and recent applications table.
```
+--------------------------------------------------------------------------+
|  Job Tracker   |  Dashboard Overview                    [+ Add App]      |
|----------------+---------------------------------------------------------|
|  [Total: 12]       [Applied: 6]       [Interview: 3]       [Offers: 2]   |
|--------------------------------------------------------------------------|
|  Recent Applications                                                     |
|  Company     Role                 Date           Status       Actions    |
|  Stripe      Frontend Engineer    Oct 24, 2026   Interview    Edit Delete|
|  Google      Software Intern      Oct 20, 2026   Assessment   Edit Delete|
+--------------------------------------------------------------------------+
```

### Add Job Application
> Clean form with client-side and server-side validation.

### My Applications (Filtered & Responsive)
> Search by company or role, filter by status, and responsive card presentation.

---

## 🔮 Future Improvements

* [ ] Export applications to CSV or JSON format.
* [ ] Email notification reminders for upcoming interview dates.
* [ ] Kanban board drag-and-drop view for application stages.
* [ ] Resume version tracking linked per job application.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
