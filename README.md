# ShopStream — Frontend E-Commerce

A responsive e-commerce frontend built with **React** and **React Bootstrap**, connected to the **[DummyJSON](https://dummyjson.com)** API. It covers authentication, product browsing with search, filtering, sorting and pagination, cart management, user management, and an admin dashboard with full CRUD for products, carts and users.

**Live demo:** https://shopstream-zeta.vercel.app

## Demo accounts

| Role  | Username        | Password        | Dashboard access |
|-------|-----------------|-----------------|------------------|
| Admin | `emilys`        | `emilyspass`    | Yes              |
| User  | `USER_USERNAME` | `USER_PASSWORD` | No               |

Any other DummyJSON user also works. Credentials are listed at <https://dummyjson.com/users?select=username,password,role>. You can sign in with a username or an email address.

## Features

### Authentication
- Login with input validation (username or email + password)
- Mock registration flow (DummyJSON `/users/add`)
- Token stored in `localStorage`, so the session survives page reloads
- Authenticated user data fetched from `/auth/me` (Profile page and dashboard)
- Protected routes for the cart, profile and dashboard
- Role-based access: only admins can open the dashboard

### Products (store)
- Product grid using the "Get All Products" endpoint
- Product details page with image gallery, specifications and reviews
- Search, category filter and sorting by price, rating or title
- Pagination with `limit` and `skip`
- Categories page listing all product categories

### Carts
- Shopping cart for the signed-in user (fetched by user ID)
- Add to cart, change quantities and remove items, with live totals
- Cart item count badge in the navbar

### Dashboard (admin)
- Overview with summary widgets: total products, users and carts
- **Products:** table, search, pagination, add / edit / delete
- **Carts:** table, pagination, filter by user ID, cart details, add / edit / delete
- **Users:** table, search, filter by role or gender, pagination, user details, add / edit / delete
- **Authentication:** current session and signed-in user details

### Design
- Built with React Bootstrap, following the provided Figma design
- Fully responsive (desktop, tablet and mobile)
- Accessibility: labelled controls, keyboard navigation, a skip link and page titles

## Tech stack

- [React](https://react.dev) 19
- [React Bootstrap](https://react-bootstrap.github.io) + [Bootstrap](https://getbootstrap.com) 5
- [React Router](https://reactrouter.com) (`react-router-dom`)
- [React Bootstrap Icons](https://github.com/ismamz/react-bootstrap-icons)
- [Vite](https://vite.dev) (build tool)
- [DummyJSON](https://dummyjson.com) (REST API)
- Deployed on [Vercel](https://vercel.com)

## Getting started

**Requirements:** Node.js 20.19+ or 22.12+, and npm.

```bash
git clone https://github.com/daniayasser7/shopstream.git
cd shopstream
npm install
npm run dev
```

Then open <http://localhost:5173>.

| Command           | Description                      |
|-------------------|----------------------------------|
| `npm run dev`     | Start the development server     |
| `npm run build`   | Build for production into `dist` |
| `npm run preview` | Preview the production build     |
| `npm run lint`    | Check the code with ESLint       |

## Project structure

```
src/
├── api/          # API calls (client, auth, products, carts, users, stats)
├── components/
│   ├── common/   # Reusable UI (form fields, loader, pagination, modals…)
│   ├── layout/   # Navbar, footer, sidebar, store and dashboard layouts
│   ├── products/ # Product card, table, filters, gallery, form
│   ├── carts/    # Cart item, summary, table, form, details
│   └── users/    # User table, avatar, role badge, form, details
├── context/      # Auth and cart state (React Context)
├── hooks/        # useAuth, useCart, useFetch, useLocalChanges
├── pages/        # Store, auth and dashboard pages
├── routes/       # ProtectedRoute and AdminRoute guards
├── styles/       # Theme and component styles
└── utils/        # Price formatting and permissions
```

## Notes and known issues

- **DummyJSON simulates write operations.** Add, update and delete requests return realistic responses, but nothing is saved on the server. The app keeps your changes in memory so they are visible during the session; they reset when the page is reloaded.
- **Registration is a mock flow.** New accounts are confirmed by the API but cannot sign in. Use a demo account instead.
- **Email login:** DummyJSON only accepts usernames, so the app looks up the username for an email address before signing in.
- **Search and category filter don't combine,** because DummyJSON uses separate endpoints for them. Choosing a category clears the search, and vice versa.
- **Store cart changes reset on reload,** for the same reason as other write operations.
- **Dashboard totals** come straight from the API and don't include changes made during the session.
- **Image upload** isn't supported by DummyJSON, so products use an image URL field instead.