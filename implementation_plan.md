# Implementation Plan - Digital Farm Management Portal

We will build a fully interactive React frontend for a **Digital Farm Management Portal** based on the Smart India Hackathon problem statement **SIH25006**. The app will feature a role-based dashboard for four distinct user roles, styling powered by Tailwind CSS, navigation powered by React Router, and interactive charts powered by Chart.js.

---

## User Review Required

> [!IMPORTANT]
> **Role Switching and Testing Facilitator**
> To make it easy to evaluate and demo the portal's role-based behavior, we will include a **Demo Role Switcher widget** visible in the application header or as a floating widget. This allows switching between **Admin**, **Farm Manager**, **Farm Worker**, and **Veterinarian** on the fly without logging out and back in every time, though full login/logout flows will also be functional.
> 
> **Mock Credentials for Demo:**
> - **Admin**: `admin@farm.com` / `admin123`
> - **Farm Manager**: `manager@farm.com` / `manager123`
> - **Farm Worker**: `worker@farm.com` / `worker123`
> - **Veterinarian**: `vet@farm.com` / `vet123`

---

## Proposed Architecture & Component Structure

We will structure the application logically in the standard Vite + React project layout:

```
src/
├── components/          # Reusable UI components
│   ├── Common/
│   │   ├── DataTable.jsx     # Sortable, filterable, paginated data table
│   │   ├── Modal.jsx         # Accessible overlay modal
│   │   ├── FormField.jsx     # Pre-styled form fields (inputs, select, etc.)
│   │   ├── StatCard.jsx      # Dashboard key-value displays
│   │   ├── StatusBadge.jsx   # Role/state badges with Tailwind colors
│   │   └── AlertBanner.jsx   # Low-stock/expiry/outbreak warning banner
│   └── Layout/
│       ├── Sidebar.jsx       # Dynamic sidebar filtered by user role
│       └── Header.jsx        # Notification bell + Profile drop-down + Role Switcher
├── context/
│   ├── AuthContext.jsx       # In-memory JWT/auth state, login/logout functions
│   └── FarmDataContext.jsx   # Global mock state for CRUD operations across screens
├── pages/               # Functional pages
│   ├── Login.jsx             # Authentication page with forgot password link
│   ├── Dashboard.jsx         # Summary cards, charts, and activity log (role-scoped)
│   ├── Animals.jsx           # Animal registration, filtering, details & forms
│   ├── Vaccinations.jsx      # Vaccine schedules, dues, and completion tracker
│   ├── DiseaseTracking.jsx   # Isolation states, symptom logging, diagnosis & treatment
│   ├── FeedInventory.jsx     # Feed levels, incoming logs, consumption logs
│   ├── MedicineInventory.jsx # Drug levels, expiration dates, and alerts
│   ├── Biosecurity.jsx       # Visitor registers, checklists, and compliance
│   ├── WorkerManagement.jsx  # Worker list, attendance sheet, and task assignments
│   ├── Reports.jsx           # Farm reports selector, table, and mock CSV/PDF export
│   └── AdminSettings.jsx     # User management and threshold configs
├── routes/
│   └── ProtectedRoute.jsx    # Authentication and role guards
├── App.jsx               # Routes definition and context providers
└── index.css             # Tailwind setup and theme tokens
```

---

## Role-Based Access Control Matrix

The table below describes the visibility of each module based on the logged-in role:

| Module / Page | Admin | Farm Manager | Farm Worker | Veterinarian | Notes / Limitations |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Dashboard** | Yes | Yes | Yes | Yes | Worker/Vet see simplified stats and scoped activity lists |
| **Animal Registration** | Yes | Yes | Yes (Read Only) | Yes (Read Only) | Worker/Vet can view animal list, but only Manager/Admin can Add/Edit |
| **Vaccination** | Yes | Yes | Yes (Logs Only) | Yes | Admin/Manager/Vet can Schedule; Worker can mark tasks as completed |
| **Disease Tracking** | Yes | Yes | Yes (Report Only) | Yes | Worker reports symptoms; Vet/Manager diagnoses & prescribes |
| **Feed Inventory** | Yes | Yes | Yes (Log Consumpt.) | No | Worker logs daily consumption; Manager inputs incoming stock |
| **Medicine Inventory** | Yes | Yes | No | Yes | Vet/Manager edit medicine stock; Worker has no access |
| **Biosecurity** | Yes | Yes | Yes | No | Worker logs logs/checklists; Vet has no access |
| **Worker & Tasks** | Yes | Yes | Yes (Own Tasks) | No | Manager assigns tasks; Worker marks own attendance & tasks |
| **Farm Reports** | Yes | Yes | No | No | Manager/Admin export reports |
| **Admin Settings** | Yes | No | No | No | Admin-only CRUD for users and alert thresholds |

---

## Theme & Design System (Earthy / Green Accent)

We will configure Tailwind CSS to use a warm, tech-farm professional color palette:
- **Primary Color (Emerald/Green-700/800)**: `#047857` and `#065f46` (Earthy green accents)
- **Secondary Color (Amber/Brown-600)**: `#d97706` (For warm accent warnings/stock alerts)
- **Backgrounds**: Slate gray (`#f8fafc`) mixed with clean white panels (`#ffffff`) for a crisp glassmorphism / card-based feel.
- **Typography**: Inter (imported from Google Fonts).
- **Transitions**: Smooth hover states on all interactive elements.

---

## Implementation Phases

### Phase 1: Project Setup & Package Installations
- Scaffold empty Vite-React structure in the root directory.
- Install tailwindcss, react-router-dom, chart.js, react-chartjs-2, axios, and lucide-react.
- Setup `tailwind.config.js` and `index.css`.

### Phase 2: Core Contexts and Layouts
- **AuthContext**: Simulates login, stores user token & role details in state.
- **FarmDataContext**: Simulates a live backend store (in React Context state) initialized with realistic mock datasets. This ensures adding/editing animals, feed logs, or marking vaccinations updates the entire UI immediately.
- **Sidebar & Header**: Dynamic navigation mapping roles to permissions, alert notification system.

### Phase 3: Core Dashboards & First-Priority Screens
- **Login Page**: Responsive clean forms with validation.
- **Dashboard**: Multi-chart display (Feed Usage, Mortality Rate, Worker Attendance, Herd Health) and Stat Cards.
- **Animal Registration**: Table component with filters (shed, breed, health) and registration Modal.
- **Vaccination Management**: Badge-oriented lists, scheduler, completion toggler.

### Phase 4: Intermediate Modules
- **Disease Tracking**: Isolation workflow, Vet treatment forms.
- **Feed & Medicine Inventory**: Stock counters, alert banners for low-stock or expired drugs, transaction logs.
- **Biosecurity & Worker Management**: Compliance checklists, task logs, worker attendance matrix.

### Phase 5: Admin & Report Features
- **Reports Screen**: Filters, mock exports.
- **Admin Panel**: Users CRUD, thresholds modification.

---

## Verification Plan

### Automated Checks
- Run `npm run build` to ensure there are no linter/compiler errors.
- Confirm JavaScript bundle outputs correctly.

### Manual Verification
- Launch local development server (`npm run dev`).
- Log in under each role (`Admin`, `Manager`, `Worker`, `Vet`) and verify that they can see only their allowed sidebar links.
- Perform test actions:
  - Add a new Animal and verify it shows in the Animal List.
  - Complete a due Vaccination and watch the pending count decrease.
  - Log feed consumption and check if low-stock alert is triggered when quantity drops below threshold.
  - Modify alert thresholds in Admin screen and check if warning triggers update.
