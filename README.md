
# Task & Project Management API

This is a NestJS-based API for managing tasks and projects, where users can authenticate using JWT tokens, create tasks and projects, and assign roles to manage projects collaboratively.

This project was created both as a first try at an ORM approach in NestJS and as a showcase. It uses TypeORM, which I found easier and more readable to implement for simple CRUD APIs, but it started to get messy the moment things became more complicated, so I stuck with plain SQL in my other projects.

I had to abandon this repo without 100% finishing it as I took part in a client’s project. Because of this, some projects functionality is not working properly, and unitary/integration test coverage is lacking. Although all endpoints were end-to-end tested using Postman, as I find end-to-end testing way more useful when software is developed with high-level tools like TypeScript and NestJS.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Authorization & Roles](#authorization--roles)
- [Pending Features](#pending-features)
- [License](#license)

---

## Features

- **JWT Authentication**: Secure user login and token-based authentication.
- **User Roles**:
  - **Admin**: Project creator with full control over tasks and settings.
  - **Resolver**: Task assignee responsible for resolving tasks.
  - **Project Members**: Users with access to project tasks and collaboration.
- **Task Management**: Create, update, and assign tasks within projects.
- **Project Management**: Organize tasks into projects with settings managed by the admin.

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/en/) (>=14.x)
- [NestJS CLI](https://docs.nestjs.com/cli/overview) (optional, but recommended)

### Steps

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```dotenv
   DB_HOST=<your_database_host>
   DB_PORT=<your_database_port>
   DATABASE_USERNAME=<your_database_username>
   DB_PASSWORD=<your_database_password>
   JWT_SECRET=<your_jwt_secret>
   ```

4. Start the server:
   ```bash
   npm run start:dev
   ```


## Usage

### Authentication

To access protected routes, you must first authenticate with your credentials and receive a JWT token, which must be included in the `Authorization` header for subsequent requests.

### API Endpoints

A Swagger UI documentation can be found on the /api endpoint.
Below is a summary of the available API endpoints.

#### Authentication

- `POST /auth/singup`: Register a new user.
- `POST /auth/singin`: Log in and receive a JWT token.

#### Projects

- `POST /projects`: Create a new project.
- `GET /projects`: Get all projects for the authenticated user.
- `GET /projects/:projectid`: Get a specific project.
- `DELETE /projects/:projectid`: Delete a project (admin only).
- `DELETE /projects/:projectId/members/:memberId`: Delete project member (admin only).
- `PATCH /projects/:projectId/members/:memberId`: Add project member (admin only).



#### Tasks

- `GET /tasks`: Get all tasks for a project.
- `GET /tasks/:id`: Get details of a specific task.
- `POST /tasks`: Create a new task within a project.
- `DELETE /tasks/:id`: Delete a task (task admin only).
- `PATCH /tasks/:id/status`: Update task status (task admin or resolver only).
- `PATCH /tasks/:id/resolver`: Update task resolver (task admin only).
- `PATCH /tasks/:id/project`: Update task project (task admin only).



## Database Schema

The PostgreSQL database used in this project consists of the following tables:

### Tables and Relationships

- **User**
  - `id`: Unique identifier for each user.
  - `username`: Username of the user.
  - `password`: Hashed password of the user.

- **Project**
  - `id`: Unique identifier for each project.
  - `title`: Title of the project.
  - `description`: Detailed description of the project.
  - `adminId`: Reference to the admin user who created the project.

- **Task**
  - `id`: Unique identifier for each task.
  - `title`: Title of the task.
  - `description`: Detailed description of the task.
  - `status`: Current status of the task (e.g., open, in progress, completed).
  - `adminId`: Reference to the user who is the admin for this task (default to the creator).
  - `resolverId`: Reference to the user assigned to resolve this task.
  - `projectId`: Reference to the project this task belongs to.

- **user_projects_project** (Join Table)
  - This table represents the many-to-many relationship between users and projects, indicating which users are members of which projects.
  - `userId`: Reference to a user.
  - `projectId`: Reference to a project.

### Relationships

- Each **User** can be an admin or a member of multiple **Projects**.
- Each **Project** has a single **admin** and can have multiple **members** through the `user_projects_project` table.
- Each **Task** is associated with a **Project** and has a specific **admin** and **resolver**.

## Authentication

- **JWT Token**: Authenticate by including the `Authorization` header with the format `Bearer <token>`.
- **Token Expiration**: JWT tokens expire after an hour.

## Authorization & Roles

- **Admin**: Can create, update, and delete projects and tasks.
- **Resolver**: Assigned to a task and responsible for resolving it.
- **Members**: Project members who can view tasks and projects but have restricted permissions.

## Pending Features

- Extend unitary/integrated test coverage.
- Add external API autentification (such Google).
- Implement Gherkin based end-to-end testing
- Add React based frontend for showcase purposes.

## License

This project is licensed under the MIT License.
