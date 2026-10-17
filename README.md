
# COMP 3123 - Assignment 1

## Secure Employee Management REST API

**Student Number:** 101419863  
**Course:** COMP 3123  
**Assignment:** Assignment 1 - Backend  
**Database:** comp3123_assignment1

## 1. Project Overview

This project implements a RESTful Employee Management API using Node.js, Express, MongoDB, and Mongoose.

The application supports user registration, authentication, and employee management. Each employee record is associated with the user who created it.

The system uses JWT authentication and database-level ownership filtering to ensure that users can only access and manage their own employees.

## 2. Technologies Used

- Node.js
- Express.js
- JavaScript
- MongoDB Atlas
- Mongoose
- JSON Web Tokens
- bcryptjs
- express-validator
- Helmet
- express-rate-limit
- Winston
- dotenv
- Postman

## 3. Features

### User Authentication

- User registration
- Login using username or email
- Password hashing
- JWT generation
- Protected API endpoints
- Invalid and expired token handling

### Employee Management

- Create employees
- Retrieve all employees
- Retrieve an employee by ID
- Update employee information
- Delete employees
- User-to-employee relationships
- Employee ownership restrictions

### Security

- JWT authentication
- Password hashing using bcrypt
- Input validation
- HTTP security headers through Helmet
- API rate limiting
- Environment-based configuration
- Centralized error handling
- Restricted employee access

### Additional Features

- MongoDB integration
- Application logging
- Health-check endpoint
- Postman API collection
- Structured JSON responses

## 4. Project Structure

```text
src/
├── config/
│   └── database.js
├── controllers/
│   ├── employeeController.js
│   └── userController.js
├── middleware/
│   ├── authMiddleware.js
│   └── requestLogger.js
├── models/
│   ├── Employee.js
│   └── User.js
├── routes/
│   ├── employeeRoutes.js
│   └── userRoutes.js
├── utils/
│   └── logger.js
└── validators/
    ├── employeeValidator.js
    └── userValidator.js
```

The root directory contains the application entry point, dependency files, environment template, Postman collection, and testing evidence.

## 5. Installation

### Requirements

- Node.js
- npm
- MongoDB Atlas account or local MongoDB
- Postman

### Clone the repository

```bash
git clone https://github.com/USERNAME/101419863_COMP3123_Assignment1.git
cd 101419863_COMP3123_Assignment1
```

