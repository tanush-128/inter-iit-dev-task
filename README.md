# Inter-IIT Dev Task

[Watch the DEMO VIDEO](https://drive.google.com/file/d/1ixpiJdQy6uY9rxW8Io0yO6L7JcRtOd8x/view?usp=sharing)

## Tech Stack

### Frontend:
- **Framework**: Next.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS with Shadcn components
- **State Management**: Custom hooks using Context Provider
- **Dockerized**: Yes

### Backend:
- **Language**: Golang
- **Framework**: Gin
- **ORM**: GORM
- **Authentication**: JWT-based authentication with middleware for specific routes
- **Database**: PostgreSQL or SQLite
- **Dockerized**: Yes

## Features

### Frontend:
- **Main**: `/` - View, add, edit items and locations
- **Login**: `/login` - User login
- **Register**: `/register` - User registration

### Backend:
for detailed API documentation, see [Backend API](#backend-api)
- **Models**: 
  - User
  - Item
  - Location
- **Services**:
  - UserService
  - ItemService
  - LocationService
- **Groups**: API routes are organized into groups

## Deployment

- **Server**: AWS EC2 Instance
- **Web Server**: Nginx
- **Containerization**: Docker
- **CI/ CD**: GitHub Actions

## Local Development

### Requirements:
- Docker
- Docker Compose

### Setup:

1. Run the following command to start the services:
    ```bash
    docker-compose up --build
    ```

2. Access the frontend at `http://localhost:3000`.



## Hosted Version

You can use the hosted version at [https://warhosuse.run.place/](https://warhosuse.run.place/).




# Backend API

This backend uses Gin for routing and JWT-based authentication for protected routes. Below are the available API endpoints for managing items, locations, and users, as well as details about the `Item` and `Location` data structures used in requests and responses.

## Table of Contents
- [Inter-IIT Dev Task](#inter-iit-dev-task)
  - [Tech Stack](#tech-stack)
    - [Frontend:](#frontend)
    - [Backend:](#backend)
  - [Features](#features)
    - [Frontend:](#frontend-1)
    - [Backend:](#backend-1)
  - [Deployment](#deployment)
  - [Local Development](#local-development)
    - [Requirements:](#requirements)
    - [Setup:](#setup)
  - [Hosted Version](#hosted-version)
- [Backend API](#backend-api)
  - [Table of Contents](#table-of-contents)
  - [Endpoints Overview](#endpoints-overview)
    - [Item Endpoints](#item-endpoints)
    - [Location Endpoints](#location-endpoints)
    - [User Endpoints](#user-endpoints)
  - [Authentication](#authentication)
  - [Response Codes](#response-codes)
    - [Error Codes](#error-codes)
    - [Success Codes](#success-codes)
  - [Data Structures](#data-structures)
    - [Item Struct](#item-struct)
    - [ItemAttributes Struct](#itemattributes-struct)
    - [Location Struct](#location-struct)

## Endpoints Overview

### Item Endpoints
- **POST /item/** – Create a new item.
  - Request: Item details (JSON).
  - Response: Created item.
  
- **GET /item/:id** – Retrieve an item by ID.
  
- **GET /item/** – Retrieve all items (supports query params).
  
- **PUT /item/** – Update an item (JWT required).
  - Request: Updated item details (JSON).
  
- **DELETE /item/:id** – Delete an item (JWT required).

### Location Endpoints
- **POST /location/** – Create a new location.
  - Request: Location details (JSON).
  - Response: Created location.
  
- **GET /location/:id** – Retrieve a location by ID.
  
- **GET /location/** – Retrieve all locations.
  
- **PUT /location/** – Update a location (JWT required).
  - Request: Updated location details (JSON).
  
- **DELETE /location/:id** – Delete a location (JWT required).

### User Endpoints
- **POST /user/** – Create a new user.
  - Request: User details (JSON).
  - Response: Created user + JWT token.
  
- **POST /user/signin** – Sign in a user.
  - Request: Email & password (JSON).
  - Response: JWT token.
  
- **GET /user/jwt** – Get user by JWT token (JWT required).
  
- **PUT /user/** – Update user (JWT required).

## Authentication
Protected routes (like update/delete) require JWT. Add the token in the request header:
```http
Authorization: Bearer <jwt_token>
```

## Response Codes

### Error Codes
- **400**: Bad Request.
- **401**: Unauthorized (JWT missing/invalid).
- **500**: Internal Server Error.

### Success Codes
- **200**: OK.
- **201**: Created.

## Data Structures

### Item Struct
The `Item` struct represents an item in the system. It includes fields for details like name, quantity, category, and more.

```go
type Item struct {
    ID         string          `gorm:"primaryKey;unique" json:"item_id"`
    Name       *string         `json:"name,omitempty"`
    Quantity   *int            `json:"quantity,omitempty"`
    Category   *string         `json:"category,omitempty"`
    Price      *float64        `json:"price,omitempty"`
    Status     *string         `json:"status,omitempty"`
    GodownID   *string         `json:"godown_id,omitempty"`
    Brand      *string         `json:"brand,omitempty"`
    Attributes *ItemAttributes `gorm:"embedded" json:"attributes,omitempty"`
    ImageURL   *string         `json:"image_url,omitempty"`
}
```
### ItemAttributes Struct
The `ItemAttributes` struct is embedded in the `Item` struct and contains additional attributes like type, material, and warranty years.
```go
type ItemAttributes struct {
    ID            uint    `gorm:"primaryKey;autoIncrement;unique" json:"id"`
    Type          *string `json:"type,omitempty"`
    Material      *string `json:"material,omitempty"`
    WarrantyYears *int    `json:"warranty_years,omitempty"`
}
```
### Location Struct
The `Location` struct represents a location in the system, such as a godown or warehouse.
```go
type Location struct {
    ID           string  `gorm:"primaryKey" json:"id"`
    Name         *string `json:"name,omitempty"`
    ParentGodown *string `json:"parent_godown,omitempty"`
}
```