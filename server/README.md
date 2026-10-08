# Suvvidha Server

Express backend for the Suvvidha MERN application.

## Setup

```bash
cd /home/runner/work/new-suvvidha/new-suvvidha/server
npm install
cp .env.example .env
```

Update `.env` with real values before running.

## Run (development)

```bash
npm run dev
```

## Run (production)

```bash
NODE_ENV=production npm start
```

## Build client for production serving

From the server directory:

```bash
npm run build-client
```

The server serves React static assets from `../client/build` when `NODE_ENV=production`.
