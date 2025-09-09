// my-ecommerce-backend/controllers/authController.js
const jwt = require('jsonwebtoken');

// Contraseña de administrador (¡Solo para prototipo! En producción, usar hashing y una DB)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adminpassword';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Debería ser una clave compleja en .env

// Login del administrador
exports.adminLogin = (req, res) => {
  const { password } = req.body;

  if (password === ADMIN_PASSWORD) {
    // Si la contraseña es correcta, genera un token JWT
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '1h' }); // Token expira en 1 hora
    res.status(200).json({ message: 'Login exitoso', token });
  } else {
    res.status(401).json({ message: 'Credenciales inválidas.' });
  }
};
