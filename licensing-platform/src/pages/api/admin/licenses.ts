import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { generateLicenseKey } from '@/lib/licenseUtils';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  switch (req.method) {
    case 'GET':
      return handleGetLicenses(req, res);
    case 'POST':
      return handleCreateLicense(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGetLicenses(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { productId, status, page = 1, limit = 10 } = req.query;

    const where = {
      ...(productId && { productId: productId as string }),
      ...(status && { status: status as any })
    };

    const [licenses, total] = await Promise.all([
      prisma.license.findMany({
        where,
        include: {
          product: true,
          user: true,
          activations: {
            include: { hwid: true }
          }
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.license.count({ where })
    ]);

    return res.status(200).json({
      success: true,
      data: licenses,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });

  } catch (error) {
    console.error('Get licenses error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleCreateLicense(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { productId, type, maxActivations, expiresAt, userId } = req.body;

    if (!productId || !type) {
      return res.status(400).json({ error: 'Product ID and type are required' });
    }

    // Generate license key
    const key = generateLicenseKey();

    // Create license
    const license = await prisma.license.create({
      data: {
        key,
        productId,
        type,
        maxActivations: maxActivations || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        userId: userId || null
      }
    });

    return res.status(201).json({
      success: true,
      data: license
    });

  } catch (error) {
    console.error('Create license error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}