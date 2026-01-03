# Pet Adoption Management System

A full-stack web application for managing pet adoption processes, built with React, TypeScript, Node.js, Express, and MongoDB.

## Features

- 🐾 Browse available pets with advanced filtering
- 📝 Submit adoption applications
- 👤 User authentication and role-based access control
- 👨‍💼 Admin dashboard for managing pets and applications
- 📱 Responsive design with modern UI components
- ✅ Form validation with Zod and React Hook Form
- 🔍 Optimized database queries with MongoDB aggregation

## Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: TanStack Query (React Query) + Zustand
- **Form Handling**: React Hook Form + Zod
- **Routing**: React Router v7
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js 22+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcrypt
- **Validation**: Joi
- **Logging**: Winston

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v22.19.0 or higher)
- **npm** or **pnpm**
- **MongoDB** (local or MongoDB Atlas)

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd pet-adoption-management
```

### 2. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your configuration
# Required variables:
# - PORT=3000
# - NODE_ENV=development
# - DB_URI=mongodb://localhost:27017/pet-adoption
# - JWT_SECRET=your-secret-key
# - JWT_EXPIRES_IN=7d

# Build the project
npm run build

# Seed the database with sample data
npm run seed

# Start development server
npm run dev
```

Backend will run on `http://localhost:3000`

#### Backend Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### 3. Frontend Setup

```bash
# Navigate to frontend folder (from project root)
cd frontend

# Install dependencies
npm install
# or
pnpm install

# Create environment file
cp .env.example .env

# Edit .env file with backend URL
# VITE_API_BASE_URL=http://localhost:3000/api/v1

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

#### Frontend Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Default Credentials (After Seeding)

### Admin Account
- **Email**: admin@example.com
- **Password**: password123

### User Account
- **Email**: user@example.com
- **Password**: password123

## Project Structure

```
pet-adoption-management/
├── backend/
│   ├── src/
│   │   ├── api/v1/          # API routes
│   │   ├── config/          # Configuration files
│   │   ├── db/              # Database connection
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Mongoose models
│   │   ├── modules/v1/      # Business logic modules
│   │   ├── scripts/         # Utility scripts
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utility functions
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── components/      # Reusable components
    │   ├── hooks/           # Custom React hooks
    │   ├── lib/             # Utilities and configurations
    │   ├── pages/           # Page components
    │   ├── routes/          # Route protection
    │   └── types/           # TypeScript types
    ├── package.json
    └── vite.config.ts
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user

### Pets
- `GET /api/v1/pets` - Get all pets (with filters)
- `GET /api/v1/pets/:id` - Get pet by ID
- `POST /api/v1/pets` - Create new pet (Admin only)
- `PUT /api/v1/pets/:id` - Update pet (Admin only)
- `DELETE /api/v1/pets/:id` - Delete pet (Admin only)

### Applications
- `GET /api/v1/applications` - Get applications (with filters)
- `GET /api/v1/applications/:id` - Get application by ID
- `POST /api/v1/applications` - Submit adoption application
- `PUT /api/v1/applications/:id` - Update application status (Admin only)
- `DELETE /api/v1/applications/:id` - Delete application

## Environment Variables

### Backend (.env)
```env
PORT=3000
NODE_ENV=development
DB_URI=mongodb://localhost:27017/pet-adoption
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

## Development

### Code Quality

Both frontend and backend use:
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety

Run code quality checks:
```bash
# In backend or frontend directory
npm run lint        # Check for linting errors
npm run lint:fix    # Fix linting errors
npm run format      # Format code
```

## Deployment Links
- Frontend (live): 
- Backend API: 


## Production Build

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## License

This project is licensed under the ISC License.
