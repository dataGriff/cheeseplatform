import { Request, Response } from 'express';
import { pool } from '../config/database';
import { RecommendationService } from '../services/recommendationService';

const recommendationService = new RecommendationService();

export async function submitResponse(req: Request, res: Response): Promise<void> {
  const { questionnaireId } = req.params;
  const { customerEmail, responses } = req.body;

  if (!responses || !Array.isArray(responses)) {
    res.status(400).json({ error: 'Responses array is required' });
    return;
  }

  try {
    // Get questionnaire to verify it exists and get company_id
    const questionnaireResult = await pool.query(
      'SELECT company_id, is_active FROM questionnaires WHERE id = $1',
      [questionnaireId]
    );

    if (questionnaireResult.rows.length === 0) {
      res.status(404).json({ error: 'Questionnaire not found' });
      return;
    }

    const questionnaire = questionnaireResult.rows[0];

    if (!questionnaire.is_active) {
      res.status(400).json({ error: 'Questionnaire is not active' });
      return;
    }

    // Calculate recommendations
    const recommendations = await recommendationService.calculateRecommendations(
      questionnaire.company_id,
      responses
    );

    const formattedRecommendations = recommendationService.formatRecommendations(recommendations);

    // Store the response
    const result = await pool.query(
      `INSERT INTO questionnaire_responses (questionnaire_id, customer_email, responses, recommended_cheeses)
       VALUES ($1, $2, $3, $4)
       RETURNING id, created_at`,
      [questionnaireId, customerEmail, JSON.stringify(responses), JSON.stringify(formattedRecommendations)]
    );

    const responseRecord = result.rows[0];

    // Trigger webhooks if any are configured
    await triggerWebhooks(questionnaire.company_id, 'response.created', {
      responseId: responseRecord.id,
      questionnaireId,
      customerEmail,
      recommendations: formattedRecommendations
    });

    res.status(201).json({
      message: 'Response submitted successfully',
      responseId: responseRecord.id,
      recommendations: formattedRecommendations,
      createdAt: responseRecord.created_at
    });
  } catch (error) {
    console.error('Error submitting response:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getResponses(req: Request, res: Response): Promise<void> {
  const { questionnaireId } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, customer_email, responses, recommended_cheeses, created_at
       FROM questionnaire_responses
       WHERE questionnaire_id = $1
       ORDER BY created_at DESC`,
      [questionnaireId]
    );

    res.json({
      responses: result.rows
    });
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getResponse(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT qr.*, q.title as questionnaire_title, q.company_id
       FROM questionnaire_responses qr
       JOIN questionnaires q ON qr.questionnaire_id = q.id
       WHERE qr.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Response not found' });
      return;
    }

    res.json({
      response: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching response:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function triggerWebhooks(companyId: number, eventType: string, data: any): Promise<void> {
  try {
    const webhooksResult = await pool.query(
      'SELECT url FROM webhooks WHERE company_id = $1 AND event_type = $2 AND is_active = true',
      [companyId, eventType]
    );

    // In a production environment, you would queue these webhook calls
    // For now, we'll just log them
    webhooksResult.rows.forEach((webhook: { url: string }) => {
      console.log(`Webhook triggered: ${webhook.url} for event ${eventType}`);
      // In production: queue webhook delivery with retry logic
    });
  } catch (error) {
    console.error('Error triggering webhooks:', error);
  }
}
