import express from 'express';
import { submitTriage, getQueue, completePatient, deletePatient } from '../controllers/triageController.js';

const router = express.Router();

// Route for submitting symptoms
router.post('/triage', submitTriage);

// Route for fetching the queue
router.get('/queue', getQueue);

// Route for marking a patient as completed
router.patch('/queue/:id/complete', completePatient);

// Route for deleting a patient
router.delete('/queue/:id', deletePatient);

export default router;
