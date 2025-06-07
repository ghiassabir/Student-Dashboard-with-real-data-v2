// --- Initial Data Structure & Global Variables ---
// This currentStudentData object will be populated with fetched and transformed data.
let currentStudentData = {
    name: "Loading Data...", // Initial placeholder
    targetScore: 1400, // Default target score
    latestScores: { total: 0, rw: 0, math: 0, avgEocKhan: 0, classAvgTotal: 'N/A', classAvgRW: 'N/A', classAvgMath: 'N/A', classAvgEocKhan: 'N/A' },
    timeSpent: { studentAvg: 0, studentUnit: "min / assessment", classAvg: 0, classUnit: "min / assessment"},
    scoreTrend: { labels: [], studentScores: [], classAvgScores: [] },
    overallSkillPerformance: { labels: [], studentAccuracy: [], classAvgAccuracy: [] },

    cbPracticeTests: [],
    eocQuizzes: {
        reading: [],
        writing: [],
        math: []
    },
    khanAcademy: {
        reading: [],
        writing: [],
        math: []
    },
    skills: { // Will be populated by subject
        reading: [],
        writing: [],
        math: []
    },
    // Static mapping of chapters (from your previous code)
    chapters: {
        math: [
            "1: Exponents & Radicals", "2: Percent", "3: Exponential & Linear Growth",
            "4: Rates", "5: Ratio & Proportion", "6: Expressions", "7: Constructing Models",
            "8: Manipulating & Solving Equations", "9: More Equation Solving Strategies",
            "10: Systems of Equations", "11: Inequalities", "12: Word Problems",
            "13: Min & Max Word Problems", "14: Lines", "15: Interpreting Linear Models",
            "16: Functions", "17: Quadratics", "18: Synthetic Division", "19: Complex Numbers",
            "20: Absolute Value", "21: Angles", "22: Triangles", "23: Circles", "24: Trigonometry",
            "25: Reading Data", "26: Probability", "27: Statistics 1", "28: Statistics 2", "29: Volume"
        ],
        writing: [
            "1: Transitions", "2: Specific Focus", "3: Sentences & Fragments",
            "4: Joining & Separating Sentences", "5: Joining Sentences & Fragments",
            "6: Non-Essential & Essential Clauses", "7: Additional Comma Uses & Misuses",
            "8: Verbs Agreements and Tense", "9: Pronouns", "10: Apostrophes",
            "11: Modification", "12: Parallel Structure", "13: Word Pairs", "14: Question Marks",
            "Appendix: Parts of Speech"
        ],
        reading: [
            "1: Overview of SAT Reading", "2: Vocabulary in Context", "3: Making the Leap",
            "4: The Big Picture", "5: Literal Comprehension", "6: Reading for Function",
            "7: Text Completions", "8: Supporting & Undermining", "9: Graphs & Charts",
            "10: Paired Passages", "Appendix: Question Types"
        ]
    }
};

// Global array to hold all questions for easy access (populated after data transformation)
let ALL_DASHBOARD_QUESTIONS = [];

// --- MAPPING SAT SKILLS TO BOOK CHAPTERS (extracted from your PDF) ---
const SAT_CHAPTER_SKILL_MAPPING = {
    math: {
        "Understanding and applying properties of exponents": ["1: Exponents & Radicals"],
        "working with radical expressions": ["1: Exponents & Radicals"],
        "understanding rational exponents": ["1: Exponents & Radicals"],
        "Calculating and applying percentages": ["2: Percent"],
        "percent increase/decrease": ["2: Percent"],
        "solving word problems involving percents": ["2: Percent"],
        "Identifying, interpreting, and comparing linear and exponential growth models": ["3: Exponential & Linear Growth"],
        "creating and solving equations from these models": ["3: Exponential & Linear Growth"],
        "Calculating and applying rates, including unit rates, speed, and work rates": ["4: Rates"],
        "unit conversions": ["4: Rates"],
        "Setting up and solving problems involving ratios and proportions": ["5: Ratio & Proportion"],
        "Manipulating and simplifying algebraic expressions, including polynomials": ["6: Expressions"],
        "factoring": ["6: Expressions"],
        "Translating word problems into algebraic equations or inequalities": ["7: Constructing Models"],
        "creating linear and nonlinear models": ["7: Constructing Models"],
        "Solving linear equations in one or more variables": ["8: Manipulating & Solving Equations"],
        "solving various forms of nonlinear equations": ["8: Manipulating & Solving Equations"],
        "Applying advanced strategies to solve complex equations, including those involving quadratics, absolute values, and systems": ["9: More Equation Solving Strategies"],
        "Solving systems of two linear equations in two variables using various methods (substitution, elimination)": ["10: Systems of Equations"],
        "Solving linear inequalities in one or two variables": ["11: Inequalities"],
        "graphing solutions": ["11: Inequalities"],
        "Applying algebraic and arithmetic skills to solve a variety of contextualized problems": ["12: Word Problems"],
        "Solving optimization problems, often by finding the vertex of a quadratic function or analyzing inequalities": ["13: Min & Max Word Problems"],
        "Understanding and applying properties of lines, including slope, intercepts, and equations of lines": ["14: Lines"],
        "Interpreting the slope and intercepts of linear models in context": ["15: Interpreting Linear Models"],
        "making predictions (linear models)": ["15: Interpreting Linear Models"],
        "Understanding function notation, domain, range": ["16: Functions"],
        "evaluating functions": ["16: Functions"],
        "transformations (functions)": ["16: Functions"],
        "composition of functions": ["16: Functions"],
        "Solving quadratic equations (factoring, quadratic formula, completing the square)": ["17: Quadratics"],
        "graphing parabolas": ["17: Quadratics"],
        "understanding properties of quadratic functions": ["17: Quadratics"],
        "Performing polynomial division (specifically synthetic division)": ["18: Synthetic Division"],
        "finding roots of polynomials": ["18: Synthetic Division"],
        "Performing operations with complex numbers": ["19: Complex Numbers"],
        "Solving equations and inequalities involving absolute value": ["20: Absolute Value"],
        "Understanding and applying angle relationships": ["21: Angles"],
        "Applying properties of triangles, including Pythagorean theorem, similar triangles, special right triangles, and basic trigonometric ratios": ["22: Triangles"],
        "Understanding and applying properties of circles, including equations, radius, diameter, circumference, area, arc length, and sector area": ["23: Circles"],
        "Applying trigonometric ratios (sine, cosine, tangent) in right triangles": ["24: Trigonometry"],
        "understanding radians and the unit circle (basics)": ["24: Trigonometry"],
        "Interpreting and analyzing data presented in tables, charts, and graphs (scatterplots, bar graphs, line graphs)": ["25: Reading Data"],
        "Calculating basic probabilities, including compound events": ["26: Probability"],
        "Calculating and interpreting measures of central tendency (mean, median, mode) and spread (range)": ["27: Statistics 1"],
        "Understanding standard deviation, distributions (like normal distribution basics), and basic statistical inference": ["28: Statistics 2"],
        "Calculating the volume of 3D shapes (e.g., prisms, cylinders, cones, spheres)": ["29: Volume"]
    },
    writing: {
        "Choosing the most logical and effective transition words or phrases to connect ideas, sentences, and paragraphs": ["1: Transitions"],
        "Ensuring writing is concise, precise, and directly relevant to the rhetorical situation or main idea": ["2: Specific Focus"],
        "eliminating redundancy": ["2: Specific Focus"],
        "Identifying and correcting sentence fragments and run-on sentences": ["3: Sentences & Fragments"],
        "ensuring complete sentence structures": ["3: Sentences & Fragments"],
        "Correctly using punctuation (commas, semicolons, colons) and conjunctions to join or separate independent and dependent clauses": ["4: Joining & Separating Sentences"],
        "Advanced application of rules for combining clauses and phrases, avoiding fragments and run-ons": ["5: Joining Sentences & Fragments"],
        "Correctly punctuating restrictive (essential) and non-restrictive (non-essential) clauses, primarily with commas": ["6: Non-Essential & Essential Clauses"],
        "Applying comma rules for items in a series, introductory elements, appositives, interrupters, and avoiding common misuses like comma splices": ["7: Additional Comma Uses & Misuses"],
        "Ensuring subject-verb agreement and consistent, appropriate verb tense": ["8: Verbs Agreements and Tense"],
        "Ensuring pronoun-antecedent agreement, correct pronoun case (subjective, objective, possessive), and clear pronoun reference": ["9: Pronouns"],
        "Correctly using apostrophes for possessive nouns, possessive pronouns (or lack thereof), and contractions": ["10: Apostrophes"],
        "Ensuring modifiers (adjectives, adverbs, phrases, clauses) are correctly placed to modify the intended word and avoiding dangling or misplaced modifiers": ["11: Modification"],
        "Maintaining parallel grammatical structure for items in a list, series, or comparison": ["12: Parallel Structure"],
        "Choosing the correct word from commonly confused pairs (e.g., affect/effect)": ["13: Word Pairs"],
        "understanding idiomatic expressions": ["13: Word Pairs"],
        "Correctly using question marks at the end of direct questions": ["14: Question Marks"],
        "Understanding the function of different parts of speech as a foundation for other grammar rules": ["Appendix: Parts of Speech"]
    },
    reading: {
        "Understanding the overall structure and approach to the Reading and Writing section": ["1: Overview of SAT Reading"],
        "Determining the meaning of words and phrases as they are used in particular contexts within the passage": ["2: Vocabulary in Context"],
        "Drawing logical inferences and conclusions based on information stated or implied in the text": ["3: Making the Leap"],
        "Identifying the main idea or central theme of a passage or a significant portion of it": ["4: The Big Picture"],
        "Locating and understanding explicitly stated information and details within the text": ["5: Literal Comprehension"],
        "Analyzing how specific words, phrases, sentences, or paragraphs contribute to the author's overall purpose, argument, or the structure of the text": ["6: Reading for Function"],
        "Choosing words/phrases that best complete the meaning/logic of a portion of text": ["7: Text Completions"],
        "Identifying textual evidence that best supports a given claim or identifying claims/evidence that would undermine an argument": ["8: Supporting & Undermining"],
        "Interpreting data presented in tables, graphs, and charts, and integrating that information with textual information": ["9: Graphs & Charts"],
        "Analyzing the relationship between two related texts, including identifying points of agreement/disagreement, or how one text responds to/elaboates on the other": ["10: Paired Passages"],
        "Reviewing various question formats and strategies for approaching them": ["Appendix: Question Types"]
    }
};

