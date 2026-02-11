import express from 'express';
import { submitTriage, getQueue } from '../controllers/triageController.js';

const router = express.Router();

// Route for submitting symptoms
router.post('/triage', submitTriage);

// Route for fetching the queue
router.get('/queue', getQueue);

export default router;
