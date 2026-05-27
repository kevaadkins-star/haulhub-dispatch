import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticateJWT, AuthRequest } from '../middleware/auth.js';
import { query, escape } from '../services/db.js';

const router = express.Router();

// GET /api/dispatch/loads - list available loads
router.get('/loads', authenticateJWT, (req: AuthRequest, res) => {
  if (!req.user) return res.sendStatus(401);

  const { origin, destination, status } = req.query;
  
  try {
    let sql = `SELECT * FROM loads WHERE (status = 'available' OR user_id = '${req.user.id}')`;
    
    if (origin) {
      sql += ` AND origin LIKE '%${escape(String(origin))}%'`;
    }
    if (destination) {
      sql += ` AND destination LIKE '%${escape(String(destination))}%'`;
    }
    if (status) {
      sql += ` AND status = '${escape(String(status))}'`;
    }
    
    sql += ' ORDER BY pickup_date DESC';
    
    const loads = query(sql);
    res.json(loads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/dispatch/loads/:id - single load details
router.get('/loads/:id', authenticateJWT, (req: AuthRequest, res) => {
  if (!req.user) return res.sendStatus(401);

  try {
    const loads = query(`SELECT * FROM loads WHERE id = '${escape(req.params.id as string)}'`);
    if (loads.length === 0) {
      return res.status(404).json({ error: 'Load not found' });
    }
    res.json(loads[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/dispatch/loads - create a new load listing
router.post('/loads', authenticateJWT, (req: AuthRequest, res) => {
  if (!req.user) return res.sendStatus(401);

  const { origin, destination, pickup_date, delivery_date, rate, weight, broker, notes } = req.body;

  if (!origin || !destination || !pickup_date || !delivery_date || !rate || !weight || !broker) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const id = uuidv4();
  const status = 'available';

  try {
    query(`INSERT INTO loads (id, user_id, origin, destination, pickup_date, delivery_date, rate, weight, status, broker, notes) 
      VALUES ('${id}', '${req.user.id}', '${escape(origin)}', '${escape(destination)}', '${escape(pickup_date)}', '${escape(delivery_date)}', ${Number(rate)}, ${Number(weight)}, '${status}', '${escape(broker)}', '${escape(notes || '')}')`);
    
    res.status(201).json({ id, message: 'Load created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/dispatch/loads/:id - update a load
router.put('/loads/:id', authenticateJWT, (req: AuthRequest, res) => {
  if (!req.user) return res.sendStatus(401);

  const { status, origin, destination, pickup_date, delivery_date, rate, weight, broker, notes } = req.body;

  try {
    // Verify ownership or if it's available
    const existing = query(`SELECT * FROM loads WHERE id = '${escape(req.params.id as string)}'`);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Load not found' });
    }

    if (existing[0].user_id !== req.user.id && existing[0].status !== 'available') {
      return res.status(403).json({ error: 'Unauthorized to update this load' });
    }

    let updateFields = [];
    if (status) updateFields.push(`status = '${escape(status)}'`);
    if (origin) updateFields.push(`origin = '${escape(origin)}'`);
    if (destination) updateFields.push(`destination = '${escape(destination)}'`);
    if (pickup_date) updateFields.push(`pickup_date = '${escape(pickup_date)}'`);
    if (delivery_date) updateFields.push(`delivery_date = '${escape(delivery_date)}'`);
    if (rate !== undefined) updateFields.push(`rate = ${Number(rate)}`);
    if (weight !== undefined) updateFields.push(`weight = ${Number(weight)}`);
    if (broker) updateFields.push(`broker = '${escape(broker)}'`);
    if (notes !== undefined) updateFields.push(`notes = '${escape(notes)}'`);

    // If a user is booking an available load, assign it to them
    if (existing[0].status === 'available' && status === 'booked') {
        updateFields.push(`user_id = '${req.user.id}'`);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    query(`UPDATE loads SET ${updateFields.join(', ')} WHERE id = '${escape(req.params.id as string)}'`);

    res.json({ message: 'Load updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/dispatch/dashboard-stats
router.get('/dashboard-stats', authenticateJWT, (req: AuthRequest, res) => {
  if (!req.user) return res.sendStatus(401);

  try {
    const active = query(`SELECT COUNT(*) as count FROM loads WHERE user_id = '${req.user.id}' AND status = 'booked'`)[0].count;
    const available = query(`SELECT COUNT(*) as count FROM loads WHERE status = 'available'`)[0].count;
    
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const completed = query(`SELECT COUNT(*) as count FROM loads WHERE user_id = '${req.user.id}' AND status = 'completed' AND delivery_date >= '${firstDayOfMonth}'`)[0].count;

    res.json({
      active_loads: active,
      available_loads: available,
      completed_this_month: completed
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
