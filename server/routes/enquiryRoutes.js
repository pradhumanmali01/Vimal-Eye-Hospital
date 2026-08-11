/**
 * ENQUIRY ROUTES
 */
import { Router } from 'express';
import { validateEnquiryMiddleware } from '../middlewares/validateEnquiry.js';
import { createEnquiry } from '../controllers/enquiryController.js';

const router = Router();

// POST /api/enquiry
router.post('/enquiry', validateEnquiryMiddleware, createEnquiry);

export default router;