// --- Helper for Mapping Raw Assessment Names to Friendly Names (EOC, Khan, CB Tests) ---
const ASSESSMENT_NAME_MAP = {
    // Reading EOC
    "R-EOC-C1-OverviewSATReading": "Reading: Overview of SAT Reading",
    "R-EOC-C2-VocabInContext": "Reading: Vocabulary in Context",
    "R-EOC-C3-MakingTheLeap": "Reading: Making the Leap",
    "R-EOC-C4-TheBigPicture": "Reading: The Big Picture",
    "R-EOC-C5-LiteralComprehension": "Reading: Literal Comprehension",
    "R-EOC-C6-ReadingForFunction": "Reading: Reading for Function",
    "R-EOC-C7-TextCompletions": "Reading: Text Completions",
    "R-EOC-C8-SupportingUndermining": "Reading: Supporting & Undermining",
    "R-EOC-C9-GraphsCharts": "Reading: Graphs & Charts",
    "R-EOC-C10-PairedPassages": "Reading: Paired Passages",
    // Writing EOC
    "W-EOC-C1-Transitions": "Writing: Transitions",
    "W-EOC-C2-SpecificFocus": "Writing: Specific Focus",
    "W-EOC-C3-SentencesFragments": "Writing: Sentences & Fragments",
    "W-EOC-C4-JoiningSeparating": "Writing: Joining & Separating Sentences",
    "W-EOC-C5-JoiningSentencesFragments": "Writing: Joining Sentences & Fragments",
    "W-EOC-C6-NonEssentialEssential": "Writing: Non-Essential & Essential Clauses",
    "W-EOC-C7-VerbAgreement": "Writing: Verbs Agreements and Tense",
    "W-EOC-C8-Pronouns": "Writing: Pronouns",
    "W-EOC-C9-Apostrophes": "Writing: Apostrophes",
    "W-EOC-C10-Modification": "Writing: Modification",
    "W-EOC-C11-ParallelStructure": "Writing: Parallel Structure",
    "W-EOC-C12-WordPairs": "Writing: Word Pairs",
    "W-EOC-C13-QuestionMarks": "Writing: Question Marks",
    // Math EOC
    "M-EOC-C1-ExponentsRadicals": "Math: Exponents & Radicals",
    "M-EOC-C2-Percent": "Math: Percent",
    "M-EOC-C3-ExponentialLinearGrowth": "Math: Exponential & Linear Growth",
    "M-EOC-C4-Rates": "Math: Rates",
    "M-EOC-C5-RatioProportion": "Math: Ratio & Proportion",
    "M-EOC-C6-Expressions": "Math: Expressions",
    "M-EOC-C7-ConstructingModels": "Math: Constructing Models",
    "M-EOC-C8-ManipulatingSolvingEquations": "Math: Manipulating & Solving Equations",
    "M-EOC-C9-MoreEquationSolving": "Math: More Equation Solving Strategies",
    "M-EOC-C10-SystemsOfEquations": "Math: Systems of Equations",
    "M-EOC-C11-Inequalities": "Math: Inequalities",
    "M-EOC-C12-WordProblems": "Math: Word Problems",
    "M-EOC-C13-MinMaxWordProblems": "Math: Min & Max Word Problems",
    "M-EOC-C14-Lines": "Math: Lines",
    "M-EOC-C15-InterpretingLinearModels": "Math: Interpreting Linear Models",
    "M-EOC-C16-Functions": "Math: Functions",
    "M-EOC-C17-Quadratics": "Math: Quadratics",
    "M-EOC-C18-SyntheticDivision": "Math: Synthetic Division",
    "M-EOC-C19-ComplexNumbers": "Math: Complex Numbers",
    "M-EOC-C20-AbsoluteValue": "Math: Absolute Value",
    "M-EOC-C21-Angles": "Math: Angles",
    "M-EOC-C22-Triangles": "Math: Triangles",
    "M-EOC-C23-Circles": "Math: Circles",
    "M-EOC-C24-Trigonometry": "Math: Trigonometry",
    "M-EOC-C25-ReadingData": "Math: Reading Data",
    "M-EOC-C26-Probability": "Math: Probability",
    "M-EOC-C27-Statistics1": "Math: Statistics 1",
    "M-EOC-C28-Statistics2": "Math: Statistics 2",
    "M-EOC-C29-Volume": "Math: Volume",
    // Khan Academy (example mapping, expand as needed)
    "Khan: Writing - Transitions Master": "Khan Academy: Transitions Master",
    "Khan: Grammar - Punctuation Rules": "Khan Academy: Punctuation Rules",
    "Khan: Reading - Inference Drill": "Khan Academy: Inference Drill",
    "Khan: Geometry Shape Problems": "Khan Academy: Geometry Problems",
    "Khan: Algebra Foundations Quiz": "Khan Academy: Algebra Foundations",
    "Khan: Vocab Power Practice": "Khan Academy: Vocabulary Power",
    // CB Test friendly names (from your feedback)
    "DG-T0": "Diagnostic Test",
    "CB-T4": "CB Test 4",
    "CB-T5": "CB Test 5",
    "CB-T6": "CB Test 6",
    "CB-T7": "CB Test 7",
    "CB-T8": "CB Test 8",
    "CB-T9": "CB Test 9",
    "CB-T10": "CB Test 10",
    "CBDBQ01": "Diagnostic Practice Quiz" // Changed from Test to Quiz as it appears in EOC context
};

// --- Helper Functions ---

// Helper to determine subject from skill tag
function getSubjectFromSkillTag(skillTag) {
    if (!skillTag || typeof skillTag !== 'string' || skillTag.includes('TBD_No_Correlation_Or_CustomQID')) return 'unknown';
    const lowerSkill = skillTag.toLowerCase();
    if (lowerSkill.includes('reading') || lowerSkill.includes('paired passages') || lowerSkill.includes('text completions') || lowerSkill.includes('main idea') || lowerSkill.includes('vocabulary in context') || lowerSkill.includes('literal') || lowerSkill.includes('big picture') || lowerSkill.includes('graphs')) return 'reading';
    if (lowerSkill.includes('writing') || lowerSkill.includes('grammar') || lowerSkill.includes('punctuation') || lowerSkill.includes('transitions') || lowerSkill.includes('sentence structure') || lowerSkill.includes('conventions') || lowerSkill.includes('expression of ideas')) return 'writing';
    if (lowerSkill.includes('math') || lowerSkill.includes('algebra') || lowerSkill.includes('geometry') || lowerSkill.includes('equations') || lowerSkill.includes('functions') || lowerSkill.includes('statistics') || lowerSkill.includes('numbers') || lowerSkill.includes('data analysis') || lowerSkill.includes('problem solving')) return 'math';
    return 'unknown';
}

// Helper to determine subject from assessment name for EOC/Khan
function getSubjectFromAssessmentName(assessmentName) {
    if (!assessmentName || typeof assessmentName !== 'string') return 'unknown';
    const lowerName = assessmentName.toLowerCase();
    if (lowerName.startsWith('r-eoc') || lowerName.includes('reading')) return 'reading';
    if (lowerName.startsWith('w-eoc') || lowerName.includes('writing') || lowerName.includes('grammar')) return 'writing';
    if (lowerName.startsWith('m-eoc') || lowerName.includes('math') || lowerName.includes('algebra') || lowerName.includes('geometry')) return 'math';
    return 'unknown';
}

// Helper for color-coded arrows based on student vs class performance
function getPerformanceArrow(studentScore, classAvg) {
    // Ensure scores are numbers for comparison, return empty if invalid
    const sScore = parseFloat(studentScore);
    const cAvg = parseFloat(classAvg);

    if (isNaN(sScore) || isNaN(cAvg)) return '';
    if (sScore > cAvg) return '<span class="text-good">↑</span>';
    if (sScore < cAvg) return '<span class="text-poor">↓</span>';
    return ''; // No arrow if equal
}

