# Inter-IIT Dev Task

[Watch the DEMO VIDEO](https://drive.google.com/file/d/1XdqyWGhaxSuylC9qzueIEJP2aNJTuRRo/view?t=3)

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
- **Continuous Integration**: GitHub Actions

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

