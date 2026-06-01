import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticateJWT, AuthRequest } from '../middleware/auth';
import { query, escape } from '../services/db';

const router = express.Router();

// GET /api/dispatchers — list available dispatchers
router.get('/', authenticateJWT, (req: AuthRequest, res) => {
  const { name } = req.query;

  try {
    let sql = "SELECT id, full_name, email, role FROM users WHERE role = 'dispatcher'";
    if (name) {
      sql += ` AND full_name LIKE '%${escape(String(name))}%'`;
    }

    const dispatchers = query(sql);
    // Note: bio and rating would normally be separate fields/tables, adding placeholder values
    const result = dispatchers.map((d: any) => ({
      ...d,
      bio: 'Professional dispatcher with 5+ years of experience.',
      rating: 4.8
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/dispatchers/request — driver requests a dispatcher
router.post('/request', authenticateJWT, (req: AuthRequest, res) => {
  if (!req.user) return res.sendStatus(401);

  const { dispatcher_id, message } = req.body;

  if (!dispatcher_id) {
    return res.status(400).json({ error: 'Missing dispatcher_id' });
  }

  try {
    // Verify dispatcher exists
    const dispatcher = query(`SELECT id FROM users WHERE id = '${escape(dispatcher_id)}' AND role = 'dispatcher'`);
    if (dispatcher.length === 0) {
      return res.status(404).json({ error: 'Dispatcher not found' });
    }

    const id = uuidv4();
    query(`INSERT INTO dispatcher_assignments (id, driver_id, dispatcher_id, status) VALUES ('${id}', '${req.user.id}', '${escape(dispatcher_id)}', 'pending')`);

    // Log the request message if provided
    if (message) {
      const msgId = uuidv4();
      query(`INSERT INTO messages (id, sender_id, receiver_id, subject, body) VALUES ('${msgId}', '${req.user.id}', '${escape(dispatcher_id)}', 'Dispatcher Request', '${escape(message)}')`);
    }

    res.status(201).json({ id, message: 'Request sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/dispatchers/my-dispatcher — driver gets their active dispatcher assignment
router.get('/my-dispatcher', authenticateJWT, (req: AuthRequest, res) => {
  if (!req.user) return res.sendStatus(401);

  try {
    const assignments = query(`
      SELECT da.*, u.full_name, u.email 
      FROM dispatcher_assignments da
      JOIN users u ON da.dispatcher_id = u.id
      WHERE da.driver_id = '${req.user.id}' AND da.status = 'active'
      LIMIT 1
    `);

    if (assignments.length === 0) {
      return res.status(404).json({ error: 'No active dispatcher assigned' });
    }

    res.json(assignments[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/dispatchers/my-drivers — dispatcher gets all their assigned drivers
router.get('/my-drivers', authenticateJWT, (req: AuthRequest, res) => {
  if (!req.user || req.user.role !== 'dispatcher') {
    return res.status(403).json({ error: 'Only dispatchers can access this' });
  }

  try {
    const drivers = query(`
      SELECT da.*, u.full_name, u.email, u.dot_number, u.mc_number
      FROM dispatcher_assignments da
      JOIN users u ON da.driver_id = u.id
      WHERE da.dispatcher_id = '${req.user.id}' AND da.status = 'active'
    `);

    res.json(drivers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
