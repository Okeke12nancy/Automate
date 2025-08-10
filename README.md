# Paramount+ Automation API

A NestJS application that automates card payment operations on Paramount+ using Puppeteer, with GraphQL API and PostgreSQL database.

## Features

- **User Management**: Create and manage users with email, name, and password
- **Authentication**: JWT-based authentication for secure API access
- **Card Automation**: Automate login and card payment operations on Paramount+
- **Robust Error Handling**: Retry logic and comprehensive logging
- **GraphQL API**: Modern GraphQL interface with Apollo Server
- **PostgreSQL Database**: Reliable data storage with TypeORM

## Tech Stack

- **Backend**: NestJS, TypeScript
- **Database**: PostgreSQL with TypeORM
- **API**: GraphQL with Apollo Server
- **Authentication**: JWT with Passport
- **Automation**: Puppeteer for browser automation
- **Validation**: Class-validator for input validation

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bundul
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=paramount_automation
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   ```

4. **Set up PostgreSQL database**
   ```sql
   CREATE DATABASE paramount_automation;
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run start:prod
   ```

## API Documentation

The GraphQL playground is available at `http://localhost:3000/graphql`

### Authentication

#### Login
```graphql
mutation Login($loginInput: LoginInput!) {
  login(loginInput: $loginInput) {
    token
    user {
      id
      email
      name
      createdAt
    }
  }
}
```

Variables:
```json
{
  "loginInput": {
    "email": "user@example.com",
    "password": "password123"
  }
}
```

### User Management

#### Create User
```graphql
mutation CreateUser($createUserInput: CreateUserInput!) {
  createUser(createUserInput: $createUserInput) {
    id
    email
    name
    createdAt
  }
}
```

Variables:
```json
{
  "createUserInput": {
    "email": "user@example.com",
    "name": "John Doe",
    "password": "password123",
    "paramountEmail": "paramount@example.com",
    "paramountPassword": "paramount_password"
  }
}
```

#### Get Users
```graphql
query GetUsers {
  users {
    id
    email
    name
    createdAt
  }
}
```

#### Get User by ID
```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    id
    email
    name
    createdAt
  }
}
```

### Automation

#### Add Card to Paramount+
```graphql
mutation AddCardToParamount($input: CardAutomationInput!) {
  addCardToParamount(input: $input) {
    success
    message
    errorMessage
  }
}
```

Variables:
```json
{
  "input": {
    "userId": "user-id-here",
    "cardNumber": "4111111111111111",
    "expiryMonth": "12",
    "expiryYear": "2025",
    "cvv": "123",
    "cardholderName": "John Doe"
  }
}
```

#### Get Card Logs
```graphql
query GetCardLogs($userId: ID!) {
  cardLogs(userId: $userId) {
    id
    action
    status
    errorMessage
    cardLastFour
    cardType
    createdAt
  }
}
```

## Authentication

All protected mutations and queries require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Sample Test Data

### Create a test user:
```graphql
mutation {
  createUser(createUserInput: {
    email: "test@example.com"
    name: "Test User"
    password: "password123"
    paramountEmail: "paramount@example.com"
    paramountPassword: "paramount_password"
  }) {
    id
    email
    name
  }
}
```

### Login to get token:
```graphql
mutation {
  login(loginInput: {
    email: "test@example.com"
    password: "password123"
  }) {
    token
    user {
      id
      email
    }
  }
}
```

## Error Handling

The application includes comprehensive error handling:

- **Retry Logic**: Puppeteer actions are retried up to 3 times with exponential backoff
- **Logging**: All automation activities are logged with timestamps and user information
- **Validation**: Input validation using class-validator
- **Database Constraints**: Proper database constraints and error handling

## Security Features

- **Password Hashing**: Passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive input validation and sanitization
- **CORS**: Cross-origin resource sharing enabled
- **Environment Variables**: Sensitive data stored in environment variables

## Development

### Available Scripts

```bash
# Development
npm run start:dev

# Build
npm run build

# Production
npm run start:prod

# Testing
npm run test
npm run test:e2e

# Linting
npm run lint
npm run format
```

### Project Structure

```
src/
├── module/
│   ├── user/           # User management
│   ├── auth/           # Authentication
│   └── automation/     # Paramount+ automation
├── db/                 # Database configuration
└── main.ts            # Application entry point
```

## License

This project is licensed under the MIT License.
