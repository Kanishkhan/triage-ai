import Patient from '../models/Patient.js';
import { classifyUrgency } from '../services/aiService.js';
import { reorderQueue } from '../services/queueService.js';
import { getDepartment } from '../utils/departmentRules.js';

// @desc    Submit new triage info
// @route   POST /api/triage
// @access  Public
const submitTriage = async (req, res) => {
    try {
        const { symptoms } = req.body;

        if (!symptoms) {
            return res.status(400).json({ message: 'Symptoms are required' });
        }

        // 1. AI Classification
        const { urgencyLevel, riskFlag } = classifyUrgency(symptoms);

        // 2. Department Assignment
        const department = getDepartment(symptoms);

        // 3. Generate Token (Simple Auto-Increment)
        const lastPatient = await Patient.findOne().sort({ tokenNumber: -1 });
        const tokenNumber = lastPatient ? lastPatient.tokenNumber + 1 : 1;

        // 4. Save to Database
        const patient = new Patient({
            tokenNumber,
            symptoms,
            urgencyLevel,
            riskFlag,
            department,
        });

        await patient.save();

        res.status(201).json({
            tokenNumber: patient.tokenNumber,
            urgencyLevel: patient.urgencyLevel,
            riskFlag: patient.riskFlag,
            department: patient.department,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get sorted queue
// @route   GET /api/queue
// @access  Public (for dashboard)
const getQueue = async (req, res) => {
    try {
        const patients = await Patient.find({});

        // Sort using Queue Service
        const sortedQueue = reorderQueue(patients);

        res.json(sortedQueue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { submitTriage, getQueue };
