import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import complianceRoutes from './routes/compliance.js';
import dispatchRoutes from './routes/dispatch.js';
import carrierRoutes from './routes/carriers.js';
import dispatcherRoutes from './routes/dispatchers.js';
import messageRoutes from './routes/messages.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/dispatch', dispatchRoutes);
app.use('/api/carriers', carrierRoutes);
app.use('/api/dispatchers', dispatcherRoutes);
app.use('/api/messages', messageRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
