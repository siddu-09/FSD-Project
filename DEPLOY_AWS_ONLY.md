# BookNest AWS-Only Deployment

This guide deploys BookNest entirely on AWS:

1. Frontend: AWS Amplify Hosting
2. Backend API: AWS App Runner
3. Database: AWS RDS PostgreSQL

## Architecture

- Amplify serves the React app from [client](client)
- App Runner runs the Node API from [server](server)
- RDS PostgreSQL stores app data

## 1) Create AWS RDS PostgreSQL

1. Open AWS RDS and create a PostgreSQL instance.
2. Place RDS in a VPC/subnets that App Runner can access.
3. Create a DB and user for BookNest.
4. Save the connection string as:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME?schema=public
```

## 2) Prisma Status

Prisma is already configured for PostgreSQL in [server/prisma/schema.prisma](server/prisma/schema.prisma), and migration files are ready for Postgres.

At deploy time, App Runner runs:

```bash
npm run prisma:migrate:deploy
```

## 3) Deploy Backend on App Runner

You already have [apprunner.yaml](apprunner.yaml).

1. Open AWS App Runner -> Create Service -> Source code repository.
2. Connect your GitHub repo.
3. Select configuration source file and use [apprunner.yaml](apprunner.yaml).
4. Add environment variables in App Runner:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `CORS_ORIGIN` (Amplify domain, for example `https://main.d123abc.amplifyapp.com`)
   - Optional Cloudinary vars
5. Deploy.

Backend health URL:

- `https://<app-runner-domain>/health`

## 4) Deploy Frontend on Amplify

You already have [amplify.yml](amplify.yml).

1. Open AWS Amplify -> New app -> Host web app.
2. Connect the same GitHub repository.
3. Keep app root as `client` (already in [amplify.yml](amplify.yml)).
4. Add environment variable:
   - `VITE_API_URL=https://<app-runner-domain>/api`
5. Deploy.

## 5) Configure CORS

Set API `CORS_ORIGIN` on App Runner to the exact Amplify URL.

For multiple domains, use comma-separated values:

```env
CORS_ORIGIN=https://main.d123abc.amplifyapp.com,https://booknest.yourdomain.com
```

## 6) Seed Data (Optional)

After App Runner is running and migrations are done, seed books once from local or CI:

```bash
cd server
DATABASE_URL="postgresql://..." npm run seed
```

## 7) Smoke Test

1. Open backend `/health` endpoint.
2. Open Amplify frontend URL.
3. Register/login.
4. Open catalog and place order.

## Notes

- [server/Dockerfile](server/Dockerfile) is ready if you later deploy via ECR/ECS.
- If App Runner runs migrations at startup, keep migration scripts idempotent.
- Keep `JWT_SECRET` long and random in production.
