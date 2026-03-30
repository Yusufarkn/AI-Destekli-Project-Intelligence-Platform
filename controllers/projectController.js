const { validationResult } = require('express-validator');
const projectService = require('../services/projectService');

class ProjectController {
  // Proje oluşturma controller'ı
  async createProject(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasyon hatası.',
        errors: errors.array()
      });
    }

    try {
      const { name, description } = req.body;
      const newProject = await projectService.createProject({ name, description });
      
      return res.status(201).json({
        success: true,
        data: newProject,
        message: 'Proje başarıyla oluşturuldu.'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Proje oluşturulurken bir hata oluştu.',
        error: error.message
      });
    }
  }

  // Tüm projeleri listeleme controller'ı
  async getAllProjects(req, res) {
    try {
      const projects = await projectService.getAllProjects();
      return res.status(200).json({
        success: true,
        data: projects,
        message: 'Projeler başarıyla listelendi.'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Projeler listelenirken bir hata oluştu.',
        error: error.message
      });
    }
  }

  // Projeye kullanıcı atama controller'ı
  async assignUserToProject(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasyon hatası.',
        errors: errors.array()
      });
    }

    try {
      const projectId = req.params.id;
      const { userId } = req.body;
      const result = await projectService.assignUser(projectId, userId);

      return res.status(200).json({
        success: true,
        data: result,
        message: 'Kullanıcı projeye başarıyla atandı.'
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı atanamadı.',
        error: error.message
      });
    }
  }
}

module.exports = new ProjectController();