// Date Formatting Helper
function formatDate(dateString) {
    if (!dateString || dateString === "N/A" || dateString === "Not Attempted" || dateString === "-") return dateString;
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) { // If direct parse fails, try with 'T00:00:00'
            const dateWithTime = new Date(dateString + 'T00:00:00');
            if (!isNaN(dateWithTime.getTime())) {
                dateString = dateWithTime;
            } else {
                return dateString; // Return original string if all parsing fails
            }
        }
        const d = new Date(dateString);
        const day = d.getDate();
        const month = d.toLocaleString('default', { month: 'short' });
        const year = d.getFullYear();
        return `${day} ${month}, ${year}`;
    } catch (e) {
        console.error("Error formatting date:", dateString, e);
        return dateString;
    }
}

// --- Data Fetching ---
const CSV_URLS = {
    aggregatedScores: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSySYBO9YL3N4aUG3JEYZMQQIv9d1oSm3ba4Ty9Gt4SsGs2zmTS_k81rH3Qv41mZvClnayNcDpl_QbI/pub?gid=1890969747&single=true&output=csv', // DashboardFeed_AggregatedScores from Phase 1
    questionDetails: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRJl8XYak_fAzpuboA6GgOO-hEMd6rP_X9BD7ruZ-pSnIGKkd27uGmP2ZWeBcwSvSKsafObcXDOW080/pub?gid=822014112&single=true&output=csv' // DashboardFeed_QuestionDetails from Phase 2
};

async function fetchCsvData(url) {
    console.log(`Fetching data from: ${url}`);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csvText = await response.text();
        return new Promise((resolve, reject) => {
            Papa.parse(csvText, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: function(results) {
                    if (results.errors.length) {
                        console.warn(`PapaParse warnings for ${url}:`, results.errors);
                    }
                    console.log(`Successfully parsed ${results.data.length} rows from ${url}`);
                    if (results.meta && results.meta.fields) {
                        console.log(`Headers for ${url}:`, results.meta.fields);
                    }
                    resolve(results.data);
                }
            });
        });
    } catch (error) {
        console.error(`Could not fetch or parse CSV from ${url}:`, error);
        return [];
    }
}

