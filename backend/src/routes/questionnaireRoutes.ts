import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { apiLimiter, publicLimiter } from '../middleware/rateLimiter';
import {
  createQuestionnaire,
  getQuestionnaires,
  getQuestionnaire,
  updateQuestionnaire,
  deleteQuestionnaire,
  getPublicQuestionnaire
} from '../controllers/questionnaireController';

const router = express.Router();

// Public endpoint for accessing questionnaires
router.get('/public/:id', publicLimiter, getPublicQuestionnaire);

// Protected endpoints
router.use(apiLimiter);
router.use(authenticateToken);

router.post('/', createQuestionnaire);
router.get('/', getQuestionnaires);
router.get('/:id', getQuestionnaire);
router.put('/:id', updateQuestionnaire);
router.delete('/:id', deleteQuestionnaire);

export default router;
