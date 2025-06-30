# Auth API

A robust authentication and user management API built with Node.js and TypeScript. This service provides secure authentication, user registration, password reset, email verification, and session management. Designed for easy integration with modern web and mobile apps.

---

## ✨ Features

- User registration and login
- JWT-based access and refresh tokens
- Email verification and password reset
- Session and token management
- Input validation with Zod
- [Swagger API docs](https://auth-api-kmqg.onrender.com/docs/)

---

## 🚀 Getting Started

### 📦 Prerequisites

- Node.js (v18+)
- npm or yarn
- MongoDB (local or cloud)

### 📥 Installation

```bash
npm install
```

---

## ⚙️ Environment Variables

Config is handled via files in `config/`.

Use a `.env` file or set environment variables directly.

See `config/custom-environment-variables.ts` for required keys like:

```DB_URI = mongodb://deemanth:Atlas%401234@ac-wxsxlpz-shard-00-00.dp7vzqx.mongodb.net:27017,ac-wxsxlpz-shard-00-01.dp7vzqx.mongodb.net:27017,ac-wxsxlpz-shard-00-02.dp7vzqx.mongodb.net:27017/admin?authSource=admin&replicaSet=atlas-pjydce-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true
PORT = 8080

ACCESS_TOKEN_PRIVATE_KEY= ""
ACCESS_TOKEN_PUBLIC_KEY= ""
REFRESH_TOKEN_PRIVATE_KEY = ""
REFRESH_TOKEN_PUBLIC_KEY = ""

MAILER_HOST = smtp.gmail.com
MAILER_PORT = 587
MAILER_USERNAME = example@gmail.com
MAILER_PASSWORD = xxxxxxxxxxxxxxxx

CLIENT_ORIGIN = https://auth-frontend-cyan.vercel.app/
SERVER_ORIGIN = https://auth-api-kmqg.onrender.com/docs/
SERVER_DOMAIN = auth-api-kmqg.onrender.com
...
```

---

## 🧪 Running the Server

### ▶️ Development

```bash
npm run dev
```

### 🚀 Production

```bash
npm run build
npm start
```

Default port: `8080` (or as configured)

---

## 🐳 Docker Usage

### 🔨 Build & Run

```bash
docker build -t auth-api .
docker run -p 8000:8000 --env-file .env auth-api
```

### 🧪 Docker Compose for Dev

```bash
docker-compose up --build
```

---

## 🗂️ Folder Structure

```
src/
  app.ts                # App entry
  controllers/          # Route handlers
  middlewares/          # Express middlewares
  models/               # Mongoose schemas
  routes/               # Route definitions
  schemas/              # Request validation
  services/             # Core logic
  templates/emails/     # Email templates
  types/                # TS types/interfaces
  utils/                # Helpers
```