// --- Data Transformation ---
function transformRawData(aggregatedScoresData, questionDetailsData) {
    console.log("Starting data transformation...");

    // Target student based on feedback, if available, otherwise first student in data
    const targetStudentGmailID = 'aisha.malik@example.pk'; 
    
    const studentAggregatedScores = aggregatedScoresData.filter(row => row.StudentGmailID === targetStudentGmailID);
    const studentQuestionDetails = questionDetailsData.filter(row => row.StudentGmailID === targetStudentGmailID);

    // Default to first student if target not found or data is empty
    const actualStudentFullName = studentAggregatedScores.length > 0 ? studentAggregatedScores[0]['StudentFullName'] : (aggregatedScoresData.length > 0 ? aggregatedScoresData[0]['StudentFullName'] : "Unknown Student");
    const actualStudentTargetScore = studentAggregatedScores.length > 0 ? studentAggregatedScores[0]['StudentTargetScore'] : 1400;

    let transformedData = {
        studentName: actualStudentFullName,
        targetScore: actualStudentTargetScore,
        latestScores: { total: 0, rw: 0, math: 0, avgEocKhan: 'N/A', classAvgTotal: 'N/A', classAvgRW: 'N/A', classAvgMath: 'N/A', classAvgEocKhan: 'N/A' },
        timeSpent: { studentAvg: 0, studentUnit: "min / assessment", classAvg: 0, classUnit: "min / assessment"},
        scoreTrend: { labels: [], studentScores: [], classAvgScores: [] },
        overallSkillPerformance: { labels: [], studentAccuracy: [], classAvgAccuracy: [] },

        cbPracticeTests: [],
        eocQuizzes: { reading: [], writing: [], math: [] },
        khanAcademy: { reading: [], writing: [], math: [] },
        skills: { reading: [], writing: [], math: [] },
        chapters: SAT_CHAPTER_SKILL_MAPPING // Reference the global constant
    };

    // --- Process CB Practice Tests from Aggregated Scores ---
    // Definitive list of official CB Tests for display
    const allOfficialCBTNames = [ "DG-T0", "CB-T4", "CB-T5", "CB-T6", "CB-T7", "CB-T8", "CB-T9", "CB-T10" ]; 
    const mainCBTestSource = 'Canvas CB Test';

    const processedCbTests = {}; // To store processed test data

    studentAggregatedScores.forEach(row => {
        // Filter for main CB Tests with valid scores
        if (row.AssessmentSource === mainCBTestSource && allOfficialCBTNames.includes(row.AssessmentName) && row.ScaledScore_Total !== null && row.ScaledScore_Total !== '-') {
            if (!processedCbTests[row.AssessmentName]) { // Avoid processing the same test multiple times
                const testQuestions = studentQuestionDetails.filter(q => q.AssessmentName === row.AssessmentName)
                    .map(qRow => ({
                        id: `${qRow.AssessmentName}-Q${qRow.QuestionSequenceInQuiz}`,
                        subject: getSubjectFromSkillTag(qRow.SAT_Skill_Tag),
                        skill: qRow.SAT_Skill_Tag,
                        difficulty: qRow.Difficulty,
                        yourAnswer: String(qRow.StudentAnswer),
                        correctAnswer: (qRow.IsCorrect === true) ? String(qRow.StudentAnswer) : "Not provided in raw data", // Correct answer text not in this CSV
                        isCorrect: qRow.IsCorrect,
                        explanation: "No explanation provided in raw data.",
                        yourTime: qRow.TimeSpentOnQuestion_Seconds,
                        classAvgTime: qRow.TimeSpentOnQuestion_Seconds, // Assuming class average time is the same as student's for now or needs another source
                        classPerformance: {
                            correct: qRow.ClassAveragePoints_Question !== null && qRow.PointsPossible_Question !== null && qRow.PointsPossible_Question > 0 ?
                                Math.round((qRow.ClassAveragePoints_Question / qRow.PointsPossible_Question) * 100) : 0,
                            incorrect: 0, unanswered: 0 // Not available in this CSV
                        },
                        source: row.AssessmentSource,
                        text: qRow.QuestionText_fromMetadata
                    }));

                processedCbTests[row.AssessmentName] = {
                    name: row.AssessmentName,
                    displayName: ASSESSMENT_NAME_MAP[row.AssessmentName] || row.AssessmentName,
                    date: row.AttemptDate,
                    rw: row.ScaledScore_RW,
                    math: row.ScaledScore_Math,
                    total: row.ScaledScore_Total,
                    classAvgTotal: row.ClassAverageScore_Normalized,
                    classAvgRW: 'N/A', // Not available in headers
                    classAvgMath: 'N/A', // Not available in headers
                    questions: testQuestions
                };
            }
        }
    });

    // Populate transformedData.cbPracticeTests with all official tests, marking unattempted ones
    allOfficialCBTNames.forEach(testName => {
        if (processedCbTests[testName]) {
            transformedData.cbPracticeTests.push(processedCbTests[testName]);
        } else {
            transformedData.cbPracticeTests.push({
                name: testName,
                displayName: ASSESSMENT_NAME_MAP[testName] || testName,
                date: "Not Attempted",
                rw: "-", math: "-", total: "-",
                classAvgTotal: '-', classAvgRW: '-', classAvgMath: '-',
                questions: []
            });
        }
    });

    // Sort CB Tests (attempted first, then by date)
    transformedData.cbPracticeTests.sort((a, b) => {
        const dateA = a.date !== "Not Attempted" ? new Date(a.date) : null;
        const dateB = b.date !== "Not Attempted" ? new Date(b.date) : null;

        if (dateA && dateB) return dateA - dateB;
        if (dateA) return -1;
        if (dateB) return 1;
        return a.displayName.localeCompare(b.displayName); // Sort by display name if both unattempted
    });

    // --- Populate Score Trend ---
    const attemptedCbTestsForTrend = transformedData.cbPracticeTests.filter(t => t.date !== "Not Attempted" && t.total !== null && t.total !== "-");

    transformedData.scoreTrend.labels = attemptedCbTestsForTrend.map(t => formatDate(t.date) + ` (${t.displayName})`);
    transformedData.scoreTrend.studentScores = attemptedCbTestsForTrend.map(t => t.total);
    transformedData.scoreTrend.classAvgScores = attemptedCbTestsForTrend.map(t => t.classAvgTotal);

    // --- Calculate Latest Scores (for KPI cards) ---
    const latestTest = attemptedCbTestsForTrend.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    if (latestTest) {
        transformedData.latestScores.total = latestTest.total;
        transformedData.latestScores.rw = latestTest.rw;
        transformedData.latestScores.math = latestTest.math;
        transformedData.latestScores.classAvgTotal = latestTest.classAvgTotal;
        transformedData.latestScores.classAvgRW = latestTest.classAvgRW;
        transformedData.latestScores.classAvgMath = latestTest.classAvgMath;
    }

    // --- Process EOC Quizzes and Khan Academy ---
    const assessmentsBySourceAndName = {}; // Temp structure: {source: {name: [qRow, qRow, ...]}}
    studentQuestionDetails.forEach(qRow => {
        const source = qRow.AssessmentSource;
        const name = qRow.AssessmentName;
        if (!assessmentsBySourceAndName[source]) assessmentsBySourceAndName[source] = {};
        if (!assessmentsBySourceAndName[source][name]) assessmentsBySourceAndName[source][name] = [];
        assessmentsBySourceAndName[source][name].push(qRow);
    });

    const subjects = ['reading', 'writing', 'math'];

    // EOC Quizzes
    subjects.forEach(subject => {
        // Collect all possible EOC assessment names for this subject from the map
        const subjectEOCNames = Object.keys(ASSESSMENT_NAME_MAP).filter(key => key.startsWith(`${subject.toUpperCase().charAt(0)}-EOC`));

        subjectEOCNames.forEach(rawName => {
            const questionsForAssessment = assessmentsBySourceAndName['Canvas EOC Practice']?.[rawName];
            const matchingAggregatedScore = studentAggregatedScores.find(s => s.AssessmentSource === 'Canvas EOC Practice' && s.AssessmentName === rawName);

            const quizEntry = {
                name: ASSESSMENT_NAME_MAP[rawName] || rawName,
                rawName: rawName,
                date: matchingAggregatedScore ? matchingAggregatedScore.AttemptDate : "Not Attempted",
                latestScore: matchingAggregatedScore ? `${matchingAggregatedScore.Score_Percentage}%${matchingAggregatedScore.Score_Raw_Combined !== null ? ` (${matchingAggregatedScore.Score_Raw_Combined}/${matchingAggregatedScore.PointsPossible_Combined})` : ''}` : "N/A",
                classAvgScore: matchingAggregatedScore ? `${matchingAggregatedScore.ClassAverageScore_Normalized}%` : "N/A",
                questions: []
            };

            if (questionsForAssessment) {
                 quizEntry.questions = questionsForAssessment.map(qRow => ({
                    id: `${rawName}-Q${qRow.QuestionSequenceInQuiz}`,
                    subject: getSubjectFromSkillTag(qRow.SAT_Skill_Tag),
                    skill: qRow.SAT_Skill_Tag,
                    difficulty: qRow.Difficulty,
                    yourAnswer: String(qRow.StudentAnswer),
                    correctAnswer: (qRow.IsCorrect === true) ? String(qRow.StudentAnswer) : "Not provided in raw data",
                    isCorrect: qRow.IsCorrect,
                    explanation: "No explanation provided in raw data.",
                    yourTime: qRow.TimeSpentOnQuestion_Seconds,
                    classAvgTime: qRow.TimeSpentOnQuestion_Seconds, // Assuming this is class average time for question
                    classPerformance: {
                        correct: qRow.ClassAveragePoints_Question !== null && qRow.PointsPossible_Question !== null && qRow.PointsPossible_Question > 0 ?
                            Math.round((qRow.ClassAveragePoints_Question / qRow.PointsPossible_Question) * 100) : 0,
                        incorrect: 0, unanswered: 0
                    },
                    source: 'Canvas EOC Practice',
                    text: qRow.QuestionText_fromMetadata
                }));
            }
            transformedData.eocQuizzes[subject].push(quizEntry);
        });
        transformedData.eocQuizzes[subject].sort((a,b) => a.name.localeCompare(b.name));
    });

    // Khan Academy
    subjects.forEach(subject => {
        // Collect all possible Khan assessment names for this subject from the map
        const subjectKhanNames = Object.keys(ASSESSMENT_NAME_MAP).filter(key => key.startsWith('Khan:') && getSubjectFromAssessmentName(key) === subject);

        subjectKhanNames.forEach(rawName => {
            const questionsForAssessment = assessmentsBySourceAndName['Khan Academy Practice']?.[rawName];
            const matchingAggregatedScore = studentAggregatedScores.find(s => s.AssessmentSource === 'Khan Academy Practice' && s.AssessmentName === rawName);

            const khanEntry = {
                name: ASSESSMENT_NAME_MAP[rawName] || rawName,
                rawName: rawName,
                date: matchingAggregatedScore ? matchingAggregatedScore.AttemptDate : "Not Attempted",
                latestScore: matchingAggregatedScore ? `${matchingAggregatedScore.Score_Percentage}%${matchingAggregatedScore.Score_Raw_Combined !== null ? ` (${matchingAggregatedScore.Score_Raw_Combined}/${matchingAggregatedScore.PointsPossible_Combined})` : ''}` : "N/A",
                classAvgScore: matchingAggregatedScore ? `${matchingAggregatedScore.ClassAverageScore_Normalized}%` : "N/A",
                questions: []
            };

            if (questionsForAssessment) {
                 khanEntry.questions = questionsForAssessment.map(qRow => ({
                    id: `${rawName}-Q${qRow.QuestionSequenceInQuiz}`,
                    subject: getSubjectFromSkillTag(qRow.SAT_Skill_Tag),
                    skill: qRow.SAT_Skill_Tag,
                    difficulty: qRow.Difficulty,
                    yourAnswer: String(qRow.StudentAnswer),
                    correctAnswer: (qRow.IsCorrect === true) ? String(qRow.StudentAnswer) : "Not provided in raw data",
                    isCorrect: qRow.IsCorrect,
                    explanation: "No explanation provided in raw data.",
                    yourTime: qRow.TimeSpentOnQuestion_Seconds,
                    classAvgTime: qRow.TimeSpentOnQuestion_Seconds, // Assuming this is class average time for question
                    classPerformance: {
                        correct: qRow.ClassAveragePoints_Question !== null && qRow.PointsPossible_Question !== null && qRow.PointsPossible_Question > 0 ?
                            Math.round((qRow.ClassAveragePoints_Question / qRow.PointsPossible_Question) * 100) : 0,
                        incorrect: 0, unanswered: 0
                    },
                    source: 'Khan Academy Practice',
                    text: qRow.QuestionText_fromMetadata
                }));
            }
            transformedData.khanAcademy[subject].push(khanEntry);
        });
        transformedData.khanAcademy[subject].sort((a,b) => a.name.localeCompare(b.name));
    });


    // --- Calculate Avg EOC/Khan Score for KPI ---
    const allAttemptedEocKhanAssessments = [
        ...Object.values(transformedData.eocQuizzes).flat(),
        ...Object.values(transformedData.khanAcademy).flat()
    ].filter(a => a.latestScore !== "N/A" && a.latestScore !== "-");

    const studentEocKhanPercentages = allAttemptedEocKhanAssessments
        .map(a => parseFloat(String(a.latestScore).match(/(\d+)%/)?.[1]))
        .filter(score => !isNaN(score) && score > 0);

    const classEocKhanPercentages = allAttemptedEocKhanAssessments
        .map(a => parseFloat(String(a.classAvgScore).match(/(\d+)%/)?.[1]))
        .filter(score => !isNaN(score) && score > 0);

    if (studentEocKhanPercentages.length > 0) {
        transformedData.latestScores.avgEocKhan = Math.round(studentEocKhanPercentages.reduce((sum, score) => sum + score, 0) / studentEocKhanPercentages.length);
    } else {
        transformedData.latestScores.avgEocKhan = 'N/A';
    }

    if (classEocKhanPercentages.length > 0) {
        transformedData.latestScores.classAvgEocKhan = Math.round(classEocKhanPercentages.reduce((sum, score) => sum + score, 0) / classEocKhanPercentages.length);
    } else {
        transformedData.latestScores.classAvgEocKhan = 'N/A';
    }


    // --- Calculate Skill Performance ---
    const skillAggregations = {}; // skillName: { studentCorrect, studentTotal, classSumPoints, classTotalPossiblePoints }

    studentQuestionDetails.forEach(qRow => {
        const skill = qRow.SAT_Skill_Tag;
        if (!skill || String(skill).includes('TBD_No_Correlation_Or_CustomQID')) return;

        if (!skillAggregations[skill]) {
            skillAggregations[skill] = { studentCorrect: 0, studentTotal: 0, classSumPoints: 0, classTotalPossible: 0 };
        }
        skillAggregations[skill].studentTotal++;
        if (qRow.IsCorrect === true) {
            skillAggregations[skill].studentCorrect++;
        }
        if (qRow.ClassAveragePoints_Question !== null && qRow.PointsPossible_Question !== null && qRow.PointsPossible_Question > 0) {
            skillAggregations[skill].classSumPoints += qRow.ClassAveragePoints_Question;
            skillAggregations[skill].classTotalPossible += qRow.PointsPossible_Question;
        }
    });

    // Populate transformedData.skills with all possible skills from mapping, even if unattempted
    const allPossibleSkillsFromMapping = new Set();
    Object.values(SAT_CHAPTER_SKILL_MAPPING).forEach(subjectSkills => {
        Object.keys(subjectSkills).forEach(skillKey => {
            allPossibleSkillsFromMapping.add(skillKey);
        });
    });

    subjects.forEach(subject => {
        transformedData.skills[subject] = [];
        allPossibleSkillsFromMapping.forEach(skillName => {
            // Check if this skill name is associated with the current subject in the mapping
            const isRelevantSkillForSubject = Object.keys(SAT_CHAPTER_SKILL_MAPPING[subject]).some(mappedSkill => 
                skillName.toLowerCase().includes(mappedSkill.toLowerCase()) || mappedSkill.toLowerCase().includes(skillName.toLowerCase())
            );

            if (isRelevantSkillForSubject) {
                const skillData = skillAggregations[skillName];
                const studentScore = skillData ? (skillData.studentTotal > 0 ? Math.round((skillData.studentCorrect / skillData.studentTotal) * 100) : 0) : 0;
                const classAvgScore = skillData ? (skillData.classTotalPossible > 0 ? Math.round((skillData.classSumPoints / skillData.classTotalPossible) * 100) : 0) : 0;
                const attempted = skillData ? skillData.studentTotal > 0 : false;

                transformedData.skills[subject].push({
                    name: skillName,
                    score: studentScore,
                    classAvg: classAvgScore,
                    attempted: attempted
                });
            }
        });
        transformedData.skills[subject].sort((a,b) => a.name.localeCompare(b.name)); // Sort skills alphabetically
    });

    // --- Calculate OverallSkillPerformance for Overview Chart ---
    transformedData.overallSkillPerformance.labels = [];
    transformedData.overallSkillPerformance.studentAccuracy = [];
    transformedData.overallSkillPerformance.classAvgAccuracy = [];

    subjects.forEach(subject => {
        const subjectSkills = transformedData.skills[subject];
        if (subjectSkills.length > 0) {
            // Only average skills that have been attempted by the student for student accuracy
            const attemptedStudentSkills = subjectSkills.filter(s => s.attempted);
            const totalStudentAccuracy = attemptedStudentSkills.length > 0 ? attemptedStudentSkills.reduce((sum, s) => sum + s.score, 0) / attemptedStudentSkills.length : 0;
            
            // Average all skills for class average (assuming class average is always available for all skills, or default to 0)
            const totalClassAccuracy = subjectSkills.length > 0 ? subjectSkills.reduce((sum, s) => sum + s.classAvg, 0) / subjectSkills.length : 0;

            transformedData.overallSkillPerformance.labels.push(subject.charAt(0).toUpperCase() + subject.slice(1));
            transformedData.overallSkillPerformance.studentAccuracy.push(Math.round(totalStudentAccuracy));
            transformedData.overallSkillPerformance.classAvgAccuracy.push(Math.round(totalClassAccuracy));
        }
    });
    
    // --- Calculate Time Spent for KPI ---
    transformedData.timeSpent.studentAvg = Math.round(studentAggregatedScores.reduce((sum, row) => sum + (row.TimeSpent_Seconds || 0), 0) / (studentAggregatedScores.length || 1) / 60);
    transformedData.timeSpent.classAvg = Math.round(aggregatedScoresData.reduce((sum, row) => sum + (row.ClassAverageTime_Seconds || 0), 0) / (aggregatedScoresData.length || 1) / 60);
    transformedData.timeSpent.studentUnit = "min / assessment";
    transformedData.timeSpent.classUnit = "min / assessment";


    console.log("Transformed Data:", transformedData);
    return transformedData;
}

