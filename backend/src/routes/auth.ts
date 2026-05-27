import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { query, escape } from '../services/db.js';
import { config } from '../config.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password, full_name, role, dot_number, mc_number } = req.body;

  if (!email || !password || !full_name || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const validRoles = ['owner_operator', 'lease_driver', 'dispatcher'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    const existingUser = query(`SELECT id FROM users WHERE email = '${escape(email)}'`);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const id = uuidv4();

    // For dispatchers, DOT/MC are optional or null
    const dot = role === 'dispatcher' ? null : dot_number;
    const mc = role === 'dispatcher' ? null : mc_number;

    query(`INSERT INTO users (id, email, password_hash, full_name, role, dot_number, mc_number) VALUES ('${id}', '${escape(email)}', '${passwordHash}', '${escape(full_name)}', '${role}', ${dot ? `'${escape(dot)}'` : 'NULL'}, ${mc ? `'${escape(mc)}'` : 'NULL'})`);

    const user = { id, email, full_name, role };
    const token = jwt.sign(user, config.jwtSecret, { expiresIn: '24h' });

    res.status(201).json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  try {
    const users = query(`SELECT * FROM users WHERE email = '${escape(email)}'`);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const tokenUser = { id: user.id, email: user.email, role: user.role };
    const token = jwt.sign(tokenUser, config.jwtSecret, { expiresIn: '24h' });

    delete user.password_hash;
    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
