import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/ideas - Fetch all ideas
router.get('/', async (req, res) => {
  try {
    const ideas = await prisma.idea.findMany({
      orderBy: [
        { upvotes: 'desc' },
        { createdAt: 'desc' }
      ]
    });
    
    res.json({
      success: true,
      data: ideas,
      count: ideas.length
    });
  } catch (error) {
    console.error('Error fetching ideas:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch ideas',
      message: error.message
    });
  }
});

// POST /api/ideas - Create a new idea
router.post('/', async (req, res) => {
  try {
    const { content } = req.body;
    
    // Validation
    if (!content || typeof content !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Content is required and must be a string'
      });
    }
    
    if (content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Content cannot be empty'
      });
    }
    
    if (content.length > 280) {
      return res.status(400).json({
        success: false,
        error: 'Content must be 280 characters or less'
      });
    }
    
    const idea = await prisma.idea.create({
      data: {
        content: content.trim()
      }
    });
    
    res.status(201).json({
      success: true,
      data: idea,
      message: 'Idea created successfully'
    });
  } catch (error) {
    console.error('Error creating idea:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create idea',
      message: error.message
    });
  }
});

// PUT /api/ideas/:id/upvote - Upvote an idea
router.put('/:id/upvote', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if idea exists
    const existingIdea = await prisma.idea.findUnique({
      where: { id }
    });
    
    if (!existingIdea) {
      return res.status(404).json({
        success: false,
        error: 'Idea not found'
      });
    }
    
    // Increment upvotes
    const updatedIdea = await prisma.idea.update({
      where: { id },
      data: {
        upvotes: {
          increment: 1
        }
      }
    });
    
    res.json({
      success: true,
      data: updatedIdea,
      message: 'Idea upvoted successfully'
    });
  } catch (error) {
    console.error('Error upvoting idea:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upvote idea',
      message: error.message
    });
  }
});

// GET /api/ideas/:id - Get a specific idea
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const idea = await prisma.idea.findUnique({
      where: { id }
    });
    
    if (!idea) {
      return res.status(404).json({
        success: false,
        error: 'Idea not found'
      });
    }
    
    res.json({
      success: true,
      data: idea
    });
  } catch (error) {
    console.error('Error fetching idea:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch idea',
      message: error.message
    });
  }
});

export default router;