# REQUIREMENTS.md

This file documents the API routes, database schema, and any non-default choices.

## API Routes (RESTful + HTTP verbs)

- [ ] **Users**
  - [ ] POST `/users` → create (public) — returns JWT
  - [ ] GET `/users` → index (secure, JWT)
  - [ ] GET `/users/:id` → show (secure, JWT)
  - [ ] POST `/users/authenticate` → login (public) — returns JWT

- [ ] **Products**
  - [ ] GET `/products` → index
  - [ ] GET `/products/:id` → show
  - [ ] POST `/products` → create (secure, JWT)

- [ ] **Orders**
  - [ ] GET `/orders/:user_id/current` → current order by user (secure)
  - [ ] POST `/orders` → create (secure)
  - [ ] POST `/orders/:id/products` → add product to order (secure)

(Adjust the above to match your project.) Each route uses the correct HTTP verb.

## Database Schema

- `users`:
  - `id SERIAL PRIMARY KEY`
  - `first_name VARCHAR(100)`
  - `last_name  VARCHAR(100)`
  - `email VARCHAR(255) UNIQUE NOT NULL`
  - `password_digest TEXT NOT NULL`
  - timestamps

Add additional tables as needed (`products`, `orders`, `order_products` etc.).

## Data Shapes (TypeScript)

```ts
export type User = {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  password?: string; // plaintext only when creating
};
```

## Security
- Passwords are hashed with **bcrypt** and a **salt** + **pepper**.
- JWT is issued per user and validated on secure routes.
- Secrets are read from environment variables.