Replace USERNAME with the actual GitHub username.

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env` file using `.env.example` as a template.

```dotenv
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_secret
JWT_EXPIRES_IN=1h
LOG_LEVEL=info
```

For MongoDB Atlas, configure a database user and allow the development computer's IP address.

The application uses the database:

```text
comp3123_assignment1
```

Do not commit the actual `.env` file.

### Start the application

Development mode:

```bash
npm run dev
```

Production-style start:

```bash
npm start
```

Default API URL:

```text
http://localhost:5000
```

## 6. API Endpoints

### User Endpoints

| Method | Endpoint | Description | Success |
|--------|----------|-------------|---------|
| POST | /api/v1/user/signup | Register user | 201 |
| POST | /api/v1/user/login | Login user | 200 |

### Employee Endpoints

All employee endpoints require a JWT.

| Method | Endpoint | Description | Success |
|--------|----------|-------------|---------|
| GET | /api/v1/emp/employees | List owned employees | 200 |
| POST | /api/v1/emp/employees | Create employee | 201 |
| GET | /api/v1/emp/employees/:eid | Get employee by ID | 200 |
| PUT | /api/v1/emp/employees/:eid | Update employee | 200 |
| DELETE | /api/v1/emp/employees?eid=ID | Delete employee | 204 |

### Health Check

```http
GET /health
```

Returns HTTP 200 with a JSON response containing the application status, timestamp, and database connection state.

## 7. Example Requests

### Register User

```http
POST /api/v1/user/signup
Content-Type: application/json
```

```json
{
  "username": "testuser1",
  "email": "testuser1@example.com",
  "password": "TestPass123"
}
```

### Login

```http
POST /api/v1/user/login
Content-Type: application/json
```

```json
{
  "email": "testuser1@example.com",
  "password": "TestPass123"
}
```

A successful response contains a JWT.

### Create Employee

```http
POST /api/v1/emp/employees
Authorization: Bearer YOUR_JWT
Content-Type: application/json
```

```json
{
  "first_name": "Ahmed",
  "last_name": "Khan",
  "email": "ahmed.khan@example.com",
  "position": "Software Developer",
  "salary": 75000,
  "date_of_joining": "2026-10-01",
  "department": "IT"
}
```

Employee ownership is assigned automatically using the authenticated user.

## 8. Authentication

The application uses JSON Web Tokens.

After a successful login, the server generates a signed JWT containing the authenticated user's identifier.

Protected endpoints require:

```http
Authorization: Bearer YOUR_JWT
```

Authentication middleware verifies the token and loads the associated user from MongoDB.

Missing, invalid, and expired tokens are rejected with HTTP 401 responses.

JWT expiration is configured through the `JWT_EXPIRES_IN` environment variable.

## 9. Database Models

### User

The User model contains:

- Username
- Email
- Hashed password
- Creation timestamp
- Update timestamp

Usernames and email addresses must be unique.

Passwords are hashed before storage and excluded from normal API responses.

### Employee

The Employee model contains:

- First name
- Last name
- Email
- Position
- Salary
- Date of joining
- Department
- User reference
- Creation timestamp
- Update timestamp

The `user` field stores a MongoDB ObjectId referencing the User model.

## 10. Employee Authorization

Employee ownership is enforced on the server.

Every employee is associated with the authenticated user who created the record.

For employee retrieval, updates, and deletion, database queries include both the employee ID and the authenticated user ID.

A user cannot gain access to another user's employee by changing the employee ID.

If an employee is not owned by the authenticated user, the API returns HTTP 404.

The owner is determined from the verified JWT rather than client-supplied employee ownership information.

## 11. Input Validation

The application uses express-validator.

User validation includes:

- Required username
- Username length and format
- Valid email
- Password length
- Password complexity
- Required login credentials

Employee validation includes:

- Required fields
- Name length
- Valid email
- Position length
- Positive salary
- Valid joining date
- Department length
- Valid MongoDB ObjectId

Validation failures return HTTP 400 with JSON error information.

## 12. Security

### Password Hashing

User passwords are hashed with bcrypt before database storage.

Plain-text passwords are never stored in MongoDB or returned by the API.

### JWT Authentication

JWTs protect all employee endpoints.

Tokens are validated using a secret stored in environment variables.

### Helmet

Helmet configures HTTP response headers that help reduce exposure to common web security risks.

### Rate Limiting

Rate limiting restricts the number of requests accepted from an IP address during a defined time window.

Authentication endpoints are limited to 10 requests per 15 minutes.

General API requests are limited to 100 requests per 15 minutes.

Exceeding a limit produces HTTP 429 Too Many Requests.

These limits are implemented in application memory and are intended for this single-instance assignment project.

### Environment Variables

Sensitive settings are loaded from `.env`.

The actual environment file is excluded from Git.

### Request Validation

Incoming data is checked before creating or modifying database records.

### Error Handling

The API uses consistent JSON error responses and does not expose internal stack traces to clients.

## 13. HTTP Status Codes

| Status | Meaning |
|--------|---------|
| 200 | Successful request |
| 201 | Resource successfully created |
| 204 | Successful deletion with no response body |
| 400 | Invalid request |
| 401 | Authentication required or failed |
| 403 | Forbidden operation |
| 404 | Resource or endpoint not found |
| 409 | Duplicate account information |
| 429 | Rate limit exceeded |
| 500 | Unexpected server error |

The application returns 404 for employee records that are missing or not owned by the authenticated user. This avoids revealing the existence of another user's records.

## 14. Application Logging

Winston is used for application logging.

Log files are stored inside:

```text
logs/
├── combined.log
└── error.log
```

The logging system records:

- Timestamps
- Server startup events
- Database connection events
- Request methods
- Request paths
- HTTP status codes
- Request durations
- Available authenticated user IDs
- Authentication or authorization failures
- Validation failures
- Rate-limit violations
- Application errors

Sensitive request bodies, passwords, JWT secrets, and authentication tokens are not included in request logs.

## 15. Testing

Postman is used for API testing.

The exported collection is available in the `postman` directory.

To use the collection:

1. Open Postman.
2. Select Import.
3. Choose the exported collection JSON.
4. Configure the API base URL.
5. Register or log in with a test user.
6. Obtain a JWT.
7. Use the JWT for protected employee requests.

The collection includes the requests developed and tested for this assignment.

Additional testing evidence is stored in the `evidence` directory.

## 16. Ownership Testing

Two test users can be used to verify employee isolation.

Test procedure:

1. Register User A and User B.
2. Log in as User A.
3. Create an employee.
4. Log in as User B.
5. Create another employee.
6. Verify each user only sees their own records.
7. Attempt to retrieve, update, or delete another user's employee.

Cross-user access must be rejected.

## 17. MongoDB Evidence

MongoDB Atlas is used to store the application data.

The database contains:

- users
- employees

The users collection stores hashed passwords.

The employees collection includes a `user` ObjectId referencing the employee owner.

Screenshots of the database structure and application testing are included in the evidence directory.

## 18. Running the Tests

Start the backend:

```bash
npm run dev
```

Open Postman and import the provided collection.

The default server URL is:

```text
http://localhost:5000
```

Ensure MongoDB is connected and valid test credentials are available.

## 19. Conclusion

This project demonstrates a modular REST API using Node.js, Express, MongoDB, and Mongoose.

It implements authentication, employee management, input validation, database relationships, ownership protection, HTTP security middleware, rate limiting, logging, and consistent error handling.
