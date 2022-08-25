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
Create Databases

We shall create the dev and test database.

    connect to the default postgres database as the server's root user psql -U postgres
    In psql run the following to create a user
        `CREATE USER shopping_user WITH PASSWORD 'password';`
    In psql run the following to create the dev and test database
        `CREATE DATABASE test;`
        `CREATE DATABASE dev;`
    Connect to the databases and grant all privileges
        Grant for dev database
            \c shopping
            `GRANT ALL PRIVILEGES ON DATABASE dev TO shopping_user;`
        Grant for test database
            \c shopping_test
            `GRANT ALL PRIVILEGES ON DATABASE test TO shopping_user;`

you can start your migration by use the following command `npm run db-up`
