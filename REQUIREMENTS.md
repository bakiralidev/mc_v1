# Maze Champions - Project Requirements & Setup Guide

This project consists of a **Next.js Frontend** and a **Node.js Backend** with **Prisma ORM**.

## 1. System Requirements
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **PostgreSQL**: v14 or higher (Database for storage)

## 2. Key Technologies
### Frontend
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js & React Three Fiber (R3F)
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Real-time**: Socket.io
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Auth**: JWT (JSON Web Tokens)

## 3. Environment Variables (.env)
You must create `.env` files in both directories.

### Backend (`/backend/.env`)
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/maze_champions?schema=public"
JWT_SECRET="your_secret_key"
CLIENT_URL="http://localhost:3000"
```

### Frontend (`/frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
NEXT_PUBLIC_SOCKET_URL="http://localhost:5000"
```

## 4. Setup Instructions

### Step 1: Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Step 2: Database Setup
```bash
cd backend
npx prisma generate
npx prisma db push
```

### Step 3: Run the Project
```bash
# Terminal 1 (Backend)
cd backend
node index.js

# Terminal 2 (Frontend)
cd frontend
npm run dev
```

## 5. Deployment Notes
- Ensure all ports (3000, 5000) are open.
- Use a production PostgreSQL instance.
- For production build, use `npm run build` in both directories.
