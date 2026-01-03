import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { generateAPIKey } from '@/lib/licenseUtils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'API key name is required' });
    }

    // Generate API key
    const key = generateAPIKey();

    // Create API key
    const apiKey = await prisma.aPIKey.create({
      data: {
        key,
        name,
        userId: session.user.id
      }
    });

    return res.status(201).json({
      success: true,
      message: 'API key created successfully',
      apiKey: key // Return the key only once (important for security)
    });

  } catch (error) {
    console.error('Create API key error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}