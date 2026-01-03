import Head from 'next/head';

export default function Documentation() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Documentation - Licensing Platform</title>
      </Head>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Licensing Platform Documentation</h1>

        <div className="bg-white shadow sm:rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
          <p className="text-gray-600 mb-4">
            This is a secure software licensing platform similar to KeyAuth, built with Next.js, Tailwind CSS, Prisma, and PostgreSQL.
          </p>
          <p className="text-gray-600">
            The platform provides license key management, HWID locking, and API endpoints for integrating with your software.
          </p>
        </div>

        <div className="bg-white shadow sm:rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Features</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li><strong>License Key Management:</strong> Generate, validate, and manage license keys</li>
            <li><strong>HWID Locking:</strong> Hardware ID locking to prevent unauthorized usage</li>
            <li><strong>Admin Dashboard:</strong> Web interface for managing licenses and users</li>
            <li><strong>API Endpoints:</strong> RESTful API for client software integration</li>
            <li><strong>Security:</strong> JWT authentication, rate limiting, and encryption</li>
          </ul>
        </div>

        <div className="bg-white shadow sm:rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">API Documentation</h2>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Public API (for client software)</h3>

          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-2">POST /api/validate</h4>
            <p className="text-gray-600 mb-2">Validate a license key</p>
            <div className="bg-gray-100 p-4 rounded text-sm">
              <pre>{
  "licenseKey": "ABCD-EFGH-IJKL-MNOP",
  "hwid": "hardware-id-hash"
}</pre>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-2">POST /api/activate</h4>
            <p className="text-gray-600 mb-2">Activate a license on current machine</p>
            <div className="bg-gray-100 p-4 rounded text-sm">
              <pre>{
  "licenseKey": "ABCD-EFGH-IJKL-MNOP",
  "hwidComponents": {
    "mac": "00:1A:2B:3C:4D:5E",
    "disk": "WDC123456789",
    "cpu": "Intel-i7-12345"
  }
}</pre>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-2">POST /api/deactivate</h4>
            <p className="text-gray-600 mb-2">Deactivate a license</p>
            <div className="bg-gray-100 p-4 rounded text-sm">
              <pre>{
  "licenseKey": "ABCD-EFGH-IJKL-MNOP",
  "hwidComponents": {
    "mac": "00:1A:2B:3C:4D:5E",
    "disk": "WDC123456789",
    "cpu": "Intel-i7-12345"
  }
}</pre>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">Admin API (requires authentication)</h3>

          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-2">GET /api/admin/licenses</h4>
            <p className="text-gray-600">List all licenses</p>
          </div>

          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-2">POST /api/admin/licenses</h4>
            <p className="text-gray-600">Create a new license</p>
          </div>

          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-2">PUT /api/admin/licenses/:id</h4>
            <p className="text-gray-600">Update a license</p>
          </div>

          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-2">DELETE /api/admin/licenses/:id</h4>
            <p className="text-gray-600">Revoke a license</p>
          </div>
        </div>

        <div className="bg-white shadow sm:rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Security Features</h2>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">License Key Generation</h3>
          <p className="text-gray-600 mb-4">
            Secure random 16-character keys with checksum validation. Keys are generated using cryptographically secure random number generation.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">HWID Locking</h3>
          <p className="text-gray-600 mb-4">
            Composite hardware ID hashing using multiple hardware components (MAC address, disk serial, CPU ID) to prevent key sharing.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">API Security</h3>
          <p className="text-gray-600 mb-4">
            JWT authentication, rate limiting, and strict input validation to prevent common attacks.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Data Encryption</h3>
          <p className="text-gray-600">
            Sensitive data is encrypted at rest using AES encryption.
          </p>
        </div>

        <div className="bg-white shadow sm:rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Integration Guide</h2>
          <p className="text-gray-600 mb-4">
            To integrate this licensing platform with your software:
          </p>

          <ol className="list-decimal pl-6 space-y-2 text-gray-600">
            <li>Call the <code>/api/validate</code> endpoint with the license key and HWID</li>
            <li>Handle the validation response to determine if the software should run</li>
            <li>For activation, call the <code>/api/activate</code> endpoint</li>
            <li>Implement proper error handling and user feedback</li>
            <li>Consider implementing offline activation for scenarios without internet access</li>
          </ol>

          <p className="text-gray-600 mt-4">
            See the <a href="/test/licensing" className="text-blue-600 hover:text-blue-800">Licensing Test</a> page for a working example.
          </p>
        </div>
      </div>
    </div>
  );
}