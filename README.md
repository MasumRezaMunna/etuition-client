# eTuitionBd — Client

A full-featured **Tuition Management System** built with React, Tailwind CSS, DaisyUI, and Firebase Authentication.

## 🌐 Live URL
[https://etuitionbd.web.app](https://inquisitive-pika-e48834.netlify.app/)

## 🎯 Purpose
eTuitionBd connects students seeking tutors with qualified educators across Bangladesh. Students post tuition requirements, tutors apply, admins moderate, and payments are processed securely via Stripe.

---

## ✨ Features

### Public
- Browse and filter tuition posts (subject, location, class, budget)
- Search with sort (newest, oldest, budget high/low)
- Pagination on tuition listing
- View tutor profiles
- Responsive Navbar & Footer (DaisyUI)

### Authentication
- Firebase Email/Password registration
- Google OAuth login
- Role-based routing (Student / Tutor / Admin)
- JWT token stored in localStorage
- Private routes persist on reload via `onAuthStateChanged`

### Student Dashboard
- Post new tuition (pending admin approval)
- Edit / Delete own tuition posts
- View tutor applications per tuition
- Accept tutor → Stripe payment → auto-approve
- Reject applications
- Payment history
- Profile settings (name, phone, photo)

### Tutor Dashboard
- Apply to tuitions via modal form
- Track application status (pending / approved / rejected)
- Withdraw pending applications
- View ongoing (approved) tuitions
- Revenue history with bar chart (Recharts)

### Admin Dashboard
- User Management: view, edit role/status, delete users
- Tuition Management: approve / reject / reset posts
- Reports & Analytics: KPI cards, bar chart, pie charts, transaction table

### Challenge Features
- 🔍 Search by subject / location
- 🔃 Sort by budget / date
- 📄 Pagination (tuition listing)
- 🔐 JWT role + expiry verification (server-side)
- 🎛️ Advanced filter: class, subject, location, budget range

---

## 📦 Packages Used

| Package | Purpose |
|---|---|
| `react-router-dom` | Client-side routing |
| `firebase` | Auth (email + Google) |
| `axios` | HTTP requests with JWT interceptor |
| `framer-motion` | Page & section animations |
| `@stripe/react-stripe-js` | Stripe card payment UI |
| `@stripe/stripe-js` | Stripe.js loader |
| `react-hot-toast` | Toast notifications |
| `react-icons` | Icons (fa, fa6) |
| `recharts` | Charts for admin dashboard |
| `daisyui` | UI component library |
| `tailwindcss` | Utility-first CSS |

---

## 🚀 Getting Started

```bash
git clone <repo-url>
cd tuition-client
npm install
cp .env.example .env   # fill in your keys
npm run dev
```

### Environment Variables (.env)
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=
```

---

## 🗂️ Project Structure

```
src/
├── config/          # Firebase & Axios setup
├── context/         # AuthContext (Firebase + JWT)
├── components/
│   └── shared/      # Navbar, Footer, layouts, guards
├── pages/
│   ├── Home.jsx
│   ├── Tuitions.jsx
│   ├── TuitionDetails.jsx
│   ├── Tutors.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   └── dashboard/
│       ├── student/
│       ├── tutor/
│       └── admin/
└── App.jsx
```
