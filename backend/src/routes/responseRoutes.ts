import express from 'express';
import {
  submitResponse,
  getResponses,
  getResponse
} from '../controllers/responseController';

const router = express.Router();

// Public endpoint for customers to submit responses
router.post('/:questionnaireId/submit', submitResponse);

// Protected endpoints for viewing responses
router.get('/:questionnaireId', getResponses);
router.get('/response/:id', getResponse);

export default router;
