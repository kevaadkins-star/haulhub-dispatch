import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticateJWT, AuthRequest } from '../middleware/auth';
import { query, escape } from '../services/db';

const router = express.Router();

// GET /api/messages — get all messages for the authenticated user
router.get('/', authenticateJWT, (req: AuthRequest, res) => {
  if (!req.user) return res.sendStatus(401);

  try {
    const messages = query(`
      SELECT m.*, u.full_name as sender_name, u.email as sender_email
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.receiver_id = '${req.user.id}' OR m.sender_id = '${req.user.id}'
      ORDER BY m.created_at DESC
    `);

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/messages — send a message
router.post('/', authenticateJWT, (req: AuthRequest, res) => {
  if (!req.user) return res.sendStatus(401);

  const { receiver_id, subject, body } = req.body;

  if (!receiver_id || !body) {
    return res.status(400).json({ error: 'Missing receiver_id or body' });
  }

  try {
    // Verify receiver exists
    const receiver = query(`SELECT id FROM users WHERE id = '${escape(receiver_id as string)}'`);
    if (receiver.length === 0) {
      return res.status(404).json({ error: 'Receiver not found' });
    }

    const id = uuidv4();
    query(`INSERT INTO messages (id, sender_id, receiver_id, subject, body) VALUES ('${id}', '${req.user.id}', '${escape(receiver_id as string)}', '${escape(subject || '')}', '${escape(body)}')`);

    res.status(201).json({ id, message: 'Message sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/messages/:id/read — mark a message as read
router.put('/:id/read', authenticateJWT, (req: AuthRequest, res) => {
  if (!req.user) return res.sendStatus(401);

  try {
    const existing = query(`SELECT id, receiver_id FROM messages WHERE id = '${escape(req.params.id as string)}'`);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (existing[0].receiver_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    query(`UPDATE messages SET read = 1 WHERE id = '${escape(req.params.id as string)}'`);

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/messages/unread-count — count of unread messages
router.get('/unread-count', authenticateJWT, (req: AuthRequest, res) => {
  if (!req.user) return res.sendStatus(401);

  try {
    const result = query(`SELECT COUNT(*) as count FROM messages WHERE receiver_id = '${req.user.id}' AND read = 0`);
    res.json({ count: result[0].count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
