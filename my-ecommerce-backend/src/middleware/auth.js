// my-ecommerce-backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Debe coincidir con el del controlador de auth

exports.authenticateAdmin = (req, res, next) => {
  // Primero, intenta obtener el token del encabezado Authorization (Bearer Token)
  let token = req.headers['authorization'];
  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7, token.length); // Elimina 'Bearer '
  } else {
    // Si no está en Authorization, busca en el encabezado personalizado 'admin-token' (para compatibilidad con el prototipo inicial)
    token = req.headers['admin-token'];
  }

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token de autenticación.' });
  }

  try {
    // Verifica el token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Verifica si el rol es 'admin' (o el rol que necesites)
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado. No tienes permisos de administrador.' });
    }

    req.user = decoded; // Adjunta la información del usuario decodificada a la solicitud
    next(); // Continúa con la siguiente función de middleware/ruta
  } catch (error) {
    console.error('Error de verificación de token:', error);
    res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};
