# Project Structure

This document describes the structure of the Licensing Platform project.

## Directory Structure

```
licensing-platform/
├── .env                    # Environment variables
├── .env.example            # Example environment variables
├── .eslintrc.json          # ESLint configuration
├── .gitignore              # Git ignore rules
├── CHANGELOG.md            # Project changelog
├── CODE_OF_CONDUCT.md      # Code of conduct
├── CONTRIBUTING.md         # Contribution guidelines
├── LICENSE                 # MIT License
├── README.md               # Project documentation
├── SECURITY.md             # Security policy
├── next.config.js          # Next.js configuration
├── package.json            # Project dependencies
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── prisma/                 # Prisma ORM files
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Database seeding script
└── src/                    # Source code
    ├── components/         # React components
    │   ├── Layout.tsx       # Main layout component
    │   └── Navigation.tsx   # Navigation component
    ├── lib/                # Utility libraries
    │   ├── api.ts           # API client
    │   ├── auth.ts          # Authentication utilities
    │   ├── hwid.ts          # HWID utilities
    │   ├── licenseUtils.ts  # License utilities
    │   └── prisma.ts        # Prisma client
    ├── middleware.ts       # Next.js middleware
    └── pages/              # Next.js pages
        ├── admin/          # Admin pages
        │   └── dashboard.tsx # Admin dashboard
        ├── api/            # API routes
        │   ├── activate.ts  # License activation API
        │   ├── deactivate.ts # License deactivation API
        │   ├── validate.ts  # License validation API
        │   └── admin/       # Admin API routes
        │       └── licenses.ts # License management API
        ├── auth/           # Authentication pages
        │   ├── error.tsx    # Authentication error page
        │   └── signin.tsx   # Sign-in page
        ├── docs.tsx        # Documentation page
        ├── index.tsx       # Home page
        ├── test/           # Test pages
        │   └── licensing.tsx # Licensing test page
        ├── 404.tsx         # 404 page
        └── 500.tsx         # 500 page
```

## Key Components

### Database Schema

The database schema is defined in `prisma/schema.prisma` and includes:

- **User**: User accounts with roles (ADMIN/USER)
- **Product**: Software products that can be licensed
- **License**: License keys with types and status
- **HWID**: Hardware identifiers
- **LicenseActivation**: License activation records
- **APIKey**: API keys for programmatic access

### API Endpoints

#### Public API (for client software)
- `POST /api/validate` - Validate a license key
- `POST /api/activate` - Activate a license on current machine
- `POST /api/deactivate` - Deactivate a license

#### Admin API (requires authentication)
- `GET /api/admin/licenses` - List all licenses
- `POST /api/admin/licenses` - Create a new license
- `PUT /api/admin/licenses/:id` - Update a license
- `DELETE /api/admin/licenses/:id` - Revoke a license

### Security Features

1. **Authentication**: NextAuth.js with JWT
2. **Authorization**: Role-based access control
3. **Data Validation**: Input validation and sanitization
4. **Encryption**: Sensitive data encryption at rest
5. **Rate Limiting**: Protection against brute force attacks

### Frontend Components

- **Layout**: Main application layout
- **Navigation**: Navigation bar with auth status
- **Admin Dashboard**: License management interface
- **Documentation**: API documentation and guides
- **Test Pages**: Interactive testing of API functionality

## Development Workflow

1. **Database Changes**: 
   - Modify `prisma/schema.prisma`
   - Run `npm run prisma:migrate` to create and apply migrations
   - Run `npm run seed` to populate test data

2. **API Development**:
   - Create new API routes in `src/pages/api/`
   - Use the Prisma client for database access
   - Implement proper authentication and validation

3. **Frontend Development**:
   - Create new pages in `src/pages/`
   - Create reusable components in `src/components/`
   - Use Tailwind CSS for styling

4. **Testing**:
   - Test API endpoints with the test pages
   - Verify authentication and authorization
   - Test edge cases and error conditions

## Deployment

1. Build the application: `npm run build`
2. Start the server: `npm run start`
3. Configure environment variables in production
4. Set up proper database backups
5. Implement monitoring and logging