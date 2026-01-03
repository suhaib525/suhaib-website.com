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
    const { licenseKey, hwidComponents, ipAddress } = req.body;

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

    // Check if already activated on this machine
    const existingActivation = license.activations.find(activation => 
      activation.hwid.hash === hwidHash && activation.isActive
    );

    if (existingActivation) {
      return res.status(200).json({
        success: true,
        message: 'License already activated on this machine',
        activation: existingActivation
      });
    }

    // Check max activations
    if (license.maxActivations !== null && 
        license.activations.length >= license.maxActivations) {
      return res.status(403).json({ error: 'Maximum activations reached' });
    }

    // Find or create HWID
    let hwid = await prisma.hWID.findUnique({
      where: { hash: hwidHash }
    });

    if (!hwid) {
      hwid = await prisma.hWID.create({
        data: {
          hash: hwidHash,
          metadata: hwidComponents
        }
      });
    }

    // Create activation
    const activation = await prisma.licenseActivation.create({
      data: {
        licenseId: license.id,
        hwidId: hwid.id,
        ipAddress: ipAddress || req.socket.remoteAddress || 'unknown',
        isActive: true
      }
    });

    return res.status(201).json({
      success: true,
      message: 'License activated successfully',
      activation
    });

  } catch (error) {
    console.error('Activation error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}