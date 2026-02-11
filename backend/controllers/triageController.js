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
        console.log("SUBMITTING TRIAGE - Symptoms:", symptoms);

        if (!symptoms) {
            return res.status(400).json({ message: 'Symptoms are required' });
        }

        // 1. AI Classification
        const classification = classifyUrgency(symptoms);
        console.log("AI Result:", classification);
        const { urgencyLevel, riskFlag } = classification;

        // 2. Department Assignment
        const department = getDepartment(symptoms);
        console.log("Department assigned:", department);

        // 3. Generate Token
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
        console.log("Patient saved successfully!");

        res.status(201).json({
            tokenNumber: patient.tokenNumber,
            urgencyLevel: patient.urgencyLevel,
            riskFlag: patient.riskFlag,
            department: patient.department,
        });
    } catch (error) {
        console.error("TRIAGE SUBMISSION ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get sorted queue
// @route   GET /api/queue
// @access  Public (for dashboard)
const getQueue = async (req, res) => {
    try {
        const patients = await Patient.find({ status: 'Waiting' });

        // Sort using Queue Service
        const sortedQueue = reorderQueue(patients);

        res.json(sortedQueue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark patient as completed
// @route   PATCH /api/queue/:id/complete
// @access  Public
const completePatient = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        patient.status = 'Completed';
        await patient.save();

        res.json({ message: 'Patient processed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete patient record
// @route   DELETE /api/queue/:id
// @access  Public
const deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        res.json({ message: 'Patient record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { submitTriage, getQueue, completePatient, deletePatient };
