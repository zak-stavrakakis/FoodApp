import jwt from 'jsonwebtoken';

const JWT_SECRET = 'dev_secret';

// export function authMiddleware(req, res, next) {
//   const header = req.headers.authorization;
//   if (!header) return res.sendStatus(401);

//   const token = header.split(' ')[1];

//   try {
//     req.user = jwt.verify(token, JWT_SECRET);
//     next();
//   } catch {
//     res.sendStatus(403);
//   }
// }

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
