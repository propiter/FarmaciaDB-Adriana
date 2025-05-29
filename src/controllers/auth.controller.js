const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación de usuarios
 */

const authController = {
  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Iniciar sesión
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - correo
   *               - contraseña
   *             properties:
   *               correo:
   *                 type: string
   *                 format: email
   *                 example: admin@farmacia.com
   *               contraseña:
   *                 type: string
   *                 format: password
   *                 example: password123
   *     responses:
   *       200:
   *         description: Token JWT generado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *                   description: Token JWT para autenticación
   *                 rol:
   *                   type: string
   *                   description: Rol del usuario
   *                 nombre:
   *                   type: string
   *                   description: Nombre del usuario
   *       400:
   *         description: Validación fallida
   *       401:
   *         description: Credenciales inválidas
   */
  login: async (req, res) => {
    try {
      const { correo, contraseña } = req.body;
      
      // Find user by email
      const user = await User.findOne({ where: { correo } });
      if (!user) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }
      
      // Check contraseña
      const isMatch = await bcrypt.compare(contraseña, user.contraseña);
      if (!isMatch) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }
      
      // Generate JWT
      const token = jwt.sign(
        { usuario_id: user.usuario_id, rol: user.rol },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );
      
      res.json({ token, rol: user.rol, nombre: user.nombre });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }
};

module.exports = authController;