// --- DOM Content Loaded & Event Listeners ---
document.addEventListener('DOMContentLoaded', function () {
    // Chart.js Global Configuration
    Chart.defaults.font.family = 'Inter';
    Chart.defaults.plugins.legend.position = 'bottom';
    Chart.defaults.responsive = true;
    Chart.defaults.maintainAspectRatio = false;

    loadAndDisplayData(); // Initiate data loading and display
    setupEventListeners(); // Set up event listeners for tabs etc.
});

/**
 * Sets up all the interactive elements like tabs, mobile menu, and the refresh button.
 */
function setupEventListeners() {
    const mainTabs = document.querySelectorAll('.main-tab-button');
    const mainTabContents = document.querySelectorAll('.main-tab-content');
    const hamburgerButton = document.getElementById('hamburgerButton');
    const mobileMenu = document.getElementById('mobileMenu');
    const refreshDataBtn = document.getElementById('refreshDataBtn');

    document.getElementById('currentYear').textContent = new Date().getFullYear();

    hamburgerButton?.addEventListener('click', () => mobileMenu?.classList.toggle('hidden'));
    refreshDataBtn?.addEventListener('click', handleRefreshData);

    const switchMainTab = (tabElement) => {
        const targetTabName = tabElement.getAttribute('data-main-tab');

        // Deactivate all main tabs and hide all content
        mainTabs.forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.mobile-nav-link').forEach(link => link.classList.remove('active'));
        mainTabContents.forEach(content => content.classList.add('hidden'));

        // Activate the clicked tab and show its content
        document.querySelector(`.main-tab-button[data-main-tab="${targetTabName}"]`)?.classList.add('active');
        document.querySelector(`.mobile-nav-link[data-main-tab="${targetTabName}"]`)?.classList.add('active');
        document.getElementById(targetTabName + '-content')?.classList.remove('hidden');

        // Special handling for overview tab charts and subject tab sub-tabs
        if (targetTabName === 'overview') {
            initializeOverviewCharts(currentStudentData);
        } else if (['reading', 'writing', 'math'].includes(targetTabName)) {
            // For subject tabs, activate the default sub-tab (Skills Hub)
            const firstSubTabButton = document.querySelector(`#${targetTabName}-content .sub-tab-button[data-sub-tab="${targetTabName}-skills-hub"]`);
            if (firstSubTabButton) {
                firstSubTabButton.click(); // Programmatically click it to trigger its rendering logic
            }
        }
        mobileMenu?.classList.add('hidden'); // Hide mobile menu after selection
    };

    // Attach event listeners to main tab buttons
    mainTabs.forEach(tab => tab.addEventListener('click', () => switchMainTab(tab)));
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            switchMainTab(link);
        });
    });

    const switchSubTab = (subTabElement) => {
        const parentMainContent = subTabElement.closest('.main-tab-content');
        const targetSubTabName = subTabElement.getAttribute('data-sub-tab');

        // Deactivate all sub-tabs and hide all sub-tab content panels in the current main tab
        parentMainContent.querySelectorAll('.sub-tab-button').forEach(st => st.classList.remove('active'));
        parentMainContent.querySelectorAll('.sub-tab-content-panel').forEach(panel => panel.classList.add('hidden'));

        // Activate the clicked sub-tab and show its content panel
        subTabElement.classList.add('active');
        document.getElementById(targetSubTabName + '-content')?.classList.remove('hidden');

        // Special rendering logic for Skills Hub when activated
        if (targetSubTabName.endsWith('-skills-hub')) {
            const subject = targetSubTabName.replace('-skills-hub', '');
            populateSkillsHub(subject, currentStudentData.skills[subject] || []);
        }
        // No specific rendering needed for EOC/Khan sub-tabs as they are populated on initial loadAndDisplayData
    };

    // Attach event listeners to sub-tab buttons
    document.querySelectorAll('.sub-tab-button').forEach(subTab => {
        subTab.addEventListener('click', () => switchSubTab(subTab));
    });

    // Manually trigger click on the initial active tab (Overview) to set up the dashboard on first load
    // This needs to be done AFTER all event listeners are set up.
    document.querySelector('.main-tab-button[data-main-tab="overview"]')?.click();
}

/**
 * Handles data refresh, re-fetches data and re-renders the dashboard.
 */
function handleRefreshData() {
    console.log("Refresh Data button clicked! Initiating data reload.");
    alert("Refreshing data from Google Sheets...");
    loadAndDisplayData(); // Re-fetch and re-display all data
}

// --- Dashboard Population Functions ---

/**
 * Populates the entire overview tab, including KPIs and dynamic strengths/weaknesses.
 */
