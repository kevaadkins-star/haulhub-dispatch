import express from 'express';
import { authenticateJWT, AuthRequest } from '../middleware/auth.js';
import { query, escape } from '../services/db.js';

const router = express.Router();

router.get('/profile', authenticateJWT, (req: AuthRequest, res) => {
  if (!req.user) return res.sendStatus(401);

  try {
    const users = query(`SELECT id, email, full_name, role, dot_number, mc_number, subscription_tier, subscription_status, created_at FROM users WHERE id = '${req.user.id}'`);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/profile', authenticateJWT, (req: AuthRequest, res) => {
  if (!req.user) return res.sendStatus(401);

  const { full_name, dot_number, mc_number, subscription_tier } = req.body;

  try {
    let updateFields = [];
    if (full_name) updateFields.push(`full_name = '${escape(full_name)}'`);
    if (dot_number !== undefined) updateFields.push(`dot_number = '${escape(dot_number)}'`);
    if (mc_number !== undefined) updateFields.push(`mc_number = '${escape(mc_number)}'`);
    if (subscription_tier) updateFields.push(`subscription_tier = '${escape(subscription_tier)}'`);

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    query(`UPDATE users SET ${updateFields.join(', ')} WHERE id = '${req.user.id}'`);

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
