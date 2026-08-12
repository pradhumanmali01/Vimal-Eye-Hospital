/**
 * VIMAL EYE HOSPITAL — EXPRESS AI ROUTER
 */

import express from 'express';
import { handleAIChatStream } from '../controllers/aiChatController.js';

const router = express.Router();

router.post('/ai-chat', handleAIChatStream);

export default router;
