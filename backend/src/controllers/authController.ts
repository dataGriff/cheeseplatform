import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../config/database';
import { generateToken } from '../middleware/auth';

export async function register(req: Request, res: Response): Promise<void> {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: 'Name, email and password are required' });
    return;
  }

  try {
    // Check if company already exists
    const existingCompany = await pool.query(
      'SELECT id FROM companies WHERE email = $1',
      [email]
    );

    if (existingCompany.rows.length > 0) {
      res.status(400).json({ error: 'Company with this email already exists' });
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create company
    const result = await pool.query(
      'INSERT INTO companies (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, subscription_tier, created_at',
      [name, email, passwordHash]
    );

    const company = result.rows[0];
    const token = generateToken(company.id);

    res.status(201).json({
      message: 'Company registered successfully',
      token,
      company: {
        id: company.id,
        name: company.name,
        email: company.email,
        subscriptionTier: company.subscription_tier,
        createdAt: company.created_at
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  try {
    // Find company
    const result = await pool.query(
      'SELECT id, name, email, password_hash, subscription_tier FROM companies WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const company = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, company.password_hash);

    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = generateToken(company.id);

    res.json({
      message: 'Login successful',
      token,
      company: {
        id: company.id,
        name: company.name,
        email: company.email,
        subscriptionTier: company.subscription_tier
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
