# ===========================================
# Logi-Quiz Development Commands
# ===========================================

.PHONY: help setup up down restart build logs ps clean db-setup db-migrate db-seed db-reset console test lint

# Default target
help:
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "Setup:"
	@echo "  setup       - Initial setup (copy .env, build, db setup)"
	@echo "  build       - Build all containers"
	@echo ""
	@echo "Docker:"
	@echo "  up          - Start all containers"
	@echo "  down        - Stop all containers"
	@echo "  restart     - Restart all containers"
	@echo "  logs        - Show container logs (follow)"
	@echo "  ps          - Show container status"
	@echo "  clean       - Stop and remove containers, volumes"
	@echo ""
	@echo "Database:"
	@echo "  db-setup    - Create and migrate database"
	@echo "  db-migrate  - Run migrations"
	@echo "  db-seed     - Seed database"
	@echo "  db-reset    - Drop, create, migrate, seed"
	@echo ""
	@echo "Development:"
	@echo "  console     - Open Rails console"
	@echo "  bash-api    - Open bash in API container"
	@echo "  bash-front  - Open shell in frontend container"
	@echo "  test        - Run RSpec tests"
	@echo "  lint        - Run Rubocop"
	@echo ""

# ===========================================
# Setup
# ===========================================

setup:
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "Created .env from .env.example"; \
	fi
	@make build
	@make up
	@echo "Waiting for DB to be ready..."
	@sleep 10
	@make db-setup
	@echo ""
	@echo "Setup complete!"
	@echo "  Frontend: http://localhost:3000"
	@echo "  Backend:  http://localhost:3001"

build:
	docker-compose build

# ===========================================
# Docker
# ===========================================

up:
	docker-compose up -d
	@echo ""
	@echo "Services started:"
	@echo "  Frontend: http://localhost:3000"
	@echo "  Backend:  http://localhost:3001"
	@echo "  MySQL:    localhost:3306"
	@echo ""
	@echo "Use 'make logs' to view logs"

down:
	docker-compose down

restart:
	docker-compose restart

logs:
	docker-compose logs -f

logs-api:
	docker-compose logs -f api

logs-front:
	docker-compose logs -f front

ps:
	docker-compose ps

clean:
	docker-compose down -v --rmi local
	@echo "Containers and volumes removed"

# ===========================================
# Database
# ===========================================

db-setup:
	docker-compose exec api rails db:create db:migrate db:seed

db-migrate:
	docker-compose exec api rails db:migrate

db-seed:
	docker-compose exec api rails db:seed

db-reset:
	docker-compose exec api rails db:drop db:create db:migrate db:seed

# ===========================================
# Development
# ===========================================

console:
	docker-compose exec api rails c

bash-api:
	docker-compose exec api bash

bash-front:
	docker-compose exec front sh

test:
	docker-compose exec api bundle exec rspec

lint:
	docker-compose exec api bundle exec rubocop
