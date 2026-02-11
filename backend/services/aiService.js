const classifyUrgency = (symptomText) => {
    const lowerText = symptomText.toLowerCase();

    // Emergency Keywords
    const emergencyKeywords = [
        'chest pain',
        'breathing difficulty',
        'unconscious',
        'heavy bleeding',
        'sweating with dizziness',
    ];

    // Urgent Keywords
    const urgentKeywords = [
        'high fever',
        'severe pain',
        'vomiting',
        'fracture',
    ];

    // Check for Emergency
    for (const keyword of emergencyKeywords) {
        if (lowerText.includes(keyword)) {
            return {
                urgencyLevel: 'Emergency',
                riskFlag: true,
            };
        }
    }

    // Check for Urgent
    for (const keyword of urgentKeywords) {
        if (lowerText.includes(keyword)) {
            return {
                urgencyLevel: 'Urgent',
                riskFlag: false, // Urgent but not life-threatening immediately
            };
        }
    }

    // Default to Normal
    return {
        urgencyLevel: 'Normal',
        riskFlag: false,
    };
};

export { classifyUrgency };
