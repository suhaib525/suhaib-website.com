import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { validateLicenseKeyFormat } from '@/lib/licenseUtils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { licenseKey, hwid } = req.body;

    // Validate input
    if (!licenseKey || !hwid) {
      return res.status(400).json({ error: 'License key and HWID are required' });
    }

    if (!validateLicenseKeyFormat(licenseKey)) {
      return res.status(400).json({ error: 'Invalid license key format' });
    }

    // Find license
    const license = await prisma.license.findUnique({
      where: { key: licenseKey },
      include: {
        activations: {
          where: { isActive: true },
          include: { hwid: true }
        }
      }
    });

    if (!license) {
      return res.status(404).json({ error: 'License not found' });
    }

    // Check license status
    if (license.status !== 'ACTIVE') {
      return res.status(403).json({ 
        error: 'License is not active',
        status: license.status 
      });
    }

    // Check expiration
    if (license.expiresAt && new Date(license.expiresAt) < new Date()) {
      return res.status(403).json({ error: 'License has expired' });
    }

    // Check HWID locking
    const activeActivation = license.activations.find(activation => 
      activation.hwid.hash === hwid && activation.isActive
    );

    if (!activeActivation) {
      return res.status(403).json({ error: 'License not activated on this machine' });
    }

    // Check max activations
    if (license.maxActivations !== null && 
        license.activations.length > license.maxActivations) {
      return res.status(403).json({ error: 'Maximum activations reached' });
    }

    return res.status(200).json({
      valid: true,
      license: {
        id: license.id,
        key: license.key,
        type: license.type,
        status: license.status,
        expiresAt: license.expiresAt
      }
    });

  } catch (error) {
    console.error('Validation error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}