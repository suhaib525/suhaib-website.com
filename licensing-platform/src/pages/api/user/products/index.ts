import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

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
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Product name is required' });
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        userId: session.user.id
      }
    });

    return res.status(201).json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Create product error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}