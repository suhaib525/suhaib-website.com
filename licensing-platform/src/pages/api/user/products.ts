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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user's products with license count
    const products = await prisma.product.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        _count: {
          select: { licenses: true }
        }
      }
    });

    return res.status(200).json({
      success: true,
      data: products
    });

  } catch (error) {
    console.error('Get user products error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}