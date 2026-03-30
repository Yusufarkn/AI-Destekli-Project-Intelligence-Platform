const { validationResult } = require('express-validator');
const userService = require('../services/userService');

class UserController {
  // Kullanıcı oluşturma controller'ı
  async createUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasyon hatası.',
        errors: errors.array()
      });
    }

    try {
      const { name, email, role } = req.body;
      const newUser = await userService.createUser({ name, email, role });
      
      return res.status(201).json({
        success: true,
        data: newUser,
        message: 'Kullanıcı başarıyla oluşturuldu.'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Kullanıcı oluşturulurken bir hata oluştu.',
        error: error.message
      });
    }
  }

  // Tüm kullanıcıları listeleme controller'ı
  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      return res.status(200).json({
        success: true,
        data: users,
        message: 'Kullanıcılar başarıyla listelendi.'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Kullanıcılar listelenirken bir hata oluştu.',
        error: error.message
      });
    }
  }
}

module.exports = new UserController();
