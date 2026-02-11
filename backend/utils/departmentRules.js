const getDepartment = (symptom) => {
    const lowerSymptom = symptom.toLowerCase();

    if (lowerSymptom.includes('chest')) {
        return 'Cardiology';
    } else if (lowerSymptom.includes('fracture')) {
        return 'Orthopedics';
    } else if (lowerSymptom.includes('fever')) {
        return 'General Medicine';
    } else if (lowerSymptom.includes('breathing')) {
        return 'Pulmonology';
    } else {
        return 'General Medicine';
    }
};

export { getDepartment };