function populateOverview(data) {
    // Populate KPI cards
    const kpiContainer = document.getElementById('overview-kpis');
    kpiContainer.innerHTML = `
        <div class="score-card"><h3 class="text-md font-medium text-gray-600">Latest Total Score</h3><p class="text-3xl font-bold score-value">${data.latestScores.total} <span class="text-lg text-gray-500">/ 1600</span> ${getPerformanceArrow(data.latestScores.total, data.latestScores.classAvgTotal)}</p>
        <p class="text-sm text-gray-500">Class Avg: ${data.latestScores.classAvgTotal}</p></div>

        <div class="score-card"><h3 class="text-md font-medium text-gray-600">Latest R&W Score</h3><p class="text-3xl font-bold score-value">${data.latestScores.rw} <span class="text-lg text-gray-500">/ 800</span> ${getPerformanceArrow(data.latestScores.rw, data.latestScores.classAvgRW)}</p>
        <p class="text-sm text-gray-500">Class Avg: ${data.latestScores.classAvgRW}</p></div>

        <div class="score-card"><h3 class="text-md font-medium text-gray-600">Latest Math Score</h3><p class="text-3xl font-bold score-value">${data.latestScores.math} <span class="text-lg text-gray-500">/ 800</span> ${getPerformanceArrow(data.latestScores.math, data.latestScores.classAvgMath)}</p>
        <p class="text-sm text-gray-500">Class Avg: ${data.latestScores.classAvgMath}</p></div>

        <div class="score-card"><h3 class="text-md font-medium text-gray-600">Avg EOC Score</h3><p class="text-3xl font-bold score-value">${data.latestScores.avgEocKhan}% ${getPerformanceArrow(data.latestScores.avgEocKhan, data.latestScores.classAvgEocKhan)}</p>
        <p class="text-sm text-gray-500">Class Avg: ${data.latestScores.classAvgEocKhan}%</p></div>

        <div class="score-card"><h3 class="text-md font-medium text-gray-600">Your Target Score</h3><p class="text-3xl font-bold" style="color: #8a3ffc;">${data.targetScore}</p></div>`;

    // Populate Strengths & Weaknesses
    const allSkills = Object.values(data.skills).flat().filter(s => s.attempted); // Filter for attempted skills first
    const strengths = [...allSkills].sort((a, b) => b.score - a.score).slice(0, 3);
    const weaknesses = [...allSkills].sort((a, b) => a.score - b.score).slice(0, 3);

    const renderList = (items, defaultMessage) => {
        if (items.length === 0) return `<p class="text-gray-500 text-center p-2">${defaultMessage}</p>`;
        return `<ul class="list-disc list-inside space-y-1 text-gray-600">${items.map(item => `<li>${item.name} (${item.score}%) ${getPerformanceArrow(item.score, item.classAvg)}</li>`).join('')}</ul>`;
    }
    document.getElementById('overviewStrengthsContainer').innerHTML = renderList(strengths, "No strengths identified yet.");
    document.getElementById('overviewImprovementsContainer').innerHTML = renderList(weaknesses, "No areas for improvement identified yet.");

    // Populate Time Spent
    document.getElementById('timeSpentOverview').innerHTML = `<p class="text-gray-600">Your Avg: <span class="font-semibold">${data.timeSpent.studentAvg} ${data.timeSpent.studentUnit}</span></p><p class="text-gray-600">Class Avg: <span class="font-semibold">${data.timeSpent.classAvg} ${data.timeSpent.classUnit}</span></p>`;
}

/**
 * Renders the main overview charts.
 * @param {object} data - The current student data.
 */
function initializeOverviewCharts(data) {
    // --- Score Trend Chart ---
    const scoreTrendChartCanvas = document.getElementById('scoreTrendChart');
    if (!scoreTrendChartCanvas) {
        console.warn("Score Trend Chart canvas not found. Cannot initialize chart.");
        return;
    }

    const parentScoreTrendDiv = scoreTrendChartCanvas.parentNode;
    let noDataMessageScoreTrend = document.getElementById('scoreTrendChartNoData');

    const existingScoreTrendChart = Chart.getChart('scoreTrendChart');
    if (existingScoreTrendChart) {
        existingScoreTrendChart.destroy();
    }

    if (data.scoreTrend && data.scoreTrend.labels.length > 0) {
        scoreTrendChartCanvas.style.display = 'block';
        if (noDataMessageScoreTrend) noDataMessageScoreTrend.remove();

        new Chart(scoreTrendChartCanvas, {
            type: 'line',
            data: {
                labels: data.scoreTrend.labels,
                datasets: [
                    { label: 'Your Score', data: data.scoreTrend.studentScores, borderColor: '#2a5266', tension: 0.1, fill: false, pointRadius: 5, pointBackgroundColor: '#2a5266' },
                    { label: 'Class Average', data: data.scoreTrend.classAvgScores, borderColor: '#757575', borderDash: [5, 5], tension: 0.1, fill: false, pointRadius: 3, pointBackgroundColor: '#757575' }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12,
                            font: { size: 10 }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.parsed.y}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        max: 1600,
                        min: 400,
                        title: { display: true, text: 'Score' }
                    },
                    x: {
                        title: { display: true, text: 'Assessment' },
                        grid: { display: false }
                    }
                }
            }
        });
    } else {
        scoreTrendChartCanvas.style.display = 'none';
        if (!noDataMessageScoreTrend) {
            noDataMessageScoreTrend = document.createElement('p');
            noDataMessageScoreTrend.id = 'scoreTrendChartNoData';
            noDataMessageScoreTrend.className = 'text-center p-4 text-gray-500';
            noDataMessageScoreTrend.textContent = 'No score trend data available.';
            parentScoreTrendDiv.appendChild(noDataMessageScoreTrend);
        }
    }

    // --- Overall Skill Performance Chart ---
    const overallSkillChartCanvas = document.getElementById('overallSkillChart');
    if (!overallSkillChartCanvas) {
        console.warn("Overall Skill Chart canvas not found. Cannot initialize chart.");
        return;
    }

    const parentOverallSkillDiv = overallSkillChartCanvas.parentNode;
    let noDataMessageOverallSkill = document.getElementById('overallSkillChartNoData');

    const existingOverallSkillChart = Chart.getChart('overallSkillChart');
    if (existingOverallSkillChart) {
        existingOverallSkillChart.destroy();
    }

    if (data.overallSkillPerformance && data.overallSkillPerformance.labels.length > 0) {
        overallSkillChartCanvas.style.display = 'block';
        if (noDataMessageOverallSkill) noDataMessageOverallSkill.remove();

        new Chart(overallSkillChartCanvas, {
            type: 'bar',
            data: {
                labels: data.overallSkillPerformance.labels,
                datasets: [
                    { label: 'Your Accuracy', data: data.overallSkillPerformance.studentAccuracy, backgroundColor: 'rgba(42, 82, 102, 0.8)', barPercentage: 0.8, categoryPercentage: 0.8 },
                    { label: 'Class Average', data: data.overallSkillPerformance.classAvgAccuracy, backgroundColor: 'rgba(117, 117, 117, 0.7)', barPercentage: 0.8, categoryPercentage: 0.8 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12,
                            font: { size: 10 }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += context.parsed.y + '%';
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: { display: true, text: 'Accuracy (%)' }
                    },
                    x: {
                        title: { display: true, text: 'Subject' },
                        grid: { display: false }
                    }
                }
            }
        });
    } else {
        overallSkillChartCanvas.style.display = 'none';
        if (!noDataMessageOverallSkill) {
            noDataMessageOverallSkill = document.createElement('p');
            noDataMessageOverallSkill.id = 'overallSkillChartNoData';
            noDataMessageOverallSkill.className = 'text-center p-4 text-gray-500';
            noDataMessageOverallSkill.textContent = 'No overall skill performance data available.';
            parentOverallSkillDiv.appendChild(noDataMessageOverallSkill);
        }
    }
}

// --- Subject-Specific Functions ---

/**
 * Populates the new combined "Skills Hub" tab.
 * This displays overall skill performance, sorted weakest first.
 * Clicking a skill here will open a modal showing incorrect questions for that skill.
 * @param {string} subject - The subject ('reading', 'writing', 'math').
 * @param {Array} skills - The list of skills for that subject.
 */
function populateSkillsHub(subject, skills) {
    const container = document.getElementById(`${subject}-skills-hub-body`);
    if (!container) return;

    // Filter out skills with 'TBD_No_Correlation_Or_CustomQID' and sort
    const relevantSkills = skills.filter(s => s.name && !String(s.name).includes('TBD_No_Correlation_Or_CustomQID'));
    relevantSkills.sort((a, b) => a.score - b.score);

    if (relevantSkills.length === 0) {
        container.innerHTML = `<p class="text-center p-4 text-gray-500">No skill data available for ${subject}. Ensure skill tags are well-populated in the data source.</p>`;
        return;
    }

    container.innerHTML = relevantSkills.map(skill => {
        const performanceClass = skill.attempted ? (skill.score >= 85 ? 'performance-good' : skill.score >= 70 ? 'performance-average' : 'performance-poor') : 'performance-na';
        const displayScore = typeof skill.score === 'number' ? skill.score : 0; // Ensure number for width style
        return `
        <div class="p-3 bg-gray-50 rounded-md border border-gray-200 mb-2 skill-item-container" onclick="openSkillIncorrectQuestionsModal('${skill.name}', '${subject}')">
            <div class="flex justify-between items-center mb-1">
                <span class="text-sm font-medium text-gray-800">${skill.name}</span>
                <span class="text-xs font-semibold">${skill.attempted ? skill.score + '%' : 'N/A'} ${getPerformanceArrow(skill.score, skill.classAvg)}</span>
            </div>
            <div class="progress-bar-container"><div class="progress-bar ${performanceClass}" style="width: ${displayScore}%"></div></div>
            <p class="text-xs text-gray-500 mt-1">Class Avg: ${skill.classAvg}%</p>
        </div>`;
    }).join('');
}

/**
 * Populates the main table of CB Practice Tests.
 * Each row is clickable to open a modal with all questions from that test.
 * @param {Array} tests - Array of CB practice test objects.
 */
