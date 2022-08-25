# Storefront Backend Project
The app on port 3000 and the database on the standard 5432 port

## Getting Started
- install all modules `npm install`
- run lint `npm run lint`
- run auto fix lint errors  `npm run lint-fix`
- run test `npm run test`
- start app `npm run start`
- init database include all tables with relations `npm run db-up`
- drop all tables with relations `npm run db-down`

## Enviromental Variables Set up
the environmental variables that needs to be set in a `.env` file

- POSTGRES_HOST=
- POSTGRES_DB=
- POSTGRES_DB_dev=
- POSTGRES_USER=
- POSTGRES_PWD=
- ENV=
- BCRYPT_PASSWORD=
- SALT_ROUNDS=
- SECRET_TOKEN=

## Database
database on the standard 5432 port
you can start your migration by use the following command `npm run db-up`