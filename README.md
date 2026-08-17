# User Registration/Profile Demo

This app is ONLY for demonstration purposes and not suite for production.

## Technologies used:

- NextJS (+ React)
- Hono
- TypeORM (+ mysql2)
- Zod
- TailwindCSS

## Running the app

To start the app inside a Docker container, simply run `docker-compose up`.
This will start the NextJS/Hono app and a MySQL database connected to it.

Access the web app on `http://localhost:3000`.

To run the app while having it listen to code changes, you can use the dev container by running `docker compose -f compose.yaml -f compose.dev.yaml up`.