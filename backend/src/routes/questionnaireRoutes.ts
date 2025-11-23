import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimiter';
import {
  createQuestionnaire,
  getQuestionnaires,
  getQuestionnaire,
  updateQuestionnaire,
  deleteQuestionnaire
} from '../controllers/questionnaireController';

const router = express.Router();

router.use(apiLimiter);
router.use(authenticateToken);

router.post('/', createQuestionnaire);
router.get('/', getQuestionnaires);
router.get('/:id', getQuestionnaire);
router.put('/:id', updateQuestionnaire);
router.delete('/:id', deleteQuestionnaire);

export default router;
