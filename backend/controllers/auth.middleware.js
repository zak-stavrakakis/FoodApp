import jwt from 'jsonwebtoken';

const JWT_SECRET = 'dev_secret';

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user; // contains { userId, role }
    next();
  });

  // try {
  //   const decoded = jwt.verify(token, JWT_SECRET);
  //   req.userId = decoded.userId;
  //   next();
  // } catch (err) {
  //   return res.status(401).json({ message: 'Invalid token' });
  // }
}
