import { Router } from 'express';
import { Container } from 'typedi';
import { INodeType, INodeTypeDescription } from 'n8n-workflow';

const router = Router();

router.get('/inspector/nodes', async (req, res) => {
  try {
    // Check for API token authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'API token required. Please provide Bearer token in Authorization header.' });
    }

    // For this example, we'll accept any token that's not empty
    // In production, you'd validate against a stored token
    const token = authHeader.substring(7);
    if (!token.trim()) {
      return res.status(401).json({ error: 'Invalid API token.' });
    }

    const filter = req.query.filter as string || 'all';
    const { getFilteredNodes } = await import('./nodeInspectorLogic');
    const nodes = await getFilteredNodes(filter);

    res.json({
      nodes,
      filter,
      totalCount: nodes.length,
    });
  } catch (error) {
    console.error('Failed to retrieve nodes:', error);
    res.status(500).json({ error: 'Failed to retrieve nodes.', details: (error as Error).message });
  }
});

export default router; 