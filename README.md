# 🌤️ Weather Subscription app

A full-stack service for managing email subscriptions to weather updates.
Built with Fastify, Prisma, PostgreSQL, and a lightweight HTML/CSS/JS frontend.

## 🚀 Features Implemented

- **POST /subscribe** – Subscribe to weather updates (city + frequency)
- **GET /confirm/:token** – Confirm email subscription
- **GET /unsubscribe/:token** – Unsubscribe from weather updates
- **GET /weather?city=CityName** – Fetch current weather for a city
- **Simple HTML page to initiate the subscription
- **Sending confirmation emails (optional)
## 🧰 Tech Stack

- **Fastify** with TypeScript
- **Zod** – runtime validation for requests
- **Prisma ORM** – PostgreSQL integration
- **WeatherAPI.com** – external weather data source
- **Resend** – API based email provider

## 🐳 Run with Docker (recommended)

This project is fully Dockerized. You can run both the API and the PostgreSQL database with a single command:

```bash
1. In backend directory create a `.env` file according to env.example
2. docker compose up --build
```

This will:

- Start a **PostgreSQL** database container
- Automatically apply **Prisma migrations**
- Start the **Fastify backend** in development mode
- Mount the source code for live reload
- Start Frontend server

Once running, the API will be available at:

```
http://localhost:3000
```

HTML page will be available at:

```
http://localhost:8080
```

### 🛠 Manual Setup (optional)

1. In backend directory create a `.env` file according to env.example
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run a PostgreSQL database manually
4. Apply database migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run start:dev
   ```

## 🔍 API Overview

- **POST `/subscribe`** – Subscribe with email, city, and frequency
- **GET `/confirm/:token`** – Confirm the subscription
- **GET `/unsubscribe/:token`** – Cancel the subscription
- **GET `/weather?city=CityName`** – Fetch current weather for a specific city

All routes perform request validation via Zod schemas.


### ✅ Optional: Enable Email Confirmation

The project includes optional support for email confirmation using [Resend](https://resend.com/).  
To enable it:

1. Create a free account and API key
2. Add `RESEND_API_KEY=your_key` to your `.env` file

If not provided, the confirmation email will be skipped. To confirm the subscription manually, use a direct API call to the confirmation endpoint

## 🚧 Future Improvements (Out of Scope)

- ⏰ **Email delivery** (daily/hourly) to subscribers
- 🧪 **Rate limiting**, **testing**, and **logging improvements**
