import { Router, Request, Response } from 'express';
import { query } from '../config/database';

const router = Router();

// Health check endpoint
router.get('/health', async (req: Request, res: Response) => {
  try {
    const healthCheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: 'unknown',
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
        }
      }
    };

    // Test database connection
    try {
      await query('SELECT 1 as test');
      healthCheck.services.database = 'connected';
    } catch (error) {
      healthCheck.services.database = 'disconnected';
      healthCheck.message = 'Database connection failed';
    }

    const statusCode = healthCheck.services.database === 'connected' ? 200 : 503;
    res.status(statusCode).json(healthCheck);
  } catch (error) {
    res.status(503).json({
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Readiness check endpoint
router.get('/ready', async (req: Request, res: Response) => {
  try {
    // Check if all required services are ready
    const checks = {
      database: false,
      memory: process.memoryUsage().heapUsed < 500 * 1024 * 1024, // Less than 500MB
      uptime: process.uptime() > 10 // At least 10 seconds uptime
    };

    // Test database
    try {
      await query('SELECT 1 as test');
      checks.database = true;
    } catch (error) {
      checks.database = false;
    }

    const isReady = Object.values(checks).every(check => check === true);
    const statusCode = isReady ? 200 : 503;

    res.status(statusCode).json({
      ready: isReady,
      checks,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      ready: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Liveness check endpoint
router.get('/live', (req: Request, res: Response) => {
  res.status(200).json({
    alive: true,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

export default router;
