import { useState } from 'react';
import { getHWIDComponents, getHWIDHash } from '@/lib/hwid';
import { api } from '@/lib/api';
import Head from 'next/head';

export default function LicensingTest() {
  const [licenseKey, setLicenseKey] = useState('');
  const [hwidComponents, setHwidComponents] = useState(null);
  const [hwidHash, setHwidHash] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [activationResult, setActivationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHWID = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const components = await getHWIDComponents();
      const hash = await getHWIDHash();
      
      setHwidComponents(components);
      setHwidHash(hash);
    } catch (err) {
      setError('Failed to get HWID: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateLicense = async () => {
    if (!licenseKey || !hwidHash) {
      setError('License key and HWID are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await api.validateLicense(licenseKey, hwidHash);
      setValidationResult(result);
    } catch (err) {
      setError('Validation failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const activateLicense = async () => {
    if (!licenseKey || !hwidComponents) {
      setError('License key and HWID components are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await api.activateLicense(licenseKey, hwidComponents);
      setActivationResult(result);
    } catch (err) {
      setError('Activation failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Licensing Test - Licensing Platform</title>
      </Head>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Licensing Test</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="bg-white shadow sm:rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">HWID Information</h2>
          
          <div className="mb-4">
            <button
              onClick={fetchHWID}
              disabled={loading}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Fetching HWID...' : 'Get HWID'}
            </button>
          </div>

          {hwidComponents && (
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 mb-2">HWID Components:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                {JSON.stringify(hwidComponents, null, 2)}
              </pre>
              <p className="mt-2 text-sm text-gray-600">
                HWID Hash: <code className="bg-gray-200 px-2 py-1 rounded">{hwidHash}</code>
              </p>
            </div>
          )}
        </div>

        <div className="bg-white shadow sm:rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">License Validation</h2>

          <div className="mb-4">
            <label htmlFor="licenseKey" className="block text-sm font-medium text-gray-700 mb-1">
              License Key
            </label>
            <input
              id="licenseKey"
              type="text"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              placeholder="ABCD-EFGH-IJKL-MNOP"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex space-x-4 mb-4">
            <button
              onClick={validateLicense}
              disabled={loading || !licenseKey || !hwidHash}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              Validate License
            </button>

            <button
              onClick={activateLicense}
              disabled={loading || !licenseKey || !hwidComponents}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
              Activate License
            </button>
          </div>

          {validationResult && (
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 mb-2">Validation Result:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                {JSON.stringify(validationResult, null, 2)}
              </pre>
            </div>
          )}

          {activationResult && (
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 mb-2">Activation Result:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                {JSON.stringify(activationResult, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="bg-white shadow sm:rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">API Documentation</h2>
          <p className="text-gray-600 mb-4">
            This page demonstrates the client-side integration with the licensing platform API.
          </p>
          <p className="text-gray-600">
            In a real application, this would be integrated into your software's licensing system.
          </p>
        </div>
      </div>
    </div>
  );
}