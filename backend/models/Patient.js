import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
    tokenNumber: {
        type: Number,
        required: true,
    },
    symptoms: {
        type: String,
        required: true,
    },
    urgencyLevel: {
        type: String,
        required: true,
        enum: ['Emergency', 'Urgent', 'Normal'],
    },
    riskFlag: {
        type: Boolean,
        required: true,
    },
    status: {
        type: String,
        enum: ['Waiting', 'Completed'],
        default: 'Waiting',
    },
    department: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
