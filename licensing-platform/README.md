# Licensing Platform

A secure software licensing platform built with Next.js, Tailwind CSS, Prisma, and PostgreSQL, similar to KeyAuth.

## Features

- **License Key Management**: Generate, validate, and manage license keys
- **HWID Locking**: Hardware ID locking to prevent unauthorized usage
- **Admin Dashboard**: Web interface for managing licenses and users
- **API Endpoints**: RESTful API for client software integration
- **Security**: JWT authentication, rate limiting, and encryption

## Technology Stack

- **Frontend**: Next.js with TypeScript
- **UI**: Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/licensing-platform.git
   cd licensing-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database and secret keys
   ```

4. Set up the database:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   npm run seed
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## API Documentation

### Public API (for client software)

- **POST /api/validate** - Validate a license key
  ```json
  {
    "licenseKey": "ABCD-EFGH-IJKL-MNOP",
    "hwid": "hardware-id-hash"
  }
  ```

- **POST /api/activate** - Activate a license on current machine
  ```json
  {
    "licenseKey": "ABCD-EFGH-IJKL-MNOP",
    "hwidComponents": {
      "mac": "00:1A:2B:3C:4D:5E",
      "disk": "WDC123456789",
      "cpu": "Intel-i7-12345"
    }
  }
  ```

- **POST /api/deactivate** - Deactivate a license
  ```json
  {
    "licenseKey": "ABCD-EFGH-IJKL-MNOP",
    "hwidComponents": {
      "mac": "00:1A:2B:3C:4D:5E",
      "disk": "WDC123456789",
      "cpu": "Intel-i7-12345"
    }
  }
  ```

### Admin API (requires authentication)

- **GET /api/admin/licenses** - List all licenses
- **POST /api/admin/licenses** - Create a new license
- **PUT /api/admin/licenses/:id** - Update a license
- **DELETE /api/admin/licenses/:id** - Revoke a license

## Security Features

1. **License Key Generation**: Secure random 16-character keys with checksum validation
2. **HWID Locking**: Composite hardware ID hashing to prevent key sharing
3. **API Security**: JWT authentication, rate limiting, and input validation
4. **Data Encryption**: Sensitive data encrypted at rest
5. **Access Control**: Role-based access control (Admin/User)

## License

MIT License. See LICENSE for more information.