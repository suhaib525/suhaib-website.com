import { getSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const session = await getSession();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (session?.accessToken) {
      headers['Authorization'] = `Bearer ${session.accessToken}`;
    }

    const config: RequestInit = {
      method,
      headers,
      ...options,
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Request failed');
      }

      return result;
    } catch (error) {
      console.error('API request error:', error);
      return {
        success: false,
        error: error.message || 'Network error',
      };
    }
  }

  // License API
  async validateLicense(licenseKey: string, hwid: string) {
    return this.request<{ valid: boolean; license: any }>('POST', '/validate', { licenseKey, hwid });
  }

  async activateLicense(licenseKey: string, hwidComponents: Record<string, string>) {
    return this.request('POST', '/activate', { licenseKey, hwidComponents });
  }

  async deactivateLicense(licenseKey: string, hwidComponents: Record<string, string>) {
    return this.request('POST', '/deactivate', { licenseKey, hwidComponents });
  }

  // Admin API
  async getLicenses(params: Record<string, string> = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request('GET', `/admin/licenses${query ? `?${query}` : ''}`);
  }

  async createLicense(data: {
    productId: string;
    type: string;
    maxActivations?: number;
    expiresAt?: string;
    userId?: string;
  }) {
    return this.request('POST', '/admin/licenses', data);
  }

  async updateLicense(licenseId: string, data: any) {
    return this.request('PUT', `/admin/licenses/${licenseId}`, data);
  }

  async deleteLicense(licenseId: string) {
    return this.request('DELETE', `/admin/licenses/${licenseId}`);
  }
}

export const api = new ApiClient();