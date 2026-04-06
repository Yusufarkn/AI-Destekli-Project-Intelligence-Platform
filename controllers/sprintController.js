const { validationResult } = require('express-validator');
const sprintService = require('../services/sprintService');

class SprintController {
  async createSprint(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validasyon hatası.', errors: errors.array() });
    }

    try {
      const newSprint = await sprintService.createSprint(req.body);
      return res.status(201).json({ success: true, data: newSprint, message: 'Sprint başarıyla oluşturuldu.' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Sprint oluşturulurken hata.', error: error.message });
    }
  }

  async getAllSprints(req, res) {
    try {
      const sprints = await sprintService.getAllSprints();
      return res.status(200).json({ success: true, data: sprints, message: 'Sprintler başarıyla listelendi.' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Sprintler listelenirken hata.', error: error.message });
    }
  }
}

module.exports = new SprintController();
