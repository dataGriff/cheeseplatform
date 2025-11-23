# 🧀 Cheese Platform

A comprehensive SaaS platform that allows cheese companies to easily build and host cheese questionnaires to recommend the best cheeses for their customers.

## Features

### Core Features
- **Authentication** - Secure JWT-based authentication for cheese companies
- **Cheese Management** - CRUD operations for managing cheese inventory with detailed attributes
- **Questionnaire Builder** - Create custom questionnaires to understand customer preferences
- **Smart Recommendation Engine** - AI-powered matching algorithm to suggest the best cheeses
- **Real-time Data** - WebSocket support for live updates on responses and recommendations
- **Operational Data** - PostgreSQL database for reliable data storage
- **Integration/Webhooks** - Connect with external systems via webhook events
- **Contract/Subscription Management** - Multi-tier subscription system

### Technical Stack
- **Backend**: Node.js, TypeScript, Express.js, Socket.IO
- **Frontend**: React, TypeScript, Vite
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: WebSocket (Socket.IO)
- **Deployment**: Docker, Docker Compose

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 16+ (or use Docker)
- npm or yarn

### Option 1: Using Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/dataGriff/cheeseplatform.git
cd cheeseplatform
```

2. Start all services:
```bash
docker-compose up -d
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Database: localhost:5432

### Option 2: Manual Setup

#### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your database credentials

5. Build and start the server:
```bash
npm run build
npm start
```

For development with auto-reload:
```bash
npm run dev
```

#### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Project Structure

```
cheeseplatform/
├── backend/
│   ├── src/
│   │   ├── config/        # Database and app configuration
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Auth and other middleware
│   │   ├── models/        # Data models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic (recommendation engine)
│   │   ├── utils/         # Helper functions
│   │   └── index.ts       # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts (Auth)
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   ├── styles/        # CSS files
│   │   ├── types/         # TypeScript types
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── docs/
│   └── API.md            # API documentation
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
└── README.md
```

## API Documentation

See [API Documentation](docs/API.md) for detailed endpoint information.

### Key Endpoints

- `POST /api/auth/register` - Register a new cheese company
- `POST /api/auth/login` - Login to get JWT token
- `GET /api/cheeses` - Get all cheeses
- `POST /api/cheeses` - Create a new cheese
- `GET /api/questionnaires` - Get all questionnaires
- `POST /api/questionnaires` - Create a new questionnaire
- `POST /api/responses/:id/submit` - Submit questionnaire response (public)
- `GET /api/webhooks` - Get webhooks for integrations

## Database Schema

The platform uses PostgreSQL with the following main tables:

- **companies** - Cheese company tenants
- **cheeses** - Cheese inventory with attributes
- **questionnaires** - Custom questionnaires
- **questionnaire_responses** - Customer responses with recommendations
- **webhooks** - Integration webhooks
- **api_keys** - API keys for integrations

## Recommendation Algorithm

The platform uses a sophisticated matching algorithm that scores cheeses based on:

1. **Intensity Matching** (30 points) - Matches cheese intensity to customer preference
2. **Texture Preference** (25 points) - Matches preferred textures
3. **Milk Type** (20 points) - Matches preferred milk types
4. **Cheese Type** (25 points) - Matches cheese categories
5. **Flavor Profile** (10 points per match) - Matches specific flavor preferences

Top 5 recommendations are returned with match scores and reasons.

## Real-Time Features

The platform supports real-time updates via WebSocket:

```javascript
// Connect to WebSocket
const socket = io('http://localhost:3001');

// Join company room
socket.emit('join-company', companyId);

// Listen for new responses
socket.on('response-submitted', (data) => {
  console.log('New response:', data);
});
```

## Webhook Integration

Set up webhooks to receive events:

- `response.created` - New questionnaire response
- `questionnaire.completed` - Questionnaire completion
- `recommendation.generated` - Recommendations generated

## Subscription Tiers

The platform supports multiple subscription tiers:
- **free** - Basic features
- **pro** - Advanced features
- **enterprise** - Full features with custom integration

## Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Linting
```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

## Security Features

- **JWT-based authentication** - Secure token-based auth with configurable expiration
- **Password hashing** - bcrypt with salt rounds for secure password storage
- **SQL injection protection** - Parameterized queries via pg library
- **CORS configuration** - Configurable cross-origin resource sharing
- **Environment-based secrets** - Sensitive data stored in environment variables
- **Rate limiting** - Protection against brute force and DDoS attacks
  - Authentication endpoints: 5 requests per 15 minutes
  - Public endpoints: 20 requests per 5 minutes
  - API endpoints: 100 requests per 15 minutes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

ISC

## Support

For support, please open an issue in the GitHub repository.

## Roadmap

- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] Multi-language support
- [ ] Mobile app
- [ ] API rate limiting
- [ ] Advanced subscription management with Stripe integration
- [ ] Customer-facing public questionnaire pages
- [ ] Export functionality for responses
- [ ] Advanced filtering and search
- [ ] Cheese comparison features

