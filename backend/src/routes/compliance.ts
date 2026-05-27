import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticateJWT, AuthRequest } from '../middleware/auth.js';
import { query, escape } from '../services/db.js';

const router = express.Router();

// POST /api/compliance/hos/log
router.post('/hos/log', authenticateJWT, (req: AuthRequest, res) => {
  if (!req.user) return res.sendStatus(401);

  const { date } = req.body;
  const driving_minutes = Number(req.body.driving_minutes);
  const on_duty_minutes = Number(req.body.on_duty_minutes);
  const off_duty_minutes = Number(req.body.off_duty_minutes);
  const sleeper_berth_minutes = Number(req.body.sleeper_berth_minutes);

  if (!date || isNaN(driving_minutes) || isNaN(on_duty_minutes) || isNaN(off_duty_minutes) || isNaN(sleeper_berth_minutes)) {
    return res.status(400).json({ error: 'Missing or invalid required fields' });
  }

  // Basic HOS validation logic
  let status = 'compliant';
  
  // Rule: Max 11 hours driving (660 mins)
  if (driving_minutes > 660) {
    status = 'violation';
  }
  
  // Rule: Max 14 hours on-duty (840 mins) - driving is part of on-duty
  if (driving_minutes + on_duty_minutes > 840) {
    status = 'violation';
  }
  
  // Rule: 30-min break after 8 hours driving (480 mins)
  if (driving_minutes > 480 && off_duty_minutes < 30) {
    status = 'violation';
  }

  try {
    // Check if a log already exists for this date and user
    const existing = query(`SELECT id FROM hos_logs WHERE user_id = '${req.user.id}' AND date = '${escape(date)}'`);
    
    if (existing.length > 0) {
      query(`UPDATE hos_logs SET 
        driving_minutes = ${driving_minutes}, 
        on_duty_minutes = ${on_duty_minutes}, 
        off_duty_minutes = ${off_duty_minutes}, 
        sleeper_berth_minutes = ${sleeper_berth_minutes},
        status = '${status}'
        WHERE id = '${existing[0].id}'`);
      return res.json({ message: 'Log updated successfully', status });
    } else {
      const id = uuidv4();
      query(`INSERT INTO hos_logs (id, user_id, date, driving_minutes, on_duty_minutes, off_duty_minutes, sleeper_berth_minutes, status) 
        VALUES ('${id}', '${req.user.id}', '${escape(date)}', ${driving_minutes}, ${on_duty_minutes}, ${off_duty_minutes}, ${sleeper_berth_minutes}, '${status}')`);
      return res.status(201).json({ message: 'Log created successfully', id, status });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/compliance/hos/history
router.get('/hos/history', authenticateJWT, (req: AuthRequest, res) => {
  if (!req.user) return res.sendStatus(401);

  try {
    const logs = query(`SELECT * FROM hos_logs WHERE user_id = '${req.user.id}' ORDER BY date DESC LIMIT 7`);
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/compliance/hos/status
router.get('/hos/status', authenticateJWT, (req: AuthRequest, res) => {
  if (!req.user) return res.sendStatus(401);

  const today = new Date().toISOString().split('T')[0];

  try {
    const logs = query(`SELECT * FROM hos_logs WHERE user_id = '${req.user.id}' AND date = '${today}'`);
    
    if (logs.length === 0) {
      return res.json({
        date: today,
        driving_minutes: 0,
        on_duty_minutes: 0,
        off_duty_minutes: 0,
        sleeper_berth_minutes: 0,
        driving_remaining: 660,
        on_duty_remaining: 840,
        status: 'compliant'
      });
    }

    const log = logs[0];
    res.json({
      ...log,
      driving_remaining: Math.max(0, 660 - log.driving_minutes),
      on_duty_remaining: Math.max(0, 840 - (log.driving_minutes + log.on_duty_minutes)),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/compliance/verify-authority
router.get('/verify-authority', authenticateJWT, (req: AuthRequest, res) => {
  const { dot, mc } = req.query;

  if (!dot) {
    return res.status(400).json({ error: 'DOT number is required' });
  }

  // Mock verification: valid if DOT# is >= 6 digits
  const dotStr = String(dot);
  const isValid = dotStr.length >= 6;

  res.json({
    dot,
    mc: mc || 'N/A',
    status: isValid ? 'Active' : 'Not Found',
    company_name: isValid ? 'HaulHub Mock Carrier' : null,
    verification_date: new Date().toISOString()
  });
});

// GET /api/compliance/inspection-checklist
router.get('/inspection-checklist', authenticateJWT, (req: AuthRequest, res) => {
  const checklist = [
    { category: 'Engine', items: ['Oil Level', 'Coolant Level', 'Belts & Hoses', 'Battery'] },
    { category: 'Exterior', items: ['Tire Pressure', 'Tread Depth', 'Lights (Head/Tail/Brake)', 'Wipers', 'Mirrors'] },
    { category: 'Coupling', items: ['Fifth Wheel', 'Air Lines', 'Electrical Cord', 'Kingpin'] },
    { category: 'Safety Equipment', items: ['Fire Extinguisher', 'Reflective Triangles', 'Spare Fuses', 'First Aid Kit'] },
    { category: 'Brakes', items: ['Air Pressure', 'Brake Adjustment', 'ABS Light'] }
  ];

  res.json(checklist);
});

export default router;
