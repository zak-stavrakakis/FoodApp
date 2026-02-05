import jwt from 'jsonwebtoken';

const JWT_SECRET = 'dev_secret';

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.sendStatus(401);

  const token = header.split(' ')[1];

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.sendStatus(403);
  }
}
