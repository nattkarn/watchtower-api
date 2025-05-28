# 🛡️ Watchtower Backend

This is the backend API service for the Watchtower project.  
Built with [NestJS](https://nestjs.com/) and [Prisma ORM](https://www.prisma.io/) using PostgreSQL (Neon.tech).

---

## 🚀 Getting Started

### 1. Clone this repo

```bash
git clone https://github.com/nattkarn/watchtower-api.git
cd watchtower-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables
#### Create a .env file:
```bash
DATABASE_URL="postgresql://<username>:<password>@<host>/<db>?sslmode=require"
PORT=5000
```

### 4. Run the app

```bash
npm run start:dev
```

## 🧱 Project Structure
```bash
├── src
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── main.ts
│   └── app.service.ts
├── test
│   ├── app.e2e-spec.ts
│   └── e2e.json
├── tsconfig.build.json
├── tsconfig.json
└── package.json
```

## 🛠 Tech Stack

- NestJS
- Prisma
- PostgreSQL (Neon.tech)