const { validationResult } = require('express-validator');
const taskService = require('../services/taskService');

class TaskController {
  async createTask(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validasyon hatası.', errors: errors.array() });
    }

    try {
      const newTask = await taskService.createTask(req.body);
      return res.status(201).json({ success: true, data: newTask, message: 'Task başarıyla oluşturuldu.' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Task oluşturulurken hata.', error: error.message });
    }
  }

  async getAllTasks(req, res) {
    try {
      const tasks = await taskService.getAllTasks();
      return res.status(200).json({ success: true, data: tasks, message: 'Taskler başarıyla listelendi.' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Taskler listelenirken hata.', error: error.message });
    }
  }

  async updateTask(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validasyon hatası.', errors: errors.array() });
    }

    try {
      const updatedTask = await taskService.updateTask(req.params.id, req.body);
      return res.status(200).json({ success: true, data: updatedTask, message: 'Task başarıyla güncellendi.' });
    } catch (error) {
      return res.status(404).json({ success: false, message: 'Task güncellenemedi.', error: error.message });
    }
  }

  async getWorkload(req, res) {
    try {
      const userId = req.params.userId;
      const workload = await taskService.getWorkloadByUserId(userId);
      return res.status(200).json({ success: true, data: workload, message: 'İş yükü başarıyla hesaplandı.' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'İş yükü hesaplanırken hata.', error: error.message });
    }
  }
}

module.exports = new TaskController();
