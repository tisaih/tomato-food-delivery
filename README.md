# tomato-food-delivery-app

Tomato app is a full-stack system build in ~~M~~ERN.js integrated with PostgreSQL which aims to offer a customer a range of food products to order. Then the customer can choose and order a menu build on its own.

The main features are:

- Complete guidance on the UI for the ordering process.
- 2 different roles (Role Based Access Control):
  - `Manager`: Can process the orders received in Real time, view a history, add new restaurants and new meals. Can change the order status.
  - `User`: Can order from the restaurants. Also view a orders history.
- Use of `state-machine` to validate transitions of order status.
- Follow React and Node.js best practices.

## Getting Started

Choose the stack you would like to use according to the branch:

- `master`: Using mongodb
- `postgresql`: Using postgresql
- `postgresql-docker`: Using postgresql with docker 

## Quick Start

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

```javascript
// Install dependencies for server & client
npm install && npm run client-install

// Run client & server with concurrently
npm run dev

// Server runs on http://localhost:5000 and client on http://localhost:3000
```

## The stack

- [React](https://reactjs.org) and [React Router](https://reacttraining.com/react-router/) for frontend.
- [Express](http://expressjs.com/) and [Node](https://nodejs.org/en/) for the backend.
- [PostgreSQL](https://www.postgresql.org/) for the database.
- [Redux](https://redux.js.org/basics/usagewithreact) for state management between React components.

## Demo

### Create Restaurant (Role: Manager)

![manager-login](https://recordit.co/CZ2wDzk7O4.gif)

### Order Food (Role: User)

Let's order food from the above restaurant.

![user-login](http://g.recordit.co/lFgzrDYcxY.gif)

## Configuration

Make sure to add your own `SETTINGS` from your database in `.env`.