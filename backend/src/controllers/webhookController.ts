import { Response } from 'express';
import { pool } from '../config/database';
import { AuthRequest } from '../middleware/auth';

export async function createWebhook(req: AuthRequest, res: Response): Promise<void> {
  const { url, eventType } = req.body;
  const companyId = req.companyId;

  if (!url || !eventType) {
    res.status(400).json({ error: 'URL and event type are required' });
    return;
  }

  const validEventTypes = ['response.created', 'questionnaire.completed', 'recommendation.generated'];
  if (!validEventTypes.includes(eventType)) {
    res.status(400).json({ 
      error: 'Invalid event type', 
      validTypes: validEventTypes 
    });
    return;
  }

  try {
    const result = await pool.query(
      `INSERT INTO webhooks (company_id, url, event_type)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [companyId, url, eventType]
    );

    res.status(201).json({
      message: 'Webhook created successfully',
      webhook: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getWebhooks(req: AuthRequest, res: Response): Promise<void> {
  const companyId = req.companyId;

  try {
    const result = await pool.query(
      'SELECT * FROM webhooks WHERE company_id = $1 ORDER BY created_at DESC',
      [companyId]
    );

    res.json({
      webhooks: result.rows
    });
  } catch (error) {
    console.error('Error fetching webhooks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteWebhook(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const companyId = req.companyId;

  try {
    const result = await pool.query(
      'DELETE FROM webhooks WHERE id = $1 AND company_id = $2 RETURNING id',
      [id, companyId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Webhook not found' });
      return;
    }

    res.json({
      message: 'Webhook deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateWebhook(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const companyId = req.companyId;
  const { url, eventType, isActive } = req.body;

  try {
    const result = await pool.query(
      `UPDATE webhooks 
       SET url = COALESCE($1, url),
           event_type = COALESCE($2, event_type),
           is_active = COALESCE($3, is_active)
       WHERE id = $4 AND company_id = $5
       RETURNING *`,
      [url, eventType, isActive, id, companyId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Webhook not found' });
      return;
    }

    res.json({
      message: 'Webhook updated successfully',
      webhook: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
