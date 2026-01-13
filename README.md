# 🎁 Chinggizz - Customised Gifts Platform

A modern e-commerce platform for customised gifts, edibles, and surprise hampers with an interactive 3D hamper builder.

---

## ✨ Features

### 🛍️ Customer Features
- Browse products by categories (Customised Items, Edibles, Hampers)
- **Interactive 3D Hamper Builder** - Drag & drop products into 3D gift boxes
- Product customization (text, images, colors)
- Guest checkout (no registration required)
- WhatsApp order confirmation
- Real-time shopping cart

### 👨‍💼 Admin Features
- Manage categories, products, and hamper boxes
- View and manage orders
- Update order status workflow
- Upload product images

---

## 🛠️ Tech Stack

**Backend:** Java 21, Spring Boot 3.3.0, Spring Security (JWT)
**Frontend:** React 18, Vite, Tailwind CSS, React DnD, Three.js
**Database:** Supabase PostgreSQL (Cloud) - Production-Ready

---

## 🚀 Quick Start

### Prerequisites
- Java 21+
- Maven 3.6+
- Node.js 18+
- Supabase account (free tier available at [supabase.com](https://supabase.com))

### 1. Setup Supabase Database

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Go to **Settings → Database** and copy your connection details
3. Run the database schema:
   - Open **SQL Editor** in Supabase dashboard
   - Copy and paste content from `database/schema-postgres.sql`
   - Execute the script
4. Load sample data:
   - Copy and paste content from `database/sample-data-postgres.sql`
   - Execute the script

### 2. Configure Backend

Update `src/main/resources/application-supabase.yml` with your Supabase credentials:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://[YOUR-PROJECT].pooler.supabase.com:5432/postgres
    username: postgres.[YOUR-PROJECT]
    password: [YOUR-PASSWORD]
```

### 3. Start Backend

```bash
# Run with Supabase (default)
run-chinggizz.bat

# Or use Maven directly
mvn spring-boot:run
```

Backend will start on: **http://localhost:8080**

### 4. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will start on: **http://localhost:5173**

---

## 🔑 Default Admin Credentials

- **Username:** `admin`
- **Password:** `admin123`

---

## 📡 API Endpoints

### Public APIs (No Authentication)
- `GET /api/categories` - Get all categories
- `GET /api/products` - Get all products
- `GET /api/hamper-boxes` - Get hamper boxes
- `POST /api/orders/create` - Create order

### Admin APIs (JWT Required)
- `POST /api/auth/login` - Admin login
- `GET /api/orders` - Get all orders
- `PUT /api/orders/{id}/status` - Update order status
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

Full API documentation: See `API_DOCUMENTATION.md`

---

## 📁 Project Structure

```
chinggizz/
├── src/main/java/com/chinggizz/
│   ├── config/          # Security, CORS, Data initialization
│   ├── controller/      # REST API controllers
│   ├── dto/             # Data Transfer Objects
│   ├── entity/          # JPA entities
│   ├── enums/           # Enums (OrderStatus, ProductType)
│   ├── exception/       # Exception handling
│   ├── repository/      # Spring Data repositories
│   ├── security/        # JWT authentication
│   ├── service/         # Business logic
│   └── util/            # Utilities (JWT, Order number generator)
├── src/main/resources/
│   ├── application.yml              # Main config
│   ├── application-supabase.yml     # Supabase config
│   └── application-dev.yml          # H2 local testing
├── database/
│   ├── schema-postgres.sql          # Database schema
│   └── sample-data-postgres.sql     # Sample data
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context (Cart)
│   │   └── config/      # API & WhatsApp config
│   └── package.json
├── pom.xml              # Maven dependencies
└── run-chinggizz.bat    # Startup script
```

---

## 🎯 Key Technologies

- **Spring Boot 3.3.0** - Backend framework
- **Spring Security + JWT** - Authentication
- **Spring Data JPA** - Database ORM
- **Supabase PostgreSQL** - Cloud database
- **React 18** - Frontend framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Three.js** - 3D hamper builder
- **React DnD** - Drag and drop

---

## 📝 License

This project is proprietary software. All rights reserved.

---

## 🆘 Support

For issues or questions, please contact the development team.

