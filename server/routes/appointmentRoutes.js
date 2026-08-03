/**
 * APPOINTMENT ROUTES
 */
import { Router } from 'express';
import { validateAppointmentMiddleware } from '../middlewares/validateAppointment.js';
import { createAppointment } from '../controllers/appointmentController.js';

const router = Router();

// POST /api/appointment
router.post('/appointment', validateAppointmentMiddleware, createAppointment);

export default router;
