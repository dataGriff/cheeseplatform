import { Request, Response } from 'express';
import { pool } from '../config/database';
import { AuthRequest } from '../middleware/auth';

export async function createQuestionnaire(req: AuthRequest, res: Response): Promise<void> {
  const { title, description, questions } = req.body;
  const companyId = req.companyId;

  if (!title || !questions || !Array.isArray(questions)) {
    res.status(400).json({ error: 'Title and questions array are required' });
    return;
  }

  try {
    const result = await pool.query(
      `INSERT INTO questionnaires (company_id, title, description, questions)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [companyId, title, description, JSON.stringify(questions)]
    );

    res.status(201).json({
      message: 'Questionnaire created successfully',
      questionnaire: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating questionnaire:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getQuestionnaires(req: AuthRequest, res: Response): Promise<void> {
  const companyId = req.companyId;

  try {
    const result = await pool.query(
      'SELECT * FROM questionnaires WHERE company_id = $1 ORDER BY created_at DESC',
      [companyId]
    );

    res.json({
      questionnaires: result.rows
    });
  } catch (error) {
    console.error('Error fetching questionnaires:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getQuestionnaire(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const companyId = req.companyId;

  try {
    const result = await pool.query(
      'SELECT * FROM questionnaires WHERE id = $1 AND company_id = $2',
      [id, companyId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Questionnaire not found' });
      return;
    }

    res.json({
      questionnaire: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching questionnaire:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateQuestionnaire(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const companyId = req.companyId;
  const { title, description, questions, isActive } = req.body;

  try {
    const result = await pool.query(
      `UPDATE questionnaires 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           questions = COALESCE($3, questions),
           is_active = COALESCE($4, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 AND company_id = $6
       RETURNING *`,
      [title, description, questions ? JSON.stringify(questions) : null, isActive, id, companyId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Questionnaire not found' });
      return;
    }

    res.json({
      message: 'Questionnaire updated successfully',
      questionnaire: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating questionnaire:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteQuestionnaire(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const companyId = req.companyId;

  try {
    const result = await pool.query(
      'DELETE FROM questionnaires WHERE id = $1 AND company_id = $2 RETURNING id',
      [id, companyId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Questionnaire not found' });
      return;
    }

    res.json({
      message: 'Questionnaire deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting questionnaire:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getPublicQuestionnaire(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT id, title, description, questions, is_active FROM questionnaires WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Questionnaire not found' });
      return;
    }

    const questionnaire = result.rows[0];
    
    if (!questionnaire.is_active) {
      res.status(404).json({ error: 'Questionnaire is not available' });
      return;
    }

    res.json({
      questionnaire
    });
  } catch (error) {
    console.error('Error fetching public questionnaire:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
