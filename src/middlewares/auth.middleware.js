const jwt = require('jsonwebtoken');

const authMiddleware = {
  verifyToken: (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Acceso no autorizado' });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido' });
    }
  },
  
  checkRole: (roles) => (req, res, next) => {
    if (!req.user) return res.status(403).json({ error: 'Acceso no autorizado' });
    
    if (roles.includes(req.user.rol)) {
      return next();
    }
    
    return res.status(403).json({ error: 'No tienes permisos para esta acción' });
  }
};

module.exports = authMiddleware;
