import express from 'express';
import authRoutes from './auth.js';
import reportRoutes from './reports.js';
import studentRoutes from './students.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/', reportRoutes);
router.use('/students', studentRoutes);

export default router;
