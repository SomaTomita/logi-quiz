# logi-quiz API (Rails)

For local development setup, see [../LOCAL_SETUP.md](../LOCAL_SETUP.md).

## Deployment

There is currently no CI/CD pipeline (see [issue #89](https://github.com/SomaTomita/logi-quiz/issues/89)). Production deploys are done manually via `scripts/deploy.sh`, which builds and pushes the `rails` and `nginx` images to ECR, registers a new ECS task definition, and updates the ECS service.

```bash
cp backend/.env.deploy.example backend/.env.deploy   # first time only, then fill in real values
cd backend
./scripts/deploy.sh          # build + push both images, register task definition, update service
./scripts/deploy.sh rails    # rebuild/push only the rails image
./scripts/deploy.sh deploy   # force a new deployment of the current task definition (no rebuild)
```

Run `./scripts/deploy.sh help` for the full command list.

### Database migrations

Migrations are **not** run automatically on deploy. `entrypoint.sh` intentionally skips `db:migrate` (running it from every task at boot would race across concurrently starting containers). Run migrations manually against the target database before or after deploying:

```bash
DATABASE_HOST=<rds-host> DATABASE_USERNAME=<user> DATABASE_PASSWORD=<pass> DATABASE_NAME=<db> \
  RAILS_ENV=production bundle exec rails db:migrate
```

### Rollback

**Known limitation:** images are pushed to ECR under the `:latest` tag only. Re-registering an older ECS task definition revision does *not* get you back the old code, since that revision still resolves to whatever `:latest` currently points to in ECR. A real rollback today requires manually re-tagging a previous image digest as `:latest` in ECR before forcing a new deployment. Moving to immutable per-deploy tags (e.g. git SHA) is tracked separately.
