# Weather App – System Design

## Технології

- **Backend:** Node.js (Fastify)
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Hosting:** Render Cloud Services
- **Email Service:** Resend
- **Weather API Provider:** Weather API

---

## Функціональні вимоги

1. Користувач може підписатися на email-розсилку прогнозу погоди:
   - `HOURLY` або `DAILY`
   - Для конкретного міста
2. Користувач отримує email з актуальним прогнозом у заданий час
3. Система підтримує підтвердження підписки (через токен)
4. Система надає користувачу можливість відписатись від розсилки

---

## Нефункціональні вимоги

1. **Масштабованість:** Підтримка великої кількості користувачів із частими розсилками
2. **Доступність:** Сервер має бути доступний 24/7
3. **Продуктивність:** Розсилки виконуються швидко, з обробкою помилок
4. **Безпека:** Валідація вхідних даних

---

## Mermaid Diagram – Архітектура додатку

```mermaid
graph TD

  subgraph System
    U["User (Browser)"]
    A1["POST /subscribe"]
    A2["GET /confirm"]
    A3["Cron Jobs (node-cron)"]
    A4["Weather Service"]
    A5["Email Sender (Resend)"]
    DB[("PostgreSQL Database")]
    WAPI["Weather API"]
    RESEND["Resend SMTP Service"]
  end

  U -->|Request| A1
  A1 -->|Stores Data| DB
  U -->|Confirmation| A2
  A2 --> DB

  A3 -->|Runs Tasks| DB
  A3 -->|Fetch Weather| A4
  A4 -->|API Call| WAPI
  A4 -->|Weather Data| A5
  A5 -->|Send Email| RESEND


```

---

## Потенційні розширення

- Авторизація через email/Google
- Кешування запитів до стороннього погодного API
- Відстеження успішності/невдач розсилок
- Налаштування лімітів використання API

