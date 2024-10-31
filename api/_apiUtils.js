import jwt from 'jsonwebtoken';

export async function authenticateUser(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new Error('Missing Authorization header');
  }

  const token = authHeader.split(' ')[1];
  try {
    const user = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
    return user;
  } catch (error) {
    throw new Error('Invalid token');
  }
}