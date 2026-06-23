const teamService = require('../services/teamService');

class TeamController {
  async createTeam(req, res) {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ success: false, message: 'Ekip adı gereklidir.' });
      }
      const newTeam = await teamService.createTeam({ name });
      res.status(201).json({ success: true, data: newTeam });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAllTeams(req, res) {
    try {
      const teams = await teamService.getAllTeams();
      res.status(200).json({ success: true, data: teams });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async addMember(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ success: false, message: 'Geliştirici adı gereklidir.' });
      }
      const result = await teamService.addMember(id, name);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }
}

module.exports = new TeamController();
