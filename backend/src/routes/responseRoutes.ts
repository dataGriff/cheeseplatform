import express from 'express';
import { publicLimiter, apiLimiter } from '../middleware/rateLimiter';
import {
  submitResponse,
  getResponses,
  getResponse
} from '../controllers/responseController';

const router = express.Router();

// Public endpoint for customers to submit responses (with stricter rate limiting)
router.post('/:questionnaireId/submit', publicLimiter, submitResponse);

// Protected endpoints for viewing responses (with standard API rate limiting)
router.get('/:questionnaireId', apiLimiter, getResponses);
router.get('/response/:id', apiLimiter, getResponse);

export default router;
