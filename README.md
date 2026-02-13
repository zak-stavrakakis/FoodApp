->Food Ordering App

-Full-Stack Role-Based Food Ordering System

-Overview

 A full-stack food ordering application built with React, Redux, Node.js, Express, and PostgreSQL.
 The system implements secure authentication, role-based authorization, persistent cart management, and normalized relational database design.

->Key Features

-User
-JWT-based authentication
-Add/update items in cart
-Persistent cart stored in PostgreSQL
-Place orders with shipping details

-Admin

-Update meals
-Role-based access control
-Restricted from placing orders

->Tech Stack

-Frontend
-React
-Redux
-React Router
-Backend
-Node.js
-Express
-JWT Authentication
-Role-based middleware
-Database
-PostgreSQL
-Normalized relational schema
-Data integrity constraints

->Architecture

React Client
⬇
Express REST API
⬇
PostgreSQL

-JWT secures protected routes
-Middleware enforces role authorization
-Cart and orders persisted server-side

->Database Schema

-users
CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP, 
    role text DEFAULT 'user'::text NOT NULL
);

-meals
CREATE TABLE public.meals (
    id text NOT NULL,
    name text NOT NULL,
    price numeric(5,2) NOT NULL,
    description text,
    image text
);

-carts
CREATE TABLE public.carts (
    id integer NOT NULL,
    user_id integer NOT NULL,
    total_quantity integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);

-cart_items
CREATE TABLE public.cart_items (
    id integer NOT NULL,
    cart_id integer NOT NULL,
    meal_id text NOT NULL,
    name text NOT NULL,
    price numeric(10,2) NOT NULL,
    quantity integer NOT NULL,
    total_price numeric(10,2) NOT NULL,
    CONSTRAINT cart_items_quantity_check CHECK ((quantity > 0))
);

-orders
CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer NOT NULL,
    customer_name text NOT NULL,
    city text NOT NULL,
    street text NOT NULL,
    postal_code text NOT NULL,
    total_quantity integer NOT NULL,
    total_price numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);

-order_items
CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer NOT NULL,
    meal_id text NOT NULL,
    name text NOT NULL,
    price numeric(10,2) NOT NULL,
    quantity integer NOT NULL,
    total_price numeric(10,2) NOT NULL
);

->Demo Credentials

User
Email: test@user.com
Password: password123

Admin
Email: test@admin.com
Password: password123

Installation
Clone Repository
https://github.com/zak-stavrakakis/FoodApp.git

->Backend Setup
cd backend
npm install

Run:
npm run dev

->Frontend Setup

npm install
npm run dev

