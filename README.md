# HTTP Monitor Dashboard

[![CI/CD Pipeline](https://github.com/Jadesuuu/realtime-http-monitor/actions/workflows/ci.yml/badge.svg)](https://github.com/Jadesuuu/realtime-http-monitor/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/Jadesuuu/realtime-http-monitor/branch/master/graph/badge.svg)](https://codecov.io/gh/Jadesuuu/realtime-http-monitor)

Real-time HTTP endpoint monitoring application built with **NestJS** (backend) and **Next.js** (frontend).

## 🚀 Features

- Automated HTTP monitoring (pings every 5 minutes)
- Real-time updates via WebSocket
- Response time tracking
- Historical data storage (SQLite)
- Interactive dashboard with charts
- Manual trigger capability

## 🛠️ Tech Stack

### Backend

- **NestJS** - Progressive Node.js framework
- **TypeORM** - Database ORM
- **SQLite** - Embedded database
- **Socket.io** - WebSocket server
- **Axios** - HTTP client
- **Jest** - Testing framework

### Frontend

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Socket.io Client** - Real-time updates
- **Recharts** - Data visualization

## Installation

### Prerequisites

- Node.js 18+ and npm

### Clone Repository

bash
git clone https://github.com/YOUR_USERNAME/realtime-http-monitor.git
cd realtime-http-monitor

### Install Dependencies

bash

# Install all dependencies (root, backend, frontend)

npm install
cd backend && npm install
cd ../frontend && npm install

## 🏃 Running the Application

### Development Mode

bash

# From project root - runs both backend and frontend

npm run dev

# Backend only (runs on http://localhost:3001)

cd backend && npm run start:dev

# Frontend only (runs on http://localhost:3000)

cd frontend && npm run dev

### Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api
- WebSocket: ws://localhost:3001

## 🧪 Testing

### Backend Tests

bash
cd backend

# Run all tests

npm test

# Run with coverage

npm run test:cov

# Watch mode

npm run test:watch

### Test Coverage

- **MonitorService**: 85%+ coverage
- **MonitorController**: 100% coverage
- **MonitorGateway**: 85%+ coverage

## 🔄 CI/CD Pipeline

GitHub Actions workflow runs on every push:

- Backend tests with coverage
- Frontend build verification
- Code linting

## 🌐 Deployment

### Frontend (Vercel)

- Production: [Coming Soon]
- Auto-deploys from master branch

### Backend (Render)

- API: [Coming Soon]
- WebSocket endpoint included

## 🎯 Core Component Testing

I identified **MonitorService** as the core component for comprehensive testing because:

1. Contains critical business logic (HTTP monitoring)
2. Orchestrates database, HTTP, and WebSocket operations
3. Handles scheduled cron jobs
4. Most complex component with multiple responsibilities

### Test Coverage Highlights

- HTTP request handling and response time tracking
- Database operations (save and retrieve)
- WebSocket broadcasting
- Error handling and edge cases
- Manual trigger functionality

## 📝 API Endpoints

### GET `/api/monitor/responses`

Returns historical response data (last 100 records)

**Response:**
json
[
{
"id": 1,
"requestPayload": "...",
"responseData": "...",
"statusCode": 200,
"responseTime": 245,
"timestamp": "2025-11-02T..."
}
]

### POST `/api/monitor/trigger`

Manually triggers an HTTP ping

**Response:**
json
{
"id": 2,
"statusCode": 200,
"responseTime": 180,
"timestamp": "..."
}

## 🔌 WebSocket Events

### Event: `newResponse`

Emitted when a new HTTP response is received

**Payload:**
json
{
"id": 1,
"statusCode": 200,
"responseTime": 245,
"timestamp": "..."
}

## Architecture Decisions

### Component Abstraction

- Custom hooks for data fetching and WebSocket management
- Separated presentational components (Table, Chart)
- Clean separation of concerns for maintainability

### Real-time Updates

- WebSocket connection for instant data updates
- Automatic reconnection on connection loss
- Toast notifications for user feedback

### Database Choice

- SQLite for simplicity and portability
- TypeORM for type-safe database operations
- No external database setup required

## Future Improvements

- [ ] Add authentication
- [ ] Multiple endpoint monitoring
- [ ] Email/Slack notifications on failures
- [ ] Custom monitoring intervals
- [ ] Export data to CSV
- [ ] Advanced analytics dashboard

## Author

**Jade Mark Angelo Bonifacio**

## License

MIT

---

**Built as a take-home assignment for BizScout**
