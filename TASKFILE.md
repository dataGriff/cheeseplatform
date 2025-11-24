# 🧀 Cheese Platform - Quick Start with Taskfile

This project includes a comprehensive Taskfile to make development easier. The Taskfile contains all the common commands you'll need.

## Installation

The Taskfile requires [Task](https://taskfile.dev/) to be installed. If you're in the dev container, Task is already available.

## Quick Commands

```bash
# Show all available tasks
task

# Get detailed help
task help

# Start everything with Docker (recommended for development)
task docker:up

# Set up local development environment
task dev:setup

# Start both backend and frontend in development mode
task dev:all

# View service status
task status

# View logs
task logs

# Stop everything
task docker:down
```

## Development Workflow

### Option 1: Full Docker Development (Recommended)
```bash
task docker:up    # Start all services including database
```

### Option 2: Local Development with Docker Database
```bash
task dev:setup   # Install deps and start database
task dev:all     # Start backend and frontend locally
```

### Option 3: Individual Services
```bash
task db:start         # Start only database
task backend:dev      # Start backend in dev mode
task frontend:dev     # Start frontend in dev mode
```

## Common Tasks

| Task | Description |
|------|-------------|
| `task docker:up` | Start all services with Docker |
| `task docker:down` | Stop all Docker services |
| `task docker:logs` | View logs from all services |
| `task dev:setup` | Set up development environment |
| `task install` | Install all dependencies |
| `task build:all` | Build backend and frontend |
| `task test` | Run all tests |
| `task clean` | Clean build artifacts |
| `task db:connect` | Connect to PostgreSQL |
| `task health` | Check service health |

## Shortcuts

- `task up` → `task docker:up`
- `task down` → `task docker:down`  
- `task logs` → `task docker:logs`
- `task be` → `task backend:dev`
- `task fe` → `task frontend:dev`

## Service URLs

When running, the services are available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Database**: localhost:5432 (postgres/postgres)

## Getting Started

1. **Quick start with Docker:**
   ```bash
   task docker:up
   ```

2. **Development setup:**
   ```bash
   task dev:setup
   task dev:all
   ```

3. **Check everything is working:**
   ```bash
   task health
   ```

For more commands, run `task help` or just `task` to see all available tasks.