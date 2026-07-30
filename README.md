# 🌿 GreenAura – Premium Indoor Plants E-Commerce

A modern, full-stack indoor plant e-commerce platform built with **React, TypeScript, Vite, Tailwind CSS, and Lovable Cloud (Postgres + Authentication + Edge Functions)**.

GreenAura delivers a premium online shopping experience with secure authentication, real-time inventory management, AI-powered plant recommendations, wishlist, shopping cart, order management, and an admin dashboard.

---

## 🚀 Live Demo

**Application:** https://greenaura-bloom.lovable.app

---

## ✨ Features

### 🌱 Customer Features

- User Authentication (Email/Password & Google OAuth)
- Browse premium indoor plants
- Search and filter by category
- Product detail pages with complete care information
- Wishlist management
- Shopping cart with quantity controls
- Secure checkout
- Order history
- AI Plant Recommendation Assistant
- Responsive design across all devices

### 🛠 Admin Features

- Product management
- Inventory management
- View customer orders
- View contact messages
- Role-based access control

---

# 🖥 Tech Stack

| Category | Technologies |
|----------|--------------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui |
| Animations | Framer Motion |
| Backend | Lovable Cloud |
| Database | PostgreSQL |
| Authentication | Supabase Auth (Email & Google OAuth) |
| API | Edge Functions |
| State Management | TanStack Query |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Testing | Vitest, Playwright |

---

# 📌 Core Functionalities

- Secure Authentication
- Dynamic Product Catalog
- Plant Care Guide
- Wishlist System
- Shopping Cart
- Atomic Checkout
- Order History
- AI Plant Concierge
- Contact Form
- Admin Dashboard
- Inventory Tracking
- Responsive UI
- SEO Optimized

---

# 📂 Project Structure

```text
GreenAura/
│
├── public/
│
├── src/
│   ├── components/
│   ├── hooks/
│   ├── integrations/
│   ├── lib/
│   ├── pages/
│   ├── App.tsx
│   └── main.tsx
│
├── supabase/
│   ├── functions/
│   └── migrations/
│
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

---

# 🗄 Database

The application uses PostgreSQL with Row Level Security (RLS).

Main Tables:

- Profiles
- User Roles
- Products
- Wishlist
- Cart Items
- Orders
- Order Items
- Contact Messages

---

# 🔒 Security

- Row Level Security (RLS)
- Role-Based Authorization
- Protected Admin Routes
- Secure Checkout Transaction
- Input Validation using Zod
- Edge Function Validation

---

# ⚙ Installation

## Clone the Repository

```bash
git clone https://github.com/your-username/GreenAura.git
```

```bash
cd GreenAura
```

## Install Dependencies

Using Bun

```bash
bun install
```

or using npm

```bash
npm install
```

---

# ▶ Run the Application

Using Bun

```bash
bun run dev
```

Using npm

```bash
npm run dev
```

The application will be available at:

```
http://localhost:8080
```

---

# 🧪 Testing

Unit Tests

```bash
bun run test
```

End-to-End Tests

```bash
bun run test:e2e
```

---

# 🌍 Environment Variables

Create a `.env` file.

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL

VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_ANON_KEY
```

> Never commit your `.env` file or service role keys.

---

# 🚀 Future Enhancements

- Stripe Payment Gateway
- Email Notifications
- Product Reviews & Ratings
- Guest Checkout
- Advanced Product Filters
- Progressive Web App (PWA)
- Multi-language Support
- Dark Mode
- Shipping Tracking
- AI Care Reminder

---

# 💡 Highlights

- Modern UI/UX
- Production-ready Architecture
- Secure Authentication
- Real-time Inventory
- AI-powered Recommendations
- Responsive Design
- Serverless Backend
- Clean Code Structure

---

# 👨‍💻 Author

**Madhumithra R**

- LinkedIn: https://www.linkedin.com/in/madhumithra-r
- GitHub: https://github.com/Madhumithra-R

---

# 📄 License

This project is intended for learning and portfolio purposes.

---

⭐ If you like this project, consider giving it a star on GitHub!
