import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { validateLicenseKeyFormat, generateHWIDHash } from '@/lib/licenseUtils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { licenseKey, hwidComponents } = req.body;

    // Validate input
    if (!licenseKey || !hwidComponents) {
      return res.status(400).json({ error: 'License key and HWID components are required' });
    }

    if (!validateLicenseKeyFormat(licenseKey)) {
      return res.status(400).json({ error: 'Invalid license key format' });
    }

    // Generate HWID hash
    const hwidHash = generateHWIDHash(hwidComponents);

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

    // Find activation
    const activation = license.activations.find(activation => 
      activation.hwid.hash === hwidHash && activation.isActive
    );

    if (!activation) {
      return res.status(404).json({ error: 'Active activation not found for this machine' });
    }

    // Deactivate
    const deactivated = await prisma.licenseActivation.update({
      where: { id: activation.id },
      data: {
        isActive: false,
        deactivatedAt: new Date()
      }
    });

    return res.status(200).json({
      success: true,
      message: 'License deactivated successfully',
      activation: deactivated
    });

  } catch (error) {
    console.error('Deactivation error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}