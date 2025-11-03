# HTTP Monitor Dashboard

[![CI/CD Pipeline](https://github.com/Jadesuuu/realtime-http-monitor/actions/workflows/ci.yml/badge.svg)](https://github.com/Jadesuuu/realtime-http-monitor/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/Jadesuuu/realtime-http-monitor/branch/master/graph/badge.svg)](https://codecov.io/gh/Jadesuuu/realtime-http-monitor)

A real-time HTTP endpoint monitoring application that pings httpbin.org every 5 minutes, stores response data, and displays metrics in an interactive dashboard.

**Live Demo:**

- Frontend: https://realtime-http-monitor.vercel.app
- Backend API: https://realtime-http-monitor.onrender.com/api/monitor/responses

---

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture Overview](#architecture-overview)
- [Database Schema](#database-schema)
- [Testing Strategy](#testing-strategy)
- [Deployment](#deployment)
- [Assumptions Made](#assumptions-made)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Setup Instructions

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher
- **Git**

### Local Development

#### 1. Clone the Repository

```bash
git clone https://github.com/Jadesuuu/realtime-http-monitor.git
cd realtime-http-monitor
```

#### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

#### 3. Environment Configuration

**Backend** (optional - uses defaults if not set):

```bash
# backend/.env
NODE_ENV=development
PORT=3001
```

**Frontend**:

```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=http://localhost:3001
```

#### 4. Run the Application

**Option A: Run Both Simultaneously (Recommended)**

```bash
# From project root
npm run dev
```

**Option B: Run Separately**

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

#### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **WebSocket**: ws://localhost:3001

---

## Features

- **Automated Monitoring**: HTTP endpoint pinging every 5 minutes via cron job
- **Real-time Updates**: WebSocket integration for instant data synchronization
- **Response Tracking**: Stores request/response data with performance metrics
- **Interactive Dashboard**: Charts and tables with pagination
- **Manual Triggers**: On-demand ping capability for testing
- **Comprehensive Testing**: 85%+ test coverage on core components
- **CI/CD Pipeline**: Automated testing, linting, and deployment

---

## Technology Stack

### Backend

| Technology    | Version | Purpose       | Reasoning                                                                                                                                                                   |
| ------------- | ------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **NestJS**    | ^11.0.1 | API Framework | - Enterprise-grade architecture with built-in DI<br>- Excellent TypeScript support<br>- Built-in decorators for cron jobs and WebSockets<br>- Modular structure scales well |
| **TypeORM**   | ^0.3.27 | ORM           | - Type-safe database operations<br>- Automatic migrations<br>- Works seamlessly with NestJS                                                                                 |
| **SQLite**    | ^5.1.7  | Database      | - Zero-configuration setup<br>- File-based (no server needed)<br>- Perfect for MVP/demo applications<br>- Easy deployment                                                   |
| **Socket.io** | ^4.8.1  | WebSocket     | - Reliable real-time communication<br>- Auto-reconnection handling<br>- Fallback to polling if needed<br>- Battle-tested in production                                      |
| **Axios**     | ^1.13.1 | HTTP Client   | - Promise-based API<br>- Interceptor support<br>- Better error handling than fetch                                                                                          |
| **Jest**      | ^30.0.0 | Testing       | - Most popular Node.js testing framework<br>- Excellent mocking capabilities<br>- Built-in coverage reports                                                                 |

### Frontend

| Technology           | Version | Purpose            | Reasoning                                                                                                                     |
| -------------------- | ------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| **Next.js**          | 15.0.3  | React Framework    | - Server-side rendering for performance<br>- Built-in routing<br>- Excellent developer experience<br>- Easy Vercel deployment |
| **TypeScript**       | ^5.7.3  | Type Safety        | - Catch errors at compile time<br>- Better IDE support<br>- Self-documenting code                                             |
| **Tailwind CSS**     | ^3.4.1  | Styling            | - Utility-first approach<br>- Rapid prototyping<br>- Small bundle size<br>- Consistent design system                          |
| **shadcn/ui**        | Latest  | UI Components      | - Accessible components out of the box<br>- Customizable with Tailwind<br>- Copy-paste approach (no npm bloat)                |
| **Recharts**         | ^2.x.x  | Data Visualization | - React-first design<br>- Responsive charts<br>- Easy customization<br>- Good documentation                                   |
| **Socket.io Client** | ^4.8.1  | WebSocket          | - Matches backend implementation<br>- Real-time data synchronization                                                          |

---

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│  ┌────────────────────────────────────────────────────┐     │
│  │  Next.js Application (Port 3000)                   │     │
│  │  ┌──────────────┐  ┌──────────────┐                │     │
│  │  │  Dashboard   │  │  Components  │                │     │
│  │  │  Page        │  │  - Table     │                │     │
│  │  │              │  │  - Chart     │                │     │
│  │  └──────┬───────┘  └──────────────┘                │     │
│  │         │                                          │     │
│  │         ├─────> Custom Hook (useMonitorData)       │     │
│  │         │         - Data fetching                  │     │
│  │         │         - WebSocket management           │     │
│  │         │         - State management               │     │
│  └─────────┼──────────────────────────────────────────┘     │
│            │                                                │
│            │  HTTP (REST)         WebSocket                 │
│            ▼                      ▼                         │
└────────────┼──────────────────────┼─────────────────────────┘
             │                      │
             │                      │
┌────────────┼──────────────────────┼─────────────────────────┐
│            │                      │         BACKEND         │
│            ▼                      ▼                         │
│  ┌──────────────────────────────────────────────────┐       │
│  │  NestJS Application (Port 3001)                  │       │
│  │  ┌────────────────┐  ┌────────────────┐          │       │
│  │  │  API Routes    │  │  WebSocket     │          │       │
│  │  │  /api/monitor  │  │  Gateway       │          │       │
│  │  │  - GET         │  │  - Broadcast   │          │       │
│  │  │  - POST        │  │  - Events      │          │       │
│  │  └────────┬───────┘  └────────┬───────┘          │       │
│  │           │                   │                  │       │
│  │           ▼                   │                  │       │
│  │  ┌─────────────────────┐      │                  │       │
│  │  │  MonitorService     │◄─────┘                  │       │
│  │  │  - Cron Job (5min)  │                         │       │
│  │  │  - HTTP Ping        │                         │       │
│  │  │  - Data Storage     │                         │       │
│  │  └──────────┬──────────┘                         │       │
│  │             │                                    │       │
│  │             ▼                                    │       │
│  │  ┌─────────────────────┐                         │       │
│  │  │  TypeORM Repository │                         │       │
│  │  └──────────┬──────────┘                         │       │
│  └─────────────┼────────────────────────────────────┘       │
│                │                                            │
│                ▼                                            │
│  ┌─────────────────────────────────────────────┐            │
│  │  SQLite Database (data.db)                  │            │
│  │  - Response data                            │            │
│  │  - Request/Response payload                 │            │
│  │  - Performance metrics                      │            │
│  └─────────────────────────────────────────────┘            │
│                                                             │
│                ▲                                            │
│                │  HTTP POST                                 │
│                │                                            │
│      ┌─────────┴──────────┐                                 │
│      │  httpbin.org       │                                 │
│      │  /anything         │                                 │
│      └────────────────────┘                                 │
└─────────────────────────────────────────────────────────────┘
```

### Component Architecture (Frontend)

**Design Philosophy: Component Abstraction**

I chose to separate the dashboard into distinct components to achieve:

1. **Separation of Concerns**: Each component has a single responsibility
2. **Reusability**: Components can be used in different contexts
3. **Testability**: Isolated components are easier to test
4. **Maintainability**: Changes to one component don't affect others
5. **Performance**: React can optimize re-renders at component level

```
app/page.tsx (Container)
├── useMonitorData() (Custom Hook)
│   ├── Data fetching
│   ├── WebSocket management
│   └── State management
├── DashboardHeader
│   ├── Connection status
│   └── Manual trigger button
├── ResponseTimeChart (Presentational)
│   └── Recharts visualization
└── ResponseTable (Presentational)
    ├── Data display
    └── Pagination logic (internal state)
```

**Why This Approach?**

- **Custom Hook Pattern**: Encapsulates all data logic in one place, keeping components clean
- **Prop Drilling**: Minimal - only pass data that components actually need
- **State Updates**: Only affected components re-render, not the entire page
- **Scalability**: Easy to add new features without modifying existing components

### Data Flow

```
1. Cron Job Triggers (Every 5 minutes)
   ↓
2. MonitorService.pingHttpBin()
   ├─> Generate random payload
   ├─> POST to httpbin.org/anything
   ├─> Calculate response time
   └─> Save to database
   ↓
3. MonitorGateway.broadcastNewResponse()
   ↓
4. WebSocket → Frontend
   ↓
5. useMonitorData() updates state
   ↓
6. React re-renders affected components
   ├─> ResponseTable updates
   └─> ResponseTimeChart updates
```

---

## 🗄️ Database Schema

### Response Entity

```typescript
@Entity()
export class Response {
  @PrimaryGeneratedColumn()
  id: number; // Auto-incrementing primary key

  @Column("text")
  requestPayload: string; // JSON string of request sent to httpbin

  @Column("text")
  responseData: string; // JSON string of response from httpbin

  @Column()
  statusCode: number; // HTTP status code (200, 404, 500, etc.)

  @Column({ default: 0 })
  responseTime: number; // Time taken for request (milliseconds)

  @CreateDateColumn()
  timestamp: Date; // Automatic timestamp
}
```

### Database File

- **Location**: `backend/data.db` (SQLite file)
- **Migrations**: Auto-sync enabled in development (TypeORM `synchronize: true`)
- **Backup**: Simply copy `data.db` file

### Sample Data Structure

```json
{
  "id": 1,
  "requestPayload": "{\"timestamp\":\"2025-11-03T10:00:00.000Z\",\"random\":0.5234,\"data\":{\"value1\":42,\"value2\":\"test-1730635200000\"}}",
  "responseData": "{\"args\":{},\"data\":\"\",\"files\":{},\"form\":{},\"headers\":{\"Content-Type\":\"application/json\"},\"json\":{\"timestamp\":\"2025-11-03T10:00:00.000Z\",\"random\":0.5234,\"data\":{\"value1\":42,\"value2\":\"test-1730635200000\"}},\"method\":\"POST\",\"origin\":\"123.45.67.89\",\"url\":\"https://httpbin.org/anything\"}",
  "statusCode": 200,
  "responseTime": 245,
  "timestamp": "2025-11-03T10:00:00.000Z"
}
```

### Why SQLite?

- **Zero Configuration**: No database server setup required
- **Portable**: Single file can be backed up easily
- **Fast**: Excellent for read-heavy workloads
- **Perfect for MVP**: Easy deployment to platforms like Render
- **Limitation**: Not ideal for high-concurrency writes (but fine for this use case)

---

## Testing Strategy

### Core Component Identification

I identified **MonitorService** as the core component for comprehensive testing because:

1. **Critical Business Logic**: Contains the main monitoring functionality
2. **Complex Orchestration**: Coordinates HTTP, database, and WebSocket operations
3. **Multiple Dependencies**: Interacts with external APIs, database, and WebSocket gateway
4. **Scheduled Operations**: Handles cron job execution
5. **Error Handling**: Must gracefully handle network failures

### Test Coverage

#### Backend Tests (85%+ Coverage)

**MonitorService Tests** (10 tests):

```typescript
describe('MonitorService', () => {
  ✓ Successful HTTP ping and data storage
  ✓ Response time calculation accuracy
  ✓ Network error handling
  ✓ Random payload generation structure
  ✓ Database retrieval with ordering
  ✓ Result limiting (100 records)
  ✓ Manual trigger functionality
  ✓ WebSocket broadcast verification
  ✓ Timestamp handling
  ✓ Status code tracking
});
```

**MonitorController Tests** (5 tests):

```typescript
describe('MonitorController', () => {
  ✓ GET /responses endpoint
  ✓ POST /trigger endpoint
  ✓ Service method calls
  ✓ Response formatting
  ✓ Error handling
});
```

**MonitorGateway Tests** (6 tests):

```typescript
describe('MonitorGateway', () => {
  ✓ Component initialization
  ✓ Event broadcasting
  ✓ Multiple client handling
  ✓ Different status codes
  ✓ Server availability
  ✓ Event emission verification
});
```

#### Frontend Tests

**ResponseTable Tests** (9 tests):

```typescript
describe('ResponseTable', () => {
  ✓ Component rendering
  ✓ Empty state display
  ✓ Data display accuracy
  ✓ Pagination visibility logic
  ✓ Pagination navigation
  ✓ Button disabled states
  ✓ Status badge variants
  ✓ Row rendering
  ✓ IP address display
});
```

**ResponseTimeChart Tests** (5 tests):

```typescript
describe('ResponseTimeChart', () => {
  ✓ Chart rendering
  ✓ Chart elements presence
  ✓ Data limiting (20 responses)
  ✓ Empty data handling
  ✓ Small dataset handling
});
```

### Running Tests

```bash
# Backend tests
cd backend
npm test                  # Run all tests
npm run test:cov          # With coverage report
npm run test:watch        # Watch mode

# Frontend tests
cd frontend
npm test                  # Run all tests
npm run test:coverage     # With coverage
npm run test:watch        # Watch mode
```

### Test Philosophy

- **Unit Tests**: Test components in isolation with mocked dependencies
- **Integration**: Verify interactions between services
- **Mocking Strategy**: Mock external dependencies (HTTP, database, WebSocket)
- **Coverage Goal**: 80%+ on core components, focusing on business logic
- **Assertions**: Clear, descriptive test names following Given-When-Then pattern

---

## 🌐 Deployment

### Production URLs

- **Frontend (Vercel)**: https://realtime-http-monitor.vercel.app
- **Backend (Render)**: https://realtime-http-monitor.onrender.com
- **API Endpoint**: https://realtime-http-monitor.onrender.com/api/monitor/responses

### Deployment Platforms (Free Tier)

#### Frontend - Vercel

**Why Vercel?**

- Optimized for Next.js (same company)
- Automatic deployments from Git
- Global CDN
- Free SSL certificates
- Excellent performance

**Deployment Steps:**

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL`: Backend URL
   - `NEXT_PUBLIC_WS_URL`: Backend WebSocket URL
4. Deploy (automatic on every push)

**Free Tier Limits:**

- 100 GB bandwidth/month
- 100 deployments/day
- Unlimited projects

#### Backend - Render

**Why Render?**

- Free tier includes background workers (for cron jobs)
- Automatic deployments from Git
- Built-in health checks
- Free SSL
- Persistent disk storage (for SQLite)

**Deployment Steps:**

1. Create new Web Service
2. Connect GitHub repository
3. Configure:
   - Root Directory: `backend`
   - Build Command: `npm install && npx nest build`
   - Start Command: `npm run start:prod`
4. Add environment variables:
   - `NODE_ENV`: production
   - `PORT`: 3001

**Free Tier Limits:**

- 750 hours/month (enough for 1 service running 24/7)
- Spins down after 15 minutes of inactivity
- 512 MB RAM
- Shared CPU

**Note**: First request after spin-down takes ~30 seconds (cold start)

### CI/CD Pipeline

GitHub Actions automatically:

1. Runs all tests (backend + frontend)
2. Performs linting checks
3. Generates coverage reports
4. Verifies builds succeed
5. Uploads coverage to Codecov

**Pipeline Status**: [![CI/CD](https://github.com/Jadesuuu/realtime-http-monitor/actions/workflows/ci.yml/badge.svg)](https://github.com/Jadesuuu/realtime-http-monitor/actions)

---

## Assumptions Made

1. **httpbin.org Availability**: Assumed the service is reliable and always available
2. **5-Minute Interval**: Chose 5 minutes as a balance between data freshness and API politeness
3. **Data Retention**: Storing all responses indefinitely (in production, would implement cleanup)
4. **Single Instance**: Application designed for single-instance deployment
5. **No Authentication**: Assumed public dashboard (would add auth for production)
6. **SQLite Sufficient**: Assumed data volume doesn't require PostgreSQL/MySQL
7. **Free Tier Acceptable**: Cold starts on Render are acceptable for demo purposes
8. **Network Reliability**: Frontend assumes backend is accessible
9. **Browser Support**: Modern browsers with WebSocket support
10. **Time Zone**: Using ISO timestamps, letting frontend handle localization

---

## Future Improvements

### High Priority

1. **Data Retention Policy**

   - Automatic cleanup of old records
   - Configurable retention periods
   - Data archiving to S3/cloud storage

2. **Enhanced Analytics**
   - Uptime percentage calculations
   - Average response times by time period
   - Failure rate trends
   - Incident reports

### Medium Priority

3. **Advanced Visualizations**

   - Response time heatmaps
   - Geographical response time maps (if monitoring multiple regions)
   - Historical comparisons
   - Export to PDF/CSV

4. **Database Migration**

   - Move to PostgreSQL for better concurrency
   - Implement connection pooling
   - Add database indexes for performance

5. **Performance Optimizations**

   - Implement Redis caching
   - Lazy loading for large datasets
   - Virtual scrolling for tables
   - Server-side pagination

6. **Enhanced Error Handling**

   - Retry logic with exponential backoff
   - Circuit breaker pattern
   - Detailed error categorization

7. **API Documentation**
   - Swagger/OpenAPI integration
   - Interactive API explorer
   - Webhook documentation

### Low Priority

8. **UI/UX Improvements**

   - Dark mode toggle
   - Customizable dashboards
   - Drag-and-drop widget arrangement
   - Mobile responsive improvements

9. **Advanced Testing**

   - E2E tests with Playwright
   - Load testing with k6
   - Visual regression testing

---

---

## Author

**Jade Mark Angelo Bonifacio**

- GitHub: [@Jadesuuu](https://github.com/Jadesuuu)

---

## Acknowledgments

- Built as a take-home assignment for **BizScout**
- httpbin.org for providing a free testing endpoint
- NestJS and Next.js communities for excellent documentation

---

**Built with ❤️ using TypeScript, NestJS, and Next.js**
