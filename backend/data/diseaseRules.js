const diseaseRules = [
  {
    name: 'Viral Fever',
    symptoms: ['fever', 'cough', 'headache'],
    tests: ['CBC', 'Blood Test'],
    riskLevel: 'Medium'
  },
  {
    name: 'Dengue',
    symptoms: ['fever', 'body pain', 'vomiting', 'weakness'],
    tests: ['CBC', 'NS1 Test'],
    riskLevel: 'High'
  },
  {
    name: 'Malaria',
    symptoms: ['fever', 'chills', 'sweating'],
    tests: ['Blood Smear', 'Malaria Test'],
    riskLevel: 'High'
  },
  {
    name: 'Typhoid',
    symptoms: ['fever', 'stomach pain', 'weakness'],
    tests: ['Widal Test', 'Blood Culture'],
    riskLevel: 'Medium'
  },
  {
    name: 'Cold',
    symptoms: ['cough', 'sore throat', 'runny nose'],
    tests: ['Physical Exam', 'Symptom Review'],
    riskLevel: 'Low'
  },
  {
    name: 'Food Poisoning',
    symptoms: ['vomiting', 'stomach pain', 'diarrhea'],
    tests: ['Stool Test', 'Physical Exam'],
    riskLevel: 'Medium'
  }
];

const normalizeSymptom = (value = '') => value.toLowerCase().trim();

const getDiseaseMatches = (selectedSymptoms = []) => {
  const normalizedSelectedSymptoms = selectedSymptoms.map(normalizeSymptom);

  return diseaseRules
    .map((disease) => {
      const matchedSymptoms = disease.symptoms.filter((symptom) =>
        normalizedSelectedSymptoms.includes(normalizeSymptom(symptom))
      );

      const coverage = disease.symptoms.length > 0
        ? matchedSymptoms.length / disease.symptoms.length
        : 0;
      const relevance = normalizedSelectedSymptoms.length > 0
        ? matchedSymptoms.length / normalizedSelectedSymptoms.length
        : 0;
      const match = Math.round(((coverage + relevance) / 2) * 100);

      return {
        disease: disease.name,
        match: Math.min(100, Math.max(0, match)),
        matchedSymptoms,
        tests: disease.tests,
        riskLevel: disease.riskLevel
      };
    })
    .sort((a, b) => b.match - a.match)
    .slice(0, 3);
};

const getRiskLevel = (topMatch = 0) => {
  if (topMatch >= 70) return 'High';
  if (topMatch >= 45) return 'Medium';
  return 'Low';
};

const getRecommendedTests = (topDisease = null) => {
  const disease = diseaseRules.find((item) => item.name === topDisease);
  return disease ? disease.tests : ['CBC', 'Physical Exam'];
};

export { diseaseRules, getDiseaseMatches, getRiskLevel, getRecommendedTests, normalizeSymptom };
