# PetCareX – Pet Care Chain Management System

[![Node.js](https://img.shields.io/badge/Node.js-16.x+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-lightgrey.svg)](https://expressjs.com/)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-2019+-red.svg)](https://www.microsoft.com/sql-server)

## Introduction

PetCareX is a full-stack web application developed for managing operations across a multi-branch pet care business. The system integrates appointment scheduling, medical record management, vaccination tracking, product sales, loyalty programs, and administrative reporting into a unified platform.

The project was developed as part of the Advanced Database Systems course at the University of Science, VNU-HCM. Beyond delivering business functionalities, the project focused on designing a scalable database architecture, implementing database-level business rules, and optimizing performance for large datasets.

---

## Project Overview

The system supports three primary user groups:

### Customers

Customers can register and manage pet profiles, schedule appointments, purchase products and services, track loyalty points, and access their medical and transaction histories.

### Staff

Staff members manage appointments, customer requests, medical records, vaccination information, invoices, inventory, and branch operations.

### Administrators

Administrators oversee system-wide operations, including branch management, employee management, product and service catalogues, promotional campaigns, membership programs, and business reporting.

---

## System Architecture

The application follows a client-server architecture consisting of three primary layers:

### Frontend Layer

Built using React.js and Tailwind CSS, the frontend provides responsive user interfaces for customers, staff, and administrators.

Key responsibilities include:

* User interaction and presentation
* State management
* Form validation
* API communication

### Backend Layer

Implemented with Node.js and Express.js, the backend exposes RESTful APIs responsible for:

* Authentication and authorization
* Business logic processing
* Data validation
* Transaction management
* System integration

### Database Layer

Microsoft SQL Server serves as the primary data store.

The database architecture supports:

* Appointment management
* Medical records
* Vaccination tracking
* Product inventory
* Billing and invoicing
* Membership programs
* Reporting and analytics

To improve scalability and performance, indexing and partitioning strategies were implemented on large-volume tables containing more than 70,000 records.

---

## Technology Stack

| Category         | Technologies                 |
| ---------------- | ---------------------------- |
| Frontend         | React.js, Vite, Tailwind CSS |
| Backend          | Node.js, Express.js          |
| Database         | Microsoft SQL Server         |
| Authentication   | JWT                          |
| State Management | Zustand                      |
| Data Access      | mssql                        |
| Deployment       | Azure, Vercel                |
| Version Control  | Git, GitHub                  |

---

## Core Functionalities

### Appointment Management

* Appointment scheduling
* Branch-based service booking
* Vaccination registration
* Appointment tracking

### Medical Services

* Medical record management
* Treatment history
* Vaccination tracking
* Service feedback

### Product and Inventory Management

* Product catalogue management
* Inventory monitoring
* Purchase processing
* Invoice generation

### Membership Program

* Loyalty point accumulation
* Membership tier classification
* Promotional discounts
* Customer rewards

### Reporting and Analytics

* Revenue analysis
* Customer statistics
* Product performance
* Service utilization reports

---

## Business Workflows

### Appointment Booking Workflow

1. Customers select a branch and service.
2. The system validates appointment availability.
3. An appointment is created and assigned to the selected branch.
4. Staff process and complete the appointment.
5. Medical records and invoices are generated automatically.

### Membership Workflow

1. Customers accumulate points through purchases and services.
2. Membership tiers are updated based on spending activity.
3. Applicable benefits and discounts are automatically applied.

### Billing Workflow

1. Products and services are added to an invoice.
2. Promotional discounts are applied.
3. Membership discounts are calculated.
4. Reward points are recorded.
5. Payment information is stored in the system.

---

## Database Design

The database was designed through conceptual, logical, and physical modelling stages.

Key database techniques applied include:

* Relational database modelling
* Primary and foreign key constraints
* Stored procedures
* Triggers
* User-defined functions
* Data validation rules
* Indexing
* Table partitioning

These mechanisms ensure both data integrity and system performance under increasing workload.

---

## Project Structure

```
Project_CSDLNC/
├── 📁 backend/                    # Backend API Server
│   ├── package.json              # Dependencies: express, mssql, jwt, bcryptjs
│   ├── test-db-connection.js     # Database connection tester
│   └── src/
│       ├── server.js             # Entry point, Express app setup
│       ├── config/
│       │   ├── constants.js      # System constants
│       │   └── database.js       # MSSQL connection pool config
│       ├── middlewares/
│       │   ├── auth.js          # JWT authentication middleware
│       │   ├── errorHandler.js  # Global error handling
│       │   └── validate.js      # Request validation middleware
│       └── modules/              # Business logic modules (14 modules)
│           ├── auth/            # Authentication & Authorization
│           ├── customers/       # Customer management
│           ├── pets/            # Pet registration & management
│           ├── branches/        # Branch management
│           ├── employees/       # Employee management
│           ├── appointments/    # Appointment scheduling
│           ├── medical/         # Medical records
│           ├── vaccinations/    # Vaccination tracking
│           ├── products/        # Product catalog
│           ├── invoices/        # Invoice & billing
│           ├── promotions/      # Promotions & discounts
│           ├── ratings/         # Service ratings
│           ├── reports/         # Analytics & reports
│           └── services/        # Service definitions
│
├── 📁 frontend/                   # React SPA
│   ├── package.json              # Dependencies: react, vite, tailwind
│   ├── vite.config.js            # Vite configuration
│   ├── tailwind.config.js        # Tailwind CSS config
│   ├── index.html                # HTML entry point
│   └── src/
│       ├── main.jsx              # React entry point
│       ├── App.jsx               # Root component, routing
│       ├── index.css             # Global styles
│       ├── api/
│       │   ├── axios.js         # Axios instance with interceptors
│       │   └── services.js      # API service functions
│       ├── components/
│       │   ├── layout/          # Header, Sidebar, Footer
│       │   ├── staff/           # Staff-specific components
│       │   └── ui/              # Reusable UI components (shadcn/ui)
│       ├── context/
│       │   └── AuthContext.jsx  # Authentication context
│       ├── lib/
│       │   ├── toast.js         # Toast notifications
│       │   └── utils.ts         # Utility functions (cn, etc.)
│       ├── pages/               # Route pages (21+ pages)
│       │   ├── login/           # Login page
│       │   ├── register/        # Registration page
│       │   ├── customer/        # Customer dashboard & features
│       │   ├── staff/           # Staff pages (invoices, schedule)
│       │   ├── admin/           # Admin panel
│       │   ├── appointments/    # Booking appointments
│       │   ├── pets/            # Pet management
│       │   ├── products/        # Product catalog
│       │   ├── services/        # Service listings
│       │   └── ...              # Other feature pages
│       └── store/
│           ├── authStore.js     # Auth state (Zustand)
│           ├── cartStore.js     # Shopping cart state
│           └── toastStore.js    # Toast notification state
│
└── README.md                     # This file
```


## Team Members

| Student ID | Full Name             |
|  23120189  | Hoàng Quốc Việt       |
|  23120193  | Trần Kim Yến          |
|  23120209  | Lê Hoàng Nhật Anh     |
|  23120237  | Lê Lâm Trí Đức        |
|  23120242  | Nguyễn Văn Bình Dương |

---

## Installation

### Prerequisites

* Node.js 16+
* Microsoft SQL Server
* npm

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Database

1. Create a SQL Server database.
2. Execute the provided SQL scripts.
3. Configure database connection settings.
4. Start the backend and frontend services.

---

## Academic Information

Course: Advanced Database Systems

Institution: University of Science, VNU-HCM

Project Type: Academic Team Project

Project Score: 9.6 / 10.0
