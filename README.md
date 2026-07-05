# 🚗 Car Rental System — Frontend

A modern, responsive admin dashboard for managing a car rental business — built with **React**, **Vite**, and **Tailwind CSS**. It handles vehicles, customers, rentals, payments, users, and reporting, with role-based access for Admins and Staff.

**Live Demo:** [car-rental-system-frontend-git-main-cazizs-projects.vercel.app](https://car-rental-system-frontend-git-main-cazizs-projects.vercel.app/login)

**Backend Repo:** [Car-Rental-System (API)](https://github.com/caziiz/Car-Rental-System.git)

---

## ✨ Features

- **Role-based authentication** — separate Admin and Staff permissions via protected routes
- **Dashboard** — live revenue chart, vehicle status breakdown, and key metrics at a glance
- **Vehicle management** — track availability, rental status, and maintenance
- **Customer management** — including blacklist status and license tracking
- **Rental management** — active/returned/overdue tracking with one-click vehicle returns
- **Payment management** — track payments by method and status, mark completed/refunded
- **Reports** — date-filterable reports across rentals, payments, customers, and vehicles, with CSV export and print support
- **Fully responsive** — dedicated table views for desktop and card views for mobile
- **Dark mode support** throughout
- **Reusable component library** — consistent UI across every page (see below)

---

## 🛠️ Tech Stack

| Category         | Tools |
|-------------------|-------|
| Framework          | [React](https://react.dev/) + [Vite](https://vitejs.dev/) |
| Styling            | [Tailwind CSS](https://tailwindcss.com/) |
| Routing            | [React Router](https://reactrouter.com/) |
| HTTP Client        | [Axios](https://axios-http.com/) |
| Charts             | [Recharts](https://recharts.org/) |
| Icons              | [Tabler Icons](https://tabler.io/icons) |
| Deployment         | [Vercel](https://vercel.com/) |

---

## 📁 Project Structure

```
src/
├── components/          # Shared, reusable UI components
│   ├── ActionButtons.jsx    # Edit/Delete button pair used across all tables
│   ├── AddButton.jsx        # Standardized "Add" navigation button
│   ├── AnimatedPage.jsx     # Page transition wrapper
│   ├── Badge.jsx             # Status/category pill labels
│   ├── ConfirmModal.jsx     # Reusable delete-confirmation dialog
│   ├── NotFound.jsx          # 404 page
│   ├── PageHeader.jsx        # Page title/icon header
│   ├── SearchInput.jsx      # Standardized search box
│   ├── Sidebar.jsx           # Main navigation
│   └── StatCard.jsx           # Dashboard/stat summary cards
│
├── Context/
│   └── AuthContext.jsx      # Auth state, current user, role handling
│
├── Pages/               # Main application views
│   ├── Dashboard.jsx
│   ├── Users.jsx
│   ├── Vehicles.jsx
│   ├── Customers.jsx
│   ├── Rentals.jsx
│   ├── Payments.jsx
│   ├── Reports.jsx
│   ├── Login.jsx
│   └── Register.jsx
│
├── Services/            # Add/Edit forms
│   ├── AddEditUser.jsx
│   ├── AddEditVehicle.jsx
│   ├── AddEditCustomer.jsx
│   ├── AddRental.jsx
│   └── AddPayment.jsx
│
├── App.jsx
└── main.jsx
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (comes with Node)
- A running instance of the [Car Rental System API](https://github.com/caziiz/Car-Rental-System.git) (backend)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/caziiz/Car_Rental_System_Frontend.git
   cd Car_Rental_System_Frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root and set your API URL:
   ```env
   VITE_API_CAR_RENTAL=https://your-api-url.com/api
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173` (or whichever port Vite assigns).

### Build for production

```bash
npm run build
```

The optimized build output will be in the `dist/` folder.

---

## 🔐 Roles & Access

| Role  | Access |
|-------|--------|
| **Admin** | Full access — Users, Vehicles, Customers, Rentals, Payments, Reports, Dashboard |
| **Staff** | Vehicles, Customers, Rentals, Payments, Dashboard (limited view) |

---

## ⚠️ Notes for Contributors

This project targets deployment on **Linux-based hosts (Vercel)**, which use a **case-sensitive** file system. Windows/macOS development machines are case-*insensitive*, so a mismatch between an import path and its actual filename (e.g. `PageHeader` vs. `Pageheader.jsx`) can build fine locally but fail on deploy.

If you rename a file to fix casing, a same-name-different-case rename may not be tracked correctly by Git on some setups. To force it:

```bash
git mv src/components/OldName.jsx src/components/OldName_temp.jsx
git mv src/components/OldName_temp.jsx src/components/NewName.jsx
git add -A
git commit -m "Fix file casing"
git push
```

Always double check that filenames on disk exactly match their import statements before deploying.

---

## 📦 Deployment

This project is configured for deployment on **Vercel**. Pushing to `main` triggers an automatic production build. Ensure your `VITE_API_CAR_RENTAL` environment variable is also set in your Vercel project settings, not just locally.

---

## 🙌 Acknowledgments

Built as a full-stack car rental management solution, with a focus on clean, reusable UI components and a consistent design system across every page.