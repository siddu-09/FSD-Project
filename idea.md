# 🛍️ SwiftShop - Project Master Plan

**Project Goal**: A high-performance, full-stack ecommerce application focusing on speed, security, and a premium user experience.
**Philosophy**: "Simple to use, powerful to manage."

---

## 🏗️ Technical Architecture

### 1. Frontend: Customer Facing & Admin Dashboard
- **Framework**: React 18 (via Vite) used for both the store and the admin panel.
- **State Management**: React Context API (for Auth, Cart, Toast Notifications).
- **HTTP Client**: Axios (with interceptors for JWT token attachment).
- **Routing**: React Router DOM v6.

### 2. Backend: API Layer
- **Runtime**: Node.js.
- **Framework**: Express.js.
- **Image Handling**: Multer (for parsing) + Cloudinary SDK (for storage).

### 3. Database & Data Layer
- **Database**: PostgreSQL (Relational integrity is crucial for ecommerce).
- **ORM**: Prisma (Type-safety, migration management, and clean query API).
- **Hosting**: Render (Backend & DB).

### 4. Authentication & Security
- **Strategy**: JWT (JSON Web Tokens).
- **Flow**:
    - `POST /login` -> Returns `accessToken` (short-lived).
    - Role-Based Access Control (RBAC) middleware protects Admin routes.
- **Passwords**: Hashed using `bcryptjs`.

---

## 💾 Database Schema Design (Prisma)

We will implement the following core models:

### `User`
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary Key |
| email | String | Unique, Indexed |
| password | String | Hashed |
| name | String | Full name |
| role | Enum | `CUSTOMER` (default) or `ADMIN` |
| createdAt | DateTime | |

### `Product`
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary Key |
| name | String | Product title |
| description | Text | Full details |
| price | Decimal | Precision money handling |
| stock | Int | Inventory count |
| category | String | Simple categorization |
| images | String[] | Array of Cloudinary URLs |
| createdAt | DateTime | |

### `Order`
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary Key |
| userId | UUID | FK to User |
| status | Enum | `PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED` |
| total | Decimal | Snapshot of total cost |
| createdAt | DateTime | |

### `OrderItem`
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary Key |
| orderId | UUID | FK to Order |
| productId | UUID | FK to Product |
| quantity | Int | |
| price | Decimal | Snapshot of price at time of purchase |

---

## 🔌 API Endpoints Structure

### Authentication
- `POST /api/auth/register` - Create new user.
- `POST /api/auth/login` - Authenticate and receive token.
- `GET /api/auth/me` - Get current user profile (Protected).

### Products (Public)
- `GET /api/products` - List all products (with filtering/search).
- `GET /api/products/:id` - Get single product details.

### Products (Admin Only)
- `POST /api/products` - Create new product (supports image upload).
- `PUT /api/products/:id` - Update product.
- `DELETE /api/products/:id` - Remove product.

### Global Admin Actions
- `POST /api/upload` - Helper endpoint to upload images to Cloudinary.

### Orders
- `POST /api/orders` - specific user creates an order (Protected).
- `GET /api/orders/my-orders` - Customer views their history.
- `GET /api/orders` - Admin views ALL orders.
- `PATCH /api/orders/:id/status` - Admin updates order status.

---

## 🎨 UI/UX Features (The "Premium" Touch)

1.  **Glassmorphism Navbar**: Sticky, blurred background effect.
2.  **Hero Section**: Large, immersive imagery with clear Call-to-Action.
3.  **Product Cards**:
    - Hover effects (scale up, shadow deepen).
    - "Quick Add" button visible on hover.
4.  **Cart Drawer**: Slides in from the right instead of a separate page (smoother UX).
5.  **Toast Notifications**: Beautiful, animated success/error messages (e.g., "Item added to cart").

---

## 📦 Implementation Steps

1.  **Setup**: Initialize Repo, Node, and React apps.
2.  **DB**: Configure Postgres + Prisma Schema -> Run Migrations.
3.  **Backend Core**: Express setup + Auth Middleware + Error Handling.
4.  **Backend Feat**: CRUD for Products & Image Uploads.
5.  **Frontend Core**: Router + Context + Base CSS Variables.
6.  **Frontend Components**: Navbar, Hero, ProductGrid.
7.  **Integration**: Fetch data from API, handle Auth states.
8.  **Checkout**: Cart logic -> Order creation.
9.  **Deployment**: Push to Vercel/Render.

