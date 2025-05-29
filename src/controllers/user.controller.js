const bcrypt = require('bcryptjs');
const { User } = require('../models');

const userController = {
  register: async (req, res) => {
    try {
      const { nombre, correo, contraseña, rol } = req.body;
      
      // Check if user exists
      const existingUser = await User.findOne({ where: { correo } });
      if (existingUser) {
        return res.status(400).json({ message: 'El correo ya está registrado' });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(contraseña, 12);
      
      // Create user
      const newUser = await User.create({
        nombre,
        correo,
        contraseña: hashedPassword,
        rol: rol || 'cajero'
      });
      
      res.status(201).json({ 
        usuario_id: newUser.usuario_id,
        nombre: newUser.nombre,
        correo: newUser.correo,
        rol: newUser.rol
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },
  
  getProfile: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.usuario_id, {
        attributes: ['usuario_id', 'nombre', 'correo', 'rol']
      });
      
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }
};

module.exports = userController;