function populatePracticeTestsTable(tests) {
    const tableBody = document.getElementById('cb-practice-tests-table-body');
    if (!tableBody) return;

    if (tests.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="8" class="text-center text-gray-500">No CB practice test data available.</td></tr>`; // Updated colspan
        return;
    }

    tableBody.innerHTML = tests.map(test => {
        const isAttempted = test.date && test.date !== "Not Attempted" && test.date !== "-";
        const totalScore = test.total !== null && test.total !== '-' ? test.total : '-';
        const rwScore = test.rw !== null && test.rw !== '-' ? test.rw : '-';
        const mathScore = test.math !== null && test.math !== '-' ? test.math : '-';

        const classAvgTotal = test.classAvgTotal !== null && test.classAvgTotal !== '-' ? test.classAvgTotal : 'N/A';
        const classAvgRW = test.classAvgRW !== null && test.classAvgRW !== '-' ? test.classAvgRW : 'N/A';
        const classAvgMath = test.classAvgMath !== null && test.classAvgMath !== '-' ? test.classAvgMath : 'N/A';

        return `
        <tr class="${isAttempted ? 'clickable-row' : 'opacity-60'}" ${isAttempted ? `onclick="openTestQuestionsModal('${test.name}')"` : ''}>
            <td>${test.displayName}</td>
            <td>${formatDate(test.date)}</td>
            <td>${rwScore} ${getPerformanceArrow(rwScore, classAvgRW)}</td>
            <td>${mathScore} ${getPerformanceArrow(mathScore, classAvgMath)}</td>
            <td>${totalScore} ${getPerformanceArrow(totalScore, classAvgTotal)}</td>
            <td>${classAvgRW}</td>
            <td>${classAvgMath}</td>
            <td>${classAvgTotal}</td>
        </tr>`;
    }).join('');
}

/**
 * Populates EOC Practice tables.
 * Each row (quiz) is clickable to open a modal with all questions from that quiz.
 * @param {string} subject - The subject ('reading', 'writing', 'math').
 * @param {Array} quizzes - Array of EOC quiz objects.
 */
function populateEOCPractice(subject, quizzes) {
    const tableBody = document.getElementById(`${subject}-eoc-tbody`);
    if (!tableBody) return;

    const eocThead = document.getElementById(`${subject}-eoc-thead`);
    if (eocThead) { // Ensure thead exists before manipulating
        const headers = ['Quiz Name', 'Date Attempted', 'Latest Score', 'Class Avg Score'];
        eocThead.innerHTML = `<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
    }

    if (quizzes.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" class="text-center text-gray-500">No EOC practice data available for ${subject}.</td></tr>`;
        return;
    }

    tableBody.innerHTML = quizzes.map(quiz => {
        const isAttempted = quiz.date && quiz.date !== "Not Attempted" && quiz.date !== "-";
        const studentScoreNum = parseFloat(String(quiz.latestScore).match(/(\d+)%/)?.[1]); // Extract percentage number
        const classAvgScoreNum = parseFloat(String(quiz.classAvgScore).match(/(\d+)%/)?.[1]); // Extract percentage number

        return `
        <tr class="${isAttempted ? 'clickable-row' : 'opacity-60'}" ${isAttempted ? `onclick="openEOCQuizQuestionsModal('${quiz.rawName}', '${subject}')"` : ''}>
            <td>${quiz.name}</td>
            <td>${formatDate(quiz.date)}</td>
            <td>${quiz.latestScore} ${getPerformanceArrow(studentScoreNum, classAvgScoreNum)}</td>
            <td>${quiz.classAvgScore}</td>
        </tr>
    `).join('');
}

/**
 * Populates Khan Academy Practice sections.
 * @param {string} subject - The subject ('reading', 'writing', 'math').
 * @param {Array} khanData - Array of Khan Academy data.
 */
function populateKhanAcademy(subject, khanData) {
    const container = document.getElementById(`${subject}-khan-data`);
    if (!container) return;

    if (khanData.length === 0) {
        container.innerHTML = `<p class="text-gray-500 text-center p-4">No Khan Academy data available for ${subject}.</p>`;
        return;
    }
    // Display Khan Academy data in a simple list format
    container.innerHTML = `<div class="space-y-2 p-2">
        ${khanData.map(d => {
            const studentScoreNum = parseFloat(String(d.latestScore).match(/(\d+)%/)?.[1]);
            const classAvgScoreNum = parseFloat(String(d.classAvgScore).match(/(\d+)%/)?.[1]);
            return `<p class="text-gray-600"><strong>${d.name}</strong>: ${d.latestScore} ${getPerformanceArrow(studentScoreNum, classAvgScoreNum)} (Class Avg: ${d.classAvgScore})</p>`;
        }).join('')}
    </div>`;
}

// --- Modals and Detailed View Functions ---

const modal = document.getElementById('detailModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');

/**
 * Opens the modal to show ALL incorrect questions for a specific skill.
 * @param {string} skillName - The name of the skill to filter by.
 * @param {string} subject - The subject of the skill.
 */
function openSkillIncorrectQuestionsModal(skillName, subject) {
    modalTitle.textContent = `Incorrect Questions for: ${skillName} (${subject.charAt(0).toUpperCase() + subject.slice(1)})`;

    const incorrectQuestions = ALL_DASHBOARD_QUESTIONS.filter(q =>
        q.skill === skillName && !q.isCorrect && q.subject === subject
    );
    const difficultyOrder = { "Hard": 1, "Medium": 2, "Easy": 3, "unknown": 4 }; // Added unknown difficulty
    incorrectQuestions.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);

    if (incorrectQuestions.length === 0) {
        modalBody.innerHTML = `
            <div class="question-analysis-card">
                <div class="question-analysis-header">
                    <span class="font-semibold text-gray-700">${skillName}</span>
                    <span class="meta-item text-gray-500">Subject: ${subject.charAt(0).toUpperCase() + subject.slice(1)}</span>
                </div>
                <div class="question-analysis-body">
                    <p class="text-center p-5 text-gray-600">No incorrect questions found for "${skillName}" in ${subject} for this student.</p>
                </div>
            </div>`;
    } else {
        modalBody.innerHTML = incorrectQuestions.map((q, index) => renderQuestionAnalysisCard(q, `skill-${index}`, false)).join('');
    }
    modal.style.display = "block";
    renderDynamicCharts();
    addExplanationToggleListeners();
}

/**
 * Opens the modal to show ALL questions for a specific CB Practice Test.
 * @param {string} testName - The raw name of the test (e.g., 'CB-T4').
 */
function openTestQuestionsModal(testName) {
    const test = currentStudentData.cbPracticeTests.find(t => t.name === testName);
    modalTitle.textContent = `Reviewing Test: ${test ? test.displayName : testName}`;
    
    if (!test || !test.questions || test.questions.length === 0) {
        modalBody.innerHTML = `<p class="text-center p-5 text-gray-600">No questions found for ${test ? test.displayName : testName}.</p>`;
        modal.style.display = "block";
        return;
    }

    let content = test.questions.map((q, index) => renderQuestionAnalysisCard(q, `test-${index}`, true)).join('');

    // Pacing Analysis Section
    content += `<h3 class="text-lg font-semibold text-gray-800 border-t pt-4 mt-6">Pacing Analysis</h3>`;
    if (test.questions.some(q => typeof q.yourTime === 'number' && typeof q.classAvgTime === 'number')) {
        content += `<div class="pacing-bar-chart-container"><canvas id="pacingBarChart"></canvas></div>`;
        
        const pacingRows = test.questions.map((p, index) => {
            const diff = (p.yourTime || 0) - (p.classAvgTime || 0);
            const status = diff > 15 ? 'Slower' : diff < -15 ? 'Faster' : 'On Pace';
            const statusClass = `pacing-${status.toLowerCase().replace(' ', '-')}`;
            return `<tr><td>${index + 1}</td><td>${p.yourTime || 'N/A'}s</td><td>${p.classAvgTime || 'N/A'}s</td><td><span class="pacing-badge ${statusClass}">${status}</span></td><td class="${p.isCorrect ? 'text-good' : 'text-poor'} font-semibold">${p.isCorrect ? 'Correct' : 'Incorrect'}</td></tr>`;
        }).join('');
        content += `<div class="overflow-x-auto mt-4"><table class="min-w-full table"><thead><tr><th>Q#</th><th>Your Time</th><th>Class Avg</th><th>Pacing</th><th>Result</th></tr></thead><tbody>${pacingRows}</tbody></table></div>`;
    } else {
        content += `<p class="text-center p-5 text-gray-600">No pacing data available for this test.</p>`;
    }

    modalBody.innerHTML = content;
    modal.style.display = "block";
    renderDynamicCharts();
    addExplanationToggleListeners();
    if (test.questions.some(q => typeof q.yourTime === 'number') && document.getElementById('pacingBarChart')) {
        renderPacingBarChart('pacingBarChart', test.questions);
    }
}

/**
 * Opens the modal to show ALL questions for a specific EOC Quiz.
 * @param {string} quizRawName - The raw name of the EOC quiz.
 * @param {string} subject - The subject of the EOC quiz.
 */
function openEOCQuizQuestionsModal(quizRawName, subject) {
    const quizzesForSubject = currentStudentData.eocQuizzes[subject] || [];
    const quiz = quizzesForSubject.find(q => q.rawName === quizRawName);

    modalTitle.textContent = `Reviewing EOC Quiz: ${quiz ? quiz.name : quizRawName} (${subject.charAt(0).toUpperCase() + subject.slice(1)})`;
    
    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
        modalBody.innerHTML = `<p class="text-center p-5 text-gray-600">No questions found for ${quiz ? quiz.name : quizRawName}.</p>`;
        modal.style.display = "block";
        return;
    }

    let content = quiz.questions.map((q, index) => renderQuestionAnalysisCard(q, `eoc-${index}`, false)).join('');
    modalBody.innerHTML = content;
    modal.style.display = "block";
    renderDynamicCharts();
    addExplanationToggleListeners();
}

