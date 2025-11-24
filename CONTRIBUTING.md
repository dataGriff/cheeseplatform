# Contributing to Cheese Platform

Thank you for your interest in contributing to the Cheese Platform! This guide will help you get started with the development process.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Using Taskfile](#using-taskfile)
- [Code Guidelines](#code-guidelines)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)

## Getting Started

### Prerequisites

- **Node.js** 20 or higher
- **npm** or **yarn**
- **Docker** and **Docker Compose** (recommended)
- **Git**
- **[Task](https://taskfile.dev/)** (recommended for easier development)

### Initial Setup

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/cheeseplatform.git
   cd cheeseplatform
   ```

2. **Set up the development environment:**
   ```bash
   # Using Taskfile (recommended)
   task dev:setup
   
   # Or manually
   npm install --prefix backend
   npm install --prefix frontend
   docker-compose up -d postgres
   ```

3. **Verify everything works:**
   ```bash
   task health
   # Should show all services as ✅ OK
   ```

## Development Workflow

### Using Taskfile (Recommended)

The project includes a comprehensive Taskfile that simplifies all development tasks. Here's the typical workflow:

#### Quick Start Development
```bash
# Start everything with Docker (easiest)
task docker:up

# Or start local development with Docker database
task dev:setup    # Sets up environment
task dev:all      # Starts backend and frontend locally
```

#### Individual Services
```bash
task db:start         # Start only database
task backend:dev      # Start backend in development mode
task frontend:dev     # Start frontend in development mode
```

#### Common Development Tasks
```bash
task                  # Show all available tasks
task help            # Show detailed help
task status          # Check service status
task health          # Health check all services
task logs            # View all logs
task docker:logs:backend   # View backend logs only
task test            # Run all tests
task lint            # Run all linting
task clean           # Clean build artifacts
```

#### Working with Database
```bash
task db:connect      # Connect to PostgreSQL
task db:reset        # Reset database (fresh start)
task db:backup       # Create database backup
```

### Manual Development (Without Taskfile)

If you prefer not to use Taskfile:

1. **Start the database:**
   ```bash
   docker-compose up -d postgres
   ```

2. **Backend development:**
   ```bash
   cd backend
   cp .env.example .env    # Configure environment
   npm install
   npm run dev
   ```

3. **Frontend development (in new terminal):**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Using Taskfile

### Installation

Task is included in the dev container. For local installation:

```bash
# macOS
brew install go-task/tap/go-task

# Linux
sh -c "$(curl --location https://taskfile.dev/install.sh)" -- -d
```

### Key Tasks for Contributors

| Task | Description |
|------|-------------|
| `task dev:setup` | One-time setup for development environment |
| `task dev:all` | Start both backend and frontend in development |
| `task test` | Run all tests |
| `task lint` | Check code style and formatting |
| `task build:all` | Build both services for production |
| `task docker:up` | Start full environment with Docker |
| `task docker:down` | Stop all services |
| `task health` | Verify all services are running correctly |

### Development Shortcuts

- `task be` → Start backend development
- `task fe` → Start frontend development  
- `task up` → Start Docker services
- `task down` → Stop Docker services
- `task logs` → View all logs

## Code Guidelines

### General Principles

- Write clean, readable, and maintainable code
- Follow existing code patterns and conventions
- Add comments for complex business logic
- Write tests for new functionality
- Ensure type safety with TypeScript

### Backend Guidelines

- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with parameterized queries
- **Authentication**: JWT tokens
- **API Design**: RESTful endpoints with proper HTTP status codes
- **File Structure**: Follow the existing controller/service/route pattern

**Code Style:**
```typescript
// Use explicit types
interface CheeseData {
  name: string;
  type: string;
  intensity: number;
}

// Prefer async/await over Promises
async function getCheeses(): Promise<CheeseData[]> {
  try {
    const result = await db.query('SELECT * FROM cheeses');
    return result.rows;
  } catch (error) {
    throw new Error(`Failed to fetch cheeses: ${error.message}`);
  }
}
```

### Frontend Guidelines

- **Language**: TypeScript + React
- **Build Tool**: Vite
- **Styling**: CSS modules or styled components
- **State Management**: React Context for auth, local state for components
- **API Communication**: Axios with proper error handling

**Code Style:**
```tsx
// Use functional components with hooks
interface CheeseListProps {
  cheeses: Cheese[];
  onSelect: (cheese: Cheese) => void;
}

export const CheeseList: React.FC<CheeseListProps> = ({ cheeses, onSelect }) => {
  const [loading, setLoading] = useState(false);
  
  // Component implementation
};
```

### Database Guidelines

- Use parameterized queries to prevent SQL injection
- Follow existing naming conventions (snake_case for columns)
- Add proper indexes for frequently queried columns
- Include database migrations for schema changes

## Testing

### Running Tests

```bash
# All tests
task test

# Individual services
task backend:test
task frontend:test

# Manual approach
cd backend && npm test
cd frontend && npm test
```

### Test Requirements

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints and database operations
- **Component Tests**: Test React components in isolation
- **Coverage**: Aim for >80% code coverage on new code

### Test Structure

```typescript
// Backend test example
describe('CheeseController', () => {
  describe('getCheeses', () => {
    it('should return list of cheeses', async () => {
      // Test implementation
    });
    
    it('should handle errors gracefully', async () => {
      // Error handling test
    });
  });
});
```

## Pull Request Process

### Before Submitting

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Ensure code quality:**
   ```bash
   task test          # All tests pass
   task lint          # No linting errors
   task build:all     # Builds successfully
   ```

3. **Test your changes:**
   ```bash
   task docker:up     # Start full environment
   task health        # Verify all services work
   # Test your feature manually
   ```

### PR Checklist

- [ ] Code follows the project's style guidelines
- [ ] Tests have been added for new functionality
- [ ] All tests pass (`task test`)
- [ ] No linting errors (`task lint`)
- [ ] Documentation has been updated if needed
- [ ] Builds successfully (`task build:all`)
- [ ] Changes have been tested manually

### PR Template

When creating a pull request, please include:

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass  
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes.

## Additional Notes
Any additional information or context.
```

## Project Structure

```
cheeseplatform/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Custom middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── config/         # Configuration
│   │   └── index.ts        # Entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # React/TypeScript frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── styles/         # CSS files
│   ├── package.json
│   └── vite.config.ts
├── docs/                   # Documentation
├── Taskfile.yml           # Task runner configuration
├── docker-compose.yml     # Docker services
└── README.md              # Project overview
```

## Getting Help

- **Documentation**: Check [README.md](README.md) and [TASKFILE.md](TASKFILE.md)
- **Issues**: Create an issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Discord**: [Join our Discord](#) (if available)

## Development Tips

### Useful Taskfile Commands

```bash
# Fresh start (when things go wrong)
task fresh

# Database operations
task db:reset              # Reset database
task db:backup             # Backup database
task db:connect            # Connect to database

# Debugging
task docker:logs:backend   # Backend logs
task docker:logs:frontend  # Frontend logs
task docker:logs:db        # Database logs
```

### Common Issues

1. **Port conflicts**: Make sure ports 3000, 3001, and 5432 are available
2. **Docker issues**: Try `task docker:clean` then `task docker:up`
3. **Database connection**: Ensure PostgreSQL is running (`task db:start`)
4. **Build failures**: Try `task clean` then `task install`

### Environment Variables

Key environment variables for development:

```bash
# Backend (.env)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cheeseplatform
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
```

## Code of Conduct

Please be respectful and inclusive in all interactions. We follow the standard open source code of conduct principles.

---

Thank you for contributing to the Cheese Platform! 🧀