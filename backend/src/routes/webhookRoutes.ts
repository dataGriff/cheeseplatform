import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  createWebhook,
  getWebhooks,
  updateWebhook,
  deleteWebhook
} from '../controllers/webhookController';

const router = express.Router();

router.use(authenticateToken);

router.post('/', createWebhook);
router.get('/', getWebhooks);
router.put('/:id', updateWebhook);
router.delete('/:id', deleteWebhook);

export default router;
