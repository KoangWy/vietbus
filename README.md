# VietBus - Bus Booking System

A full-stack web application for managing inter-city bus ticket reservations, built with React, Flask, and MySQL. Designed as a demonstration system for recruitment purposes.

---

## Table of Contents
- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Quick Start](#quick-start)
- [Docker Deployment](#docker-deployment)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Default Credentials](#default-credentials)
- [Development](#development)
- [Important Notes](#important-notes)
- [Video Demo](#video-demo)

---

## Overview

VietBus is a comprehensive booking system that allows:
- **Passengers** to search trips, book tickets, and manage reservations
- **Staff** to manage schedules, view bookings, and handle operations
- **Administrators** to perform full CRUD operations on all system entities

The system implements real-world business logic including seat availability tracking, automatic trip status updates, fare management, and multi-role authentication.

---

## System Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  React Frontend │ ◄─────► │  Flask Backend  │ ◄─────► │  MySQL Database │
│   (Port 5173)   │   REST  │   (Port 9000)   │   SQL   │   (Port 3306)   │
│                 │   API   │                 │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

### Components

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | React 19 + Vite | User interface for booking and administration |
| **Backend** | Flask + PyJWT | REST API with JWT authentication |
| **Database** | MySQL 8.0+ | Relational database with stored procedures & triggers |

---

## Technology Stack

### Frontend
- React 19
- React Router DOM
- Vite (build tool)
- Vanilla CSS

### Backend
- Python 3.8+
- Flask (web framework)
- PyJWT (authentication)
- MySQL Connector Python
- Flask-CORS

### Database
- MySQL 8.0+
- Stored Procedures
- Triggers
- Functions
- Scheduled Events

---

## Features

### 🌐 Public Features
- **Trip Search**: Search buses by departure/arrival stations and date
- **Trip Details**: View complete route information, pricing, and real-time seat availability
- **Seat Selection**: Interactive seat map with visual booking interface
- **Ticket Verification**: Lookup and verify tickets by serial number or booking ID
- **User Authentication**: Secure registration and login for passengers and staff

### 👤 User Features (Authenticated)
- **Profile Management**: View and update personal information
- **Booking History**: Complete history of all bookings and tickets
- **Ticket Management**: View ticket details, status, and QR codes

### 🔧 Admin Features (Staff/Administrator)
- **Dashboard**
  - System overview and statistics
  - Quick access to key operations
  
- **Operations Management**
  - **Trips**: Create, update, cancel scheduled trips
  - **Routes**: Define and manage routes between stations
  - **Stations**: CRUD operations for bus stations
  - **Operators**: Manage bus operator companies
  
- **Fleet & Pricing**
  - **Buses**: Track and manage vehicle inventory
  - **Fares**: Configure pricing rules by route and seat class
  
- **Bookings & Users**
  - **Bookings**: View and manage all reservations
  - **Tickets**: Issue, refund, and track tickets
  - **Accounts**: Manage passenger and staff accounts

### ⚙️ Technical Features
- **Real-time Availability**: MySQL functions calculate seat availability on-the-fly
- **Automated Status Updates**: Scheduled events update trip statuses every minute
- **Transaction Safety**: Stored procedures ensure atomic booking operations
- **Business Rules**: Database triggers enforce data integrity and business logic
- **JWT Authentication**: Token-based auth with role-based access control (USER/STAFF/ADMIN)
- **RESTful API**: CORS-enabled Flask backend with comprehensive endpoints

---

## Quick Start

### Prerequisites
- **Docker & Docker Compose** (recommended)
- OR manually: Python 3.8+, Node.js 18+, MySQL 8.0+

### Option 1: Docker Compose (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/KoangWy/vietbus.git
   cd vietbus
   ```

2. **Configure backend environment:**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Start all services:**
   ```bash
   docker-compose up -d
   ```

4. **Initialize database:**
   ```bash
   # Connect to your MySQL instance
   mysql -u root -p defaultdb < database/schema.sql
   mysql -u root -p defaultdb < database/seed.sql
   ```

5. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:9000

### Option 2: Manual Setup

#### 1. Database Setup
```bash
# Start MySQL service
mysql -u root -p

# Create database and import schema
CREATE DATABASE defaultdb;
USE defaultdb;
SOURCE database/schema.sql;
SOURCE database/seed.sql;
```

#### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Run backend
python app.py
# Backend runs at http://localhost:9000
```

#### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Update API endpoint in src/utils/api.js if needed
# Run frontend
npm run dev
# Frontend runs at http://localhost:5173
```

---

## Docker Deployment

### Services Configuration

The `docker-compose.yml` defines two services:

| Service | Port | Container Name |
|---------|------|----------------|
| Frontend | 5173 | vietbus_frontend |
| Backend | 9000 | vietbus_backend |

### Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build

# Stop and remove volumes
docker-compose down -v
```

### Volume Mounts
- Backend: `./backend:/app/backend` (hot reload)
- Frontend: `./frontend/src:/app/src` (hot reload)

---

## Project Structure

```
vietbus/
├── README.md                    # This file
├── docker-compose.yml           # Docker orchestration
│
├── backend/                     # Flask REST API
│   ├── README.md               # Backend documentation
│   ├── app.py                  # Application entry point
│   ├── factory.py              # App factory with blueprints
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example            # Environment template
│   ├── routes/                 # API endpoint blueprints
│   └── utils/                  # Database & JWT utilities
│
├── frontend/                    # React web application
│   ├── README.md               # Frontend documentation
│   ├── package.json            # NPM dependencies
│   ├── vite.config.js          # Vite configuration
│   └── src/
│       ├── pages/              # Page components
│       ├── components/         # Reusable components
│       └── utils/              # Helper functions
│
└── database/                    # MySQL database
    ├── README.md               # Database documentation
    ├── schema.sql              # Table definitions, procedures, triggers
    └── seed.sql                # Sample data
```

---

## Documentation

Each component has detailed documentation in its respective directory:

- **[Backend Documentation](backend/README.md)** - API endpoints, authentication, stored procedures
- **[Frontend Documentation](frontend/README.md)** - Components, routing, state management
- **[Database Documentation](database/README.md)** - Schema, procedures, functions, triggers

---

## Default Credentials

### Test Accounts

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| Staff (FUTA) | staff.futa@gmail.com | staff123 | Trip management |
| Staff (Thanh Buoi) | staff.thanhbuoi@gmail.com | staff123 | Trip management |
| Passenger | nguyenvana@gmail.com | user123 | Regular user |
| Passenger | tranthib@gmail.com | user123 | Regular user |

### Default Operators
- **OP001**: FUTA Bus Lines
- **OP002**: Thanh Buoi
- **OP003**: Kumho Samco

### Sample Routes
- Ho Chi Minh → Da Lat (Route 1)
- Ho Chi Minh → Can Tho (Route 2)
- Ho Chi Minh → Vung Tau (Route 3)
- Ho Chi Minh → Nha Trang (Route 4)

---

## Development

### Backend Development

```bash
cd backend
source venv/bin/activate
python app.py
```

API available at: http://localhost:9000/api

Key endpoints:
- `POST /api/login` - User authentication
- `GET /api/schedule/trips` - Search trips
- `POST /api/bookings/create` - Create booking
- `GET /api/admin/*` - Admin operations (requires auth)

### Frontend Development

```bash
cd frontend
npm run dev
```

App available at: http://localhost:5173

Key pages:
- `/` - Homepage with search
- `/auth` - Login/Register
- `/schedule` - Trip search results
- `/admin/*` - Admin dashboard (requires auth)

### Database Development

Stored procedures and functions are defined in `database/schema.sql`.

To modify database:
1. Edit `schema.sql`
2. Drop and recreate database
3. Re-run seed data

Key procedures:
- `sp_create_passenger_account` - User registration
- `sp_schedule_trip` - Create new trip
- `sp_create_booking_with_tickets` - Booking with seats
- `fn_get_available_seats` - Calculate availability

---

## Important Notes

### ⚠️ Security Warnings

1. **This is a DEMO system** - Not production-ready
2. **Passwords are stored in plaintext** - No hashing implemented
3. **JWT secrets should be changed** - Use strong secrets in production
4. **No rate limiting** - Vulnerable to brute force
5. **CORS is fully open** - Restrict origins in production

### ⚠️ Data Privacy

**DO NOT enter real personal information:**
- Use fake names, emails, and phone numbers
- Do not use real government ID numbers
- This is for demonstration purposes only

### Database Notes

- **Triggers**: Auto-generate IDs, update arrival times, enforce business rules
- **Events**: `ev_auto_update_trip_status` runs every minute to update trip statuses
- **Functions**: `fn_get_available_seats` and `fn_calculate_booking_total` are called by backend
- **Stored Procedures**: Encapsulate complex business logic with transaction safety

---

## API Testing

### Using cURL

**Login:**
```bash
curl -X POST http://localhost:9000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nguyenvana@gmail.com","password":"user123","role":"passenger"}'
```

**Search Trips:**
```bash
curl "http://localhost:9000/api/schedule/trips?from=1&to=3&date=2026-02-01"
```

**Create Booking (requires token):**
```bash
curl -X POST http://localhost:9000/api/bookings/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "trip_id": 1,
    "seat_codes": ["A01", "A02"],
    "passenger_name": "Nguyen Van A",
    "passenger_phone": "0912345678"
  }'
```

---

## Troubleshooting

### Common Issues

1. **Database connection failed:**
   - Ensure MySQL is running
   - Check credentials in `backend/.env`
   - Verify database `defaultdb` exists

2. **CORS errors:**
   - Ensure backend is running at port 9000
   - Check `frontend/src/utils/api.js` API_BASE_URL
   - Verify Flask-CORS is installed

3. **Authentication errors:**
   - Clear browser localStorage
   - Check JWT secret matches in backend config
   - Verify token hasn't expired (24h default)

4. **Docker issues:**
   - Run `docker-compose down -v` to reset
   - Check ports 5173 and 9000 are not in use
   - Review logs with `docker-compose logs -f`

---

## Video Demo
<div align="center">

[![YouTube Playlist](https://img.shields.io/badge/YouTube-Playlist_Demo-red?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com/playlist?list=PLu5cEPe6kPawYuMUcrCEx3JvpThMPejI9&si=BPjub8xLR0YvVa80)

</div>

---

## License

This project is developed as a demonstration system for assignment and recruitment purposes.

---

## Acknowledgments

- **FUTA Bus Lines** - Inspiration for booking workflow
- **MySQL** - Powerful stored procedure and trigger support
- **Flask & React** - Simple yet powerful tech stack

---

**VietBus - Built with ❤️**
