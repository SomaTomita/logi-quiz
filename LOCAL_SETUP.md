# Local Development Setup

## Prerequisites

- Docker Desktop installed
- Make installed (comes with Xcode Command Line Tools on macOS)

## Quick Start

```bash
# Clone and setup everything
git clone https://github.com/SomaTomita/logi-quiz.git
cd logi-quiz
make setup
```

That's it! The `make setup` command will:
1. Create `.env` from `.env.example`
2. Build all containers
3. Start all services
4. Setup database (create, migrate, seed)

## Access

| Service | URL |
|:--|:--|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001 |
| MySQL | localhost:3306 |

## Common Commands

```bash
make help      # Show all available commands

make up        # Start containers
make down      # Stop containers
make logs      # View logs
make restart   # Restart containers

make console   # Rails console
make test      # Run tests
make db-reset  # Reset database
```

## File Structure

```
logi-quiz/
├── .env.example              # Environment template
├── .env                      # Your local env (git ignored)
├── docker-compose.yml        # Base config (api + db)
├── docker-compose.override.yml  # Dev config (adds frontend)
├── Makefile                  # Dev commands
├── backend/                  # Rails API
└── frontend/                 # React App
```

## Environment Variables

Copy `.env.example` to `.env` and adjust if needed:

```bash
cp .env.example .env
```

| Variable | Default | Description |
|:--|:--|:--|
| DATABASE_PASSWORD | password | MySQL root password |
| DATABASE_NAME | api_development | Database name |
| REACT_APP_API_URL | http://localhost:3001 | API URL for frontend |

## Test Account

| Email | Password |
|:--|:--|
| example@example.com | password123 |

## Troubleshooting

### Port already in use

```bash
# Check what's using the port
lsof -i :3000
lsof -i :3001

# Kill process
kill -9 <PID>
```

### Reset everything

```bash
make clean    # Remove containers and volumes
make setup    # Start fresh
```

### M1/M2 Mac issues

If MySQL fails to start, add platform to docker-compose.yml:

```yaml
db:
  platform: linux/amd64
```
