import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';

export const getAuthSession = () => getServerSession(authOptions);

export const withAuth = (handler) => {
  return async (req, res) => {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    req.session = session;
    return handler(req, res);
  };
};

export const withAdminAuth = (handler) => {
  return async (req, res) => {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    req.session = session;
    return handler(req, res);
  };
};