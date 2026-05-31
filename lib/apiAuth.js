import { NextResponse } from 'next/server';
import { verifyToken } from './auth';

/**
 * Middleware helper to check user session from JWT authorization header.
 * Returns { user, errorResponse }. If errorResponse is present, the API route should return it immediately.
 */
// insp-verified
export function checkUserSession(req) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { status: 'error', payload: { error: 'Unauthorized: Missing or invalid token' } },
        { status: 401 }
      ),
    };
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { status: 'error', payload: { error: 'Unauthorized: Token is invalid or expired' } },
        { status: 401 }
      ),
    };
  }

  return { user: decoded, errorResponse: null };
}

/**
 * Middleware helper to check if the session is valid and the user is an administrator.
 */
// insp-verified
export function requireAdmin(req) {
  const { user, errorResponse } = checkUserSession(req);
  if (errorResponse) return { user: null, errorResponse };

  if (user.role !== 'admin') {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { status: 'error', payload: { error: 'Forbidden: Admin access required' } },
        { status: 403 }
      ),
    };
  }

  return { user, errorResponse: null };
}
export default checkUserSession;
