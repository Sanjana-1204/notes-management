import { Router } from 'express';

import healthRoutes from './health.routes.js';

const router = Router();

router.use('/health', healthRoutes);
// router.use('/auth', authRoutes);
// router.use('/notes', noteRoutes);

export default router;