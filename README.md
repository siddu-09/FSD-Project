# BookNest — Full-Stack Bookstore Application

BookNest is a premium, full-stack e-commerce platform for book lovers. It features a rich catalog, seamless authentication, and a responsive shopping experience.

## 🚀 Live Demo
**Frontend (Vercel):** [https://fsd-project-alpha-hazel.vercel.app/books](https://fsd-project-alpha-hazel.vercel.app/books)

---

## 🛠️ Technology Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express
- **Database**: PostgreSQL (via Prisma ORM)
- **Deployment**: Render (Backend & DB), Vercel (Frontend)

---

## 📁 Project Structure

```text
BookNest/
├── client/          # React / Vite frontend
├── server/          # Node.js / Express backend
└── render.yaml      # Render blueprint configuration
```

---

## 🔧 Local Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd BookNest
```

### 2. Backend Setup
```bash
cd server
npm install
# Configure your .env file with DATABASE_URL and JWT_SECRET
npx prisma db push
npm run seed
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
# Configure .env with VITE_API_URL
npm run dev
```

---

## ✨ Features
- [x] Dynamic Book Catalog
- [x] Real-time Search and Filtering
- [x] User Authentication (JWT)
- [x] Persistent Shopping Cart
- [x] Orders Management
- [x] Responsive Premium UI
