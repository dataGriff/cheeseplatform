import { Response } from 'express';
import { pool } from '../config/database';
import { AuthRequest } from '../middleware/auth';

export async function createCheese(req: AuthRequest, res: Response): Promise<void> {
  const { name, description, type, texture, flavorProfile, milkType, intensity, imageUrl } = req.body;
  const companyId = req.companyId;

  if (!name) {
    res.status(400).json({ error: 'Cheese name is required' });
    return;
  }

  try {
    const result = await pool.query(
      `INSERT INTO cheeses (company_id, name, description, type, texture, flavor_profile, milk_type, intensity, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [companyId, name, description, type, texture, JSON.stringify(flavorProfile), milkType, intensity, imageUrl]
    );

    res.status(201).json({
      message: 'Cheese created successfully',
      cheese: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating cheese:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getCheeses(req: AuthRequest, res: Response): Promise<void> {
  const companyId = req.companyId;

  try {
    const result = await pool.query(
      'SELECT * FROM cheeses WHERE company_id = $1 ORDER BY created_at DESC',
      [companyId]
    );

    res.json({
      cheeses: result.rows
    });
  } catch (error) {
    console.error('Error fetching cheeses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getCheese(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const companyId = req.companyId;

  try {
    const result = await pool.query(
      'SELECT * FROM cheeses WHERE id = $1 AND company_id = $2',
      [id, companyId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Cheese not found' });
      return;
    }

    res.json({
      cheese: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching cheese:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateCheese(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const companyId = req.companyId;
  const { name, description, type, texture, flavorProfile, milkType, intensity, imageUrl } = req.body;

  try {
    const result = await pool.query(
      `UPDATE cheeses 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           type = COALESCE($3, type),
           texture = COALESCE($4, texture),
           flavor_profile = COALESCE($5, flavor_profile),
           milk_type = COALESCE($6, milk_type),
           intensity = COALESCE($7, intensity),
           image_url = COALESCE($8, image_url),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 AND company_id = $10
       RETURNING *`,
      [name, description, type, texture, flavorProfile ? JSON.stringify(flavorProfile) : null, 
       milkType, intensity, imageUrl, id, companyId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Cheese not found' });
      return;
    }

    res.json({
      message: 'Cheese updated successfully',
      cheese: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating cheese:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteCheese(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const companyId = req.companyId;

  try {
    const result = await pool.query(
      'DELETE FROM cheeses WHERE id = $1 AND company_id = $2 RETURNING id',
      [id, companyId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Cheese not found' });
      return;
    }

    res.json({
      message: 'Cheese deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting cheese:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
