const classifyUrgency = (symptomText) => {
    const lowerText = symptomText.toLowerCase();

    let score = 0;

    // 1. Intensity Modifiers (+2 to score)
    const intensityKeywords = [
        'intense', 'severe', 'unbearable', 'excruciating', 'worst', 'very strong',
        'extremely', 'uncontrolled', 'sudden onset', 'heavy', 'profuse', 'high'
    ];

    // 2. Life-Threatening (Score 4 - Emergency)
    const emergencySymptoms = [
        'chest pain', 'shortness of breath', 'unconscious', 'seizure',
        'blurred vision', 'slurred speech', 'choking', 'cyanosis',
        'stroke', 'heart attack', 'cardiac', 'poisoning', 'suicidal'
    ];

    // 3. Significant (Score 2 - Urgent)
    const significantSymptoms = [
        'abdominal', 'stomach pain', 'fracture', 'broken', 'deep cut',
        'vomiting', 'diarrhea', 'burn', 'allergic', 'asthma', 'dehydration',
        'fainting', 'sweating', 'infection', 'bleeding'
    ];

    // 4. Minor (Score 1 - Normal unless intensity added)
    const minorSymptoms = [
        'fever', 'headache', 'nausea', 'dizzy', 'cold', 'cough',
        'sore throat', 'pain', 'injury', 'wound'
    ];

    // Check for intensity boosters
    const hasIntensity = intensityKeywords.some(keyword => lowerText.includes(keyword));
    if (hasIntensity) score += 2;

    // Score synthesis
    emergencySymptoms.forEach(s => {
        if (lowerText.includes(s)) score += 4;
    });

    significantSymptoms.forEach(s => {
        if (lowerText.includes(s)) score += 2;
    });

    minorSymptoms.forEach(s => {
        if (lowerText.includes(s)) score += 1;
    });

    // Classification Mapping
    if (score >= 4) {
        return {
            urgencyLevel: 'Emergency',
            riskFlag: true,
        };
    } else if (score >= 2) {
        return {
            urgencyLevel: 'Urgent',
            riskFlag: score >= 3,
        };
    }

    return {
        urgencyLevel: 'Normal',
        riskFlag: false,
    };
};

export { classifyUrgency };
