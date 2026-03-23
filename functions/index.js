const functions = require("firebase-functions"); 

exports.calculateRisk = functions.https.onRequest((req, res) => { 
  try { 
    const { 
      task_completion_rate, 
      bug_count, 
      workload_index 
    } = req.body; 

    if ( 
      task_completion_rate === undefined || 
      bug_count === undefined || 
      workload_index === undefined 
    ) { 
      return res.status(400).json({ error: "Eksik veri" }); 
    } 

    const delay_ratio = 1 - task_completion_rate; 

    const risk_score = 
      (0.4 * delay_ratio) + 
      (0.3 * (bug_count / 20)) + 
      (0.3 * workload_index); 

    res.json({ 
      risk_score: Number(risk_score.toFixed(2)), 
      delay_probability: Number(risk_score.toFixed(2)) 
    }); 

  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  } 
}); 