/**
 * Closes the modal and cleans up any Chart.js instances.
 */
function closeModal() {
    const canvases = modalBody.querySelectorAll('canvas');
    canvases.forEach(canvas => {
        const chart = Chart.getChart(canvas);
        if (chart) {
            chart.destroy();
        }
    });

    modal.style.display = "none";
    modalBody.innerHTML = '';
}
window.onclick = (event) => {
    if (event.target == modal) {
        closeModal();
    }
};

/**
 * Renders a self-contained card for a single question's analysis.
 */
function renderQuestionAnalysisCard(q, uniqueIdPrefix, includePacing = false) {
    const resultText = q.isCorrect ? "Correct" : "Incorrect";
    const resultClass = q.isCorrect ? "text-good" : "text-poor";
    const sourceInfo = q.source ? `<span class="meta-item text-gray-500">Source: ${q.source}</span>` : '';
    const questionTextDisplay = q.text ? `<p class="mb-2 text-gray-800 font-medium">${q.text}</p>` : `<p class="mb-2 text-gray-800 font-medium">Question ID: ${q.id}</p>`;

    const pacingHtml = includePacing && typeof q.yourTime === 'number' && typeof q.classAvgTime === 'number' ?
        `<p class="text-center text-sm mt-2">Pacing: <strong>${q.yourTime}s</strong> (Class Avg: ${q.classAvgTime}s)</p>` : '';

    const classCorrectPercentage = q.classPerformance ? q.classPerformance.correct : 'N/A';
    const studentPerformanceForArrow = q.isCorrect ? 100 : 0;
    const classAvgForArrow = parseFloat(classCorrectPercentage);
    const classAvgArrow = getPerformanceArrow(studentPerformanceForArrow, classAvgForArrow);

    const explanationHtml = q.explanation && q.explanation !== "No explanation provided in raw data." ? `
        <button class="toggle-explanation-btn" data-target="explanation-${uniqueIdPrefix}-${q.id}">Show Explanation</button>
        <div id="explanation-${uniqueIdPrefix}-${q.id}" class="answer-explanation">
            <p class="font-semibold text-sm">Explanation</p>
            <p class="text-sm">${q.explanation}</p>
        </div>
    ` : '';

    const relevantChapters = getChaptersForSkill(q.skill, q.subject);
    const chapterReviewHtml = relevantChapters.length > 0 ? `
        <div class="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200 text-sm">
            <p class="font-semibold text-blue-800 mb-1">Review Chapters:</p>
            <ul class="list-disc list-inside text-blue-700">
                ${relevantChapters.map(chapter => `<li>${chapter}</li>`).join('')}
            </ul>
        </div>
    ` : '';

    const displaySkillName = (q.skill && !String(q.skill).includes('TBD_No_Correlation_Or_CustomQID')) ? q.skill : 'Unidentified Skill';

    return `
    <div class="question-analysis-card">
        <div class="question-analysis-header">
            <span class="font-semibold text-gray-700">${displaySkillName}</span>
            <span class="difficulty-badge difficulty-${q.difficulty}">${q.difficulty}</span>
            ${sourceInfo}
        </div>
        <div class="question-analysis-body">
            <div>
                ${questionTextDisplay}
                <p>Your Answer: <span class="font-semibold ${resultClass}">${q.yourAnswer}</span> <span class="font-bold">(${resultText})</span></p>
                ${!q.isCorrect && q.correctAnswer !== "Not provided in raw data" ? `<p>Correct Answer: <span class="font-semibold text-good">${q.correctAnswer}</span></p>` : ''}
                ${explanationHtml}
                ${chapterReviewHtml}
            </div>
            <div>
                <p class="text-center text-sm font-semibold mb-2">Class Performance: ${classCorrectPercentage}% Correct ${classAvgArrow}</p>
                <div class="question-chart-container">
                    <canvas id="chart-${uniqueIdPrefix}-${q.id}"></canvas>
                </div>
                ${pacingHtml}
            </div>
        </div>
    </div>`;
}

/**
 * Retrieves relevant chapters from the SAT_CHAPTER_SKILL_MAPPING for a given skill and subject.
 */
function getChaptersForSkill(skillName, subject) {
    const chapters = new Set();
    const skillMap = SAT_CHAPTER_SKILL_MAPPING[subject];

    if (skillMap && skillName && !String(skillName).includes('TBD_No_Correlation_Or_CustomQID')) {
        for (const mappedSkill in skillMap) {
            if (skillName.toLowerCase().includes(mappedSkill.toLowerCase()) || mappedSkill.toLowerCase().includes(skillName.toLowerCase())) {
                skillMap[mappedSkill].forEach(chapter => chapters.add(chapter));
            }
        }
    }
    return Array.from(chapters).sort();
}

/**
 * Renders dynamic Chart.js charts for canvases present in the modalBody.
 */
function renderDynamicCharts() {
    const canvases = modalBody.querySelectorAll('canvas[id^="chart-"]');
    canvases.forEach(canvas => {
        const chartId = canvas.id;
        const existingChart = Chart.getChart(chartId);
        if (existingChart) {
            existingChart.destroy();
        }

        const qIdMatch = chartId.match(/(Q\d+|-EOC-[RWM]\d+-C\d+-\w+|Khan:.+)/);
        const qId = qIdMatch ? qIdMatch[0] : null;

        const qData = ALL_DASHBOARD_QUESTIONS.find(q => q.id === qId);

        if (qData && qData.classPerformance) {
            const correct = qData.classPerformance.correct || 0;
            const incorrect = qData.classPerformance.incorrect || 0;
            const unanswered = qData.classPerformance.unanswered || 0;

            new Chart(canvas, {
                type: 'doughnut',
                data: {
                    labels: ['Correct', 'Incorrect', 'Unanswered'],
                    datasets: [{
                        data: [correct, incorrect, unanswered],
                        backgroundColor: ['#28a745', '#dc3545', '#ffc107'],
                        borderColor: '#ffffff',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: true, position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } },
                        tooltip: { callbacks: { label: function(context) { return `${context.label}: ${context.parsed}%`; } } }
                    },
                    cutout: '60%',
                }
            });
        }
    });
}

/**
 * Renders a bar chart for pacing analysis.
 */
function renderPacingBarChart(canvasId, questions) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const existingChart = Chart.getChart(canvasId);
    if (existingChart) {
        existingChart.destroy();
    }

    const labels = questions.map((q, index) => `Q${index + 1}`);
    const yourTimes = questions.map(q => q.yourTime);
    const classAvgTimes = questions.map(q => q.classAvgTime);

    const backgroundColors = questions.map(q => {
        const diff = (q.yourTime || 0) - (q.classAvgTime || 0);
        if (diff > 15) return '#dc3545';
        if (diff < -15) return '#28a745';
        return '#4b5563';
    });

    const borderColors = questions.map(q => {
        const diff = (q.yourTime || 0) - (q.classAvgTime || 0);
        if (diff > 15) return '#bb2124';
        if (diff < -15) return '#198754';
        return '#2a5266';
    });

    new Chart(canvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                { label: 'Your Time (s)', data: yourTimes, backgroundColor: backgroundColors, borderColor: borderColors, borderWidth: 1, barPercentage: 0.8, categoryPercentage: 0.8 },
                { label: 'Class Avg Time (s)', data: classAvgTimes, backgroundColor: 'rgba(117, 117, 117, 0.5)', borderColor: 'rgba(117, 117, 117, 0.8)', borderWidth: 1, type: 'line', fill: false, pointRadius: 3, pointBackgroundColor: '#757575', tension: 0.1, hidden: false }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true },
                tooltip: {
                    mode: 'index', intersect: false,
                    callbacks: {
                        title: function(context) { return context[0].label; },
                        label: function(context) {
                            if (context.dataset.label === 'Your Time (s)') {
                                const qIndex = context.dataIndex;
                                const difficulty = questions[qIndex]?.difficulty || 'N/A'; // Handle potential undefined difficulty
                                return `${context.dataset.label}: ${context.parsed.y}s (Difficulty: ${difficulty})`;
                            }
                            return `${context.dataset.label}: ${context.parsed.y}s`;
                        }
                    }
                }
            },
            scales: {
                x: { title: { display: true, text: 'Question Number' }, grid: { display: false } },
                y: { title: { display: true, text: 'Time (seconds)' }, beginAtZero: true }
            }
        }
    });
}

/**
 * Adds event listeners to "Show Explanation" buttons to toggle explanation visibility.
 */
function addExplanationToggleListeners() {
    modalBody.querySelectorAll('.toggle-explanation-btn').forEach(button => {
        button.onclick = function() {
            const targetId = this.getAttribute('data-target');
            const explanationDiv = document.getElementById(targetId);
            if (explanationDiv) {
                explanationDiv.classList.toggle('expanded');
                this.textContent = explanationDiv.classList.contains('expanded') ? 'Hide Explanation' : 'Show Explanation';
            }
        };
    });
}
