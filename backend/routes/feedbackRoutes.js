import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const FEEDBACK_FILE = path.join(process.cwd(), 'data', 'feedback.json');

// Utility function to ensure data directory exists
async function ensureDataDirectory() {
    const dataDir = path.dirname(FEEDBACK_FILE);
    try {
        await fs.access(dataDir);
    } catch {
        await fs.mkdir(dataDir, { recursive: true });
    }
}

// Utility function to read feedback from JSON file
async function readFeedback() {
    try {
        await ensureDataDirectory();
        const data = await fs.readFile(FEEDBACK_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist or is empty, return empty array
        return [];
    }
}

// Utility function to write feedback to JSON file
async function writeFeedback(feedback) {
    try {
        await ensureDataDirectory();
        await fs.writeFile(FEEDBACK_FILE, JSON.stringify(feedback, null, 2));
    } catch (error) {
        throw new Error('Failed to write feedback to file');
    }
}

// POST /feedback - Add new feedback
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({
                error: 'Missing required fields: name, email, and message are required'
            });
        }

        // Email validation 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: 'Invalid email format'
            });
        }

        // Read existing feedback
        const feedbackList = await readFeedback();

        // Create new feedback object
        const newFeedback = {
            id: uuidv4(),
            name: name.trim(),
            email: email.trim().toLowerCase(),
            message: message.trim(),
            votes: 0
        };

        // Add to feedback list
        feedbackList.push(newFeedback);

        // Write back to file
        await writeFeedback(feedbackList);

        res.status(201).json({
            message: 'Feedback added successfully',
            feedback: newFeedback
        });

    } catch (error) {
        console.error('Error adding feedback:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// GET /feedback - Get all feedback
router.get('/', async (req, res) => {
    try {
        const feedbackList = await readFeedback();
        
        // Sort by votes in descending order (highest voted first)
        const sortedFeedback = feedbackList.sort((a, b) => b.votes - a.votes);
        
        res.status(200).json({
            message: 'Feedback retrieved successfully',
            count: sortedFeedback.length,
            feedback: sortedFeedback
        });

    } catch (error) {
        console.error('Error retrieving feedback:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// PUT /feedback/:id/vote - Upvote or downvote
router.put('/:id/vote', async (req, res) => {
    try {
        const { id } = req.params;
        const { action } = req.body; // 'upvote' or 'downvote'

        // Validation
        if (!action || (action !== 'upvote' && action !== 'downvote')) {
            return res.status(400).json({
                error: 'Invalid action. Use "upvote" or "downvote"'
            });
        }

        // Read existing feedback
        const feedbackList = await readFeedback();

        // Find feedback by ID
        const feedbackIndex = feedbackList.findIndex(feedback => feedback.id === id);
        
        if (feedbackIndex === -1) {
            return res.status(404).json({
                error: 'Feedback not found'
            });
        }

        // Update votes
        if (action === 'upvote') {
            feedbackList[feedbackIndex].votes += 1;
        } else {
            feedbackList[feedbackIndex].votes -= 1;
        }

        // Write back to file
        await writeFeedback(feedbackList);

        res.status(200).json({
            message: `Feedback ${action}d successfully`,
            feedback: feedbackList[feedbackIndex]
        });

    } catch (error) {
        console.error('Error voting on feedback:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// DELETE /feedback/:id - Delete feedback
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Read existing feedback
        const feedbackList = await readFeedback();

        // Find feedback by ID
        const feedbackIndex = feedbackList.findIndex(feedback => feedback.id === id);
        
        if (feedbackIndex === -1) {
            return res.status(404).json({
                error: 'Feedback not found'
            });
        }

        // Remove feedback
        const deletedFeedback = feedbackList.splice(feedbackIndex, 1)[0];

        // Write back to file
        await writeFeedback(feedbackList);

        res.status(200).json({
            message: 'Feedback deleted successfully',
            feedback: deletedFeedback
        });

    } catch (error) {
        console.error('Error deleting feedback:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

export default router;

