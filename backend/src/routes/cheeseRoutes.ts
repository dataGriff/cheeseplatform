import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  createCheese,
  getCheeses,
  getCheese,
  updateCheese,
  deleteCheese
} from '../controllers/cheeseController';

const router = express.Router();

router.use(authenticateToken);

router.post('/', createCheese);
router.get('/', getCheeses);
router.get('/:id', getCheese);
router.put('/:id', updateCheese);
router.delete('/:id', deleteCheese);

export default router;
