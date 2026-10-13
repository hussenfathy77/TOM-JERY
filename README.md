# Nursery Management System - Backend & REST API

Standalone Backend Service built with **Node.js, Express, PostgreSQL, and Prisma ORM**.
This service exposes a REST API designed to connect seamlessly with any frontend application (React, Next.js, Vue, Angular, Mobile Apps, etc.).

---

## 🚀 Quick Start (تشغيل الباك إند بشكل مستقل)

### 1. Requirements
- Node.js (v18+)
- PostgreSQL installed and running

### 2. Environment Variables (.env)
Create a `.env` file in the `backend/` directory or update existing one:
```env
PORT=5000
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/school_management?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
CORS_ORIGIN="*"
```

### 3. Install Dependencies
```bash
cd backend
npm install
```

### 4. Database Setup & Migrations
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed demo data (Admin: admin@school.com / admin123)
npm run prisma:seed
```

### 5. Start Backend Server
```bash
# Development (with nodemon auto-reload)
npm run dev

# Production
npm start
```
The server will be running at `http://localhost:5000`.
- Health Check: `http://localhost:5000/api/health`
- Server Status: `http://localhost:5000/`

---

## 📡 API Endpoints Overview (ملخص الـ Endpoints)

Base URL: `http://localhost:5000/api`

### 1. Public Endpoints
- `GET /health` - Health check status
- `POST /auth/login` - Login with `{ email, password }`
- `POST /auth/register` - Register parent account `{ name, email, password }`
- `GET /programs` - List nursery programs & features
- `GET /announcements` - Public nursery announcements

### 2. Authenticated Requests
All protected endpoints require an `Authorization` header:
```http
Authorization: Bearer <your_jwt_token>
```

- **Admin Routes (`/api/admin/...`):**
  - `GET /api/admin/users` - List users
  - `POST /api/admin/users` - Create teacher or parent
  - `PUT /api/admin/users/:id` - Edit user
  - `PATCH /api/admin/users/:id/status` - Activate / deactivate
  - `DELETE /api/admin/users/:id` - Delete user
  - `GET /api/admin/children` - List all children
  - `POST /api/admin/children` - Add child
  - `PUT /api/admin/children/:id` - Edit child
  - `DELETE /api/admin/children/:id` - Delete child

- **Teacher Routes (`/api/teacher/...`):**
  - `GET /api/teacher/children` - List classroom children
  - `POST /api/attendance` - Record attendance

- **Parent Routes (`/api/parent/...`):**
  - `GET /api/parent/children` - List logged-in parent's children

> 📖 **Full API Reference**: Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for full request/response schemas and testing examples.

---

## 🌐 Connecting from Any Frontend (الربط مع أي فرونت إند)

1. **Set Base URL in your frontend:**
   ```javascript
   const API_BASE_URL = "http://localhost:5000/api";
   ```
2. **CORS:**
   CORS is preconfigured to accept requests from any origin by default (`*`), or you can specify your frontend origin in `.env` (`CORS_ORIGIN=http://localhost:3000`).
3. **Send JWT Tokens:**
   Store the token returned from `/api/auth/login` and pass it in:
   ```javascript
   headers: {
     'Authorization': `Bearer ${token}`,
     'Content-Type': 'application/json'
   }
   ```
"# TOM-JERY" 
