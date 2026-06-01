import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticateJWT, AuthRequest } from '../middleware/auth';
import { query, escape } from '../services/db';

const router = express.Router();

// GET /api/carriers - list all vetted carriers
router.get('/', authenticateJWT, (req: AuthRequest, res) => {
  if (!req.user) return res.sendStatus(401);

  const { search } = req.query;

  try {
    let sql = 'SELECT * FROM carriers';
    if (search) {
      sql += ` WHERE company_name LIKE '%${escape(String(search))}%'`;
    }
    sql += ' ORDER BY company_name ASC';

    const carriers = query(sql);
    res.json(carriers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/carriers/:id - get carrier details
router.get('/:id', authenticateJWT, (req: AuthRequest, res) => {
  if (!req.user) return res.sendStatus(401);

  try {
    const carriers = query(`SELECT * FROM carriers WHERE id = '${escape(req.params.id as string)}'`);
    if (carriers.length === 0) {
      return res.status(404).json({ error: 'Carrier not found' });
    }
    res.json(carriers[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/carriers - add a carrier to the directory
router.post('/', authenticateJWT, (req: AuthRequest, res) => {
  if (!req.user) return res.sendStatus(401);

  const { company_name, dot_number, mc_number, contact_phone, contact_email, lease_terms } = req.body;

  if (!company_name || !dot_number || !contact_phone || !contact_email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const id = uuidv4();
  const verified = 0;

  try {
    query(`INSERT INTO carriers (id, company_name, dot_number, mc_number, contact_phone, contact_email, lease_terms, verified) 
      VALUES ('${id}', '${escape(company_name)}', '${escape(dot_number)}', '${escape(mc_number || '')}', '${escape(contact_phone)}', '${escape(contact_email)}', '${escape(lease_terms || '')}', ${verified})`);
    
    res.status(201).json({ id, message: 'Carrier added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/carriers/contact - log a contact request
router.post('/contact', authenticateJWT, (req: AuthRequest, res) => {
  if (!req.user) return res.sendStatus(401);

  const { carrier_id, message } = req.body;

  if (!carrier_id || !message) {
    return res.status(400).json({ error: 'Missing carrier_id or message' });
  }

  const id = uuidv4();

  try {
    // Verify carrier exists
    const carrier = query(`SELECT id FROM carriers WHERE id = '${escape(carrier_id)}'`);
    if (carrier.length === 0) {
      return res.status(404).json({ error: 'Carrier not found' });
    }

    query(`INSERT INTO carrier_contacts (id, user_id, carrier_id, message) 
      VALUES ('${id}', '${req.user.id}', '${escape(carrier_id)}', '${escape(message)}')`);
    
    res.status(201).json({ id, message: 'Contact request logged successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
