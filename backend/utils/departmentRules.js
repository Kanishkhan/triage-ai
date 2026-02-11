const getDepartment = (symptom) => {
    const lowerSymptom = symptom.toLowerCase();

    const rules = [
        { keywords: ['chest', 'heart', 'cardiac', 'palpitations', 'ekg'], dept: 'Cardiology' },
        { keywords: ['fracture', 'bone', 'joint', 'sprain', 'back pain', 'knee', 'shoulder'], dept: 'Orthopedics' },
        { keywords: ['breathing', 'lung', 'cough', 'asthma', 'shortness of breath', 'pneumonia'], dept: 'Pulmonology' },
        { keywords: ['brain', 'seizure', 'paralysis', 'numbness', 'headache', 'stroke', 'concussion'], dept: 'Neurology' },
        { keywords: ['child', 'baby', 'pediatric', 'infant', 'kid'], dept: 'Pediatrics' },
        { keywords: ['ear', 'nose', 'throat', 'ent', 'sinus', 'tonsils', 'hearing'], dept: 'ENT' },
        { keywords: ['eye', 'vision', 'blind', 'ophthalmo', 'glaucoma'], dept: 'Ophthalmology' },
        { keywords: ['skin', 'rash', 'itch', 'dermat', 'burn', 'acne', 'eczema'], dept: 'Dermatology' },
        { keywords: ['cancer', 'tumor', 'oncology', 'chemo'], dept: 'Oncology' },
        { keywords: ['stomach', 'digestion', 'vomit', 'diarrhea', 'gastric', 'abdominal', 'belly', 'intestine'], dept: 'Gastroenterology' },
    ];

    for (const rule of rules) {
        if (rule.keywords.some(k => lowerSymptom.includes(k))) {
            return rule.dept;
        }
    }

    return 'General Medicine';
};

export { getDepartment };
