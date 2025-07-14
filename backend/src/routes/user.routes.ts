import express, { Request, Response } from 'express';
import { auth } from '../middleware/auth.middleware';
import { User } from '../models/user.model';
import { AuthRequest } from '../types';

const router = express.Router();

router.patch('/profile', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'profilePicture'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates!' });
    }

    updates.forEach((update) => {
      if (req.user && allowedUpdates.includes(update)) {
        (req.user as any)[update] = req.body[update];
      }
    });

    await req.user.save();
    res.json(req.user);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'An error occurred' });
  }
});

// Add logout route
router.post('/auth/logout', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    // Add the current token to the user's invalidated tokens array
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (token) {
      // If your User model doesn't have an invalidatedTokens field, you'll need to add it
      if (!req.user.invalidatedTokens) {
        req.user.invalidatedTokens = [];
      }
      
      // Add the token to the invalidated tokens array
      req.user.invalidatedTokens.push(token);
      await req.user.save();
    }
    
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to logout' });
  }
});

export default router;
