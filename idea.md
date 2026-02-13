# � BookStore - Project Master Plan

**Project Goal**: A high-performance, full-stack ecommerce application specifically designed for selling books, focusing on a vast catalog, searchability, and a cozy user experience.
**Philosophy**: "Discover your next great read."

---

## 🏗️ Technical Architecture

### 1. Frontend: Customer Facing & Admin Dashboard
- **Framework**: React 18 (via Vite).
- **State Management**: React Context API (Auth, Cart, Toast).
- **HTTP Client**: Axios.
- **Routing**: React Router DOM v6.

### 2. Backend: API Layer
- **Runtime**: Node.js.
- **Framework**: Express.js.
- **Image Handling**: Cloudinary (for book covers).

### 3. Database & Data Layer
- **Database**: PostgreSQL.
- **ORM**: Prisma.
- **Hosting**: Render.

### 4. Authentication & Security
- **Strategy**: JWT.
- **Flow**: Login -> accessToken. RBAC for Admin.
- **Passwords**: bcryptjs.

---

## 💾 Database Schema Design (Prisma)

### `User`
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary Key |
| email | String | Unique |
| password | String | Hashed |
| role | Enum | `CUSTOMER`, `ADMIN` |
| createdAt | DateTime | |

### `Book` (Product)
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary Key |
| title | String | Book Title |
| author | String | Author Name |
| description | Text | Synipsos/Details |
| price | Decimal | Final Price |
| originalPrice | Decimal | MRP (optional) |
| image | String | Book Cover URL |
| category | String | Genre/Category |
| rating | String | Average Rating (e.g. "4.5 out of 5") |
| stock | Int | Inventory |
| createdAt | DateTime | |

### `Order`
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary Key |
| userId | UUID | FK |
| status | Enum | Order Status |
| total | Decimal | |
| createdAt | DateTime | |

### `OrderItem`
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary Key |
| orderId | UUID | FK |
| bookId | UUID | FK |
| quantity | Int | |
| price | Decimal | |

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Books
- `GET /api/books` - List with filter (Author, Genre, Price).
- `GET /api/books/:id` - Details.
- `POST /api/books` - Admin Add.
- `PUT /api/books/:id` - Admin Update.
- `DELETE /api/books/:id` - Admin Delete.

### Orders
- `POST /api/orders` - Checkout.
- `GET /api/orders/my-orders` - History.
- `GET /api/orders` - Admin View All.

---

## 🎨 UI/UX Features

1.  **Bookish Aesthetic**: Warm colors, serif fonts for readability.
2.  **Search & Filter**: Robust filtering by Author, Genre, Rating.
3.  **Book Details**: Prominent cover, synopsis, "About the Author".
4.  **Cart & Checkout**: Seamless process.
5.  **Reviews**: User ratings and reviews.
