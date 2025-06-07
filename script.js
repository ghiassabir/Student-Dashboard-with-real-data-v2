// --- DUMMY DATA (Will be replaced by fetched data) ---
// Keep the structure for reference, but its values will be overridden.
let currentStudentData = {
    name: "Loading Data...", // Initial placeholder
    targetScore: 1400, // This can be hardcoded or fetched if available in CSV
    latestScores: { total: 0, rw: 0, math: 0, avgEocKhan: 0 },
    timeSpent: { studentAvg: 0, studentUnit: "min / day", classAvg: 0, classUnit: "min / day"},
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
    skills: {
        reading: [],
        writing: [],
        math: []
    },
    chapters: { // This mapping is static and can remain as is
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

// Global array to hold all questions for easy access (will be populated from fetched data)
let ALL_DASHBOARD_QUESTIONS = [];

// Store all fetched raw data globally once, to avoid re-fetching on student change
let ALL_AGGREGATED_SCORES_RAW = [];
let ALL_QUESTION_DETAILS_RAW = [];
let ALL_UNIQUE_STUDENTS = []; // To populate the dropdown

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
        "Calculating and interpreting measures of central tendency (mean, median, mode) and a range": ["27: Statistics 1"],
        "Understanding standard deviation, distributions (like normal distribution basics), and basic statistical inference": ["28: Statistics 2"],
        "Calculating the volume of 3D shapes (e.g., prisms, cylinders, cones, spheres)": ["29: Volume"]
    },
    writing: { // Changed from Array to Object for consistency with Math if skill keys are needed
        "1: Transitions": ["1: Transitions"],
        "2: Specific Focus": ["2: Specific Focus"],
        "3: Sentences & Fragments": ["3: Sentences & Fragments"],
        "4: Joining & Separating Sentences": ["4: Joining & Separating Sentences"],
        "5: Joining Sentences & Fragments": ["5: Joining Sentences & Fragments"],
        "6: Non-Essential & Essential Clauses": ["6: Non-Essential & Essential Clauses"],
        "7: Additional Comma Uses & Misuses": ["7: Additional Comma Uses & Misuses"],
        "8: Verbs Agreements and Tense": ["8: Verbs Agreements and Tense"],
        "9: Pronouns": ["9: Pronouns"],
        "10: Apostrophes": ["10: Apostrophes"],
        "11: Modification": ["11: Modification"],
        "12: Parallel Structure": ["12: Parallel Structure"],
        "13: Word Pairs": ["13: Word Pairs"],
        "14: Question Marks": ["14: Question Marks"],
        "Appendix: Parts of Speech": ["Appendix: Parts of Speech"]
    },
    reading: { // Changed from Array to Object for consistency
        "1: Overview of SAT Reading": ["1: Overview of SAT Reading"],
        "2: Vocabulary in Context": ["2: Vocabulary in Context"],
        "3: Making the Leap": ["3: Making the Leap"],
        "4: The Big Picture": ["4: The Big Picture"],
        "5: Literal Comprehension": ["5: Literal Comprehension"],
        "6: Reading for Function": ["6: Reading for Function"],
        "7: Text Completions": ["7: Text Completions"],
        "8: Supporting & Undermining": ["8: Supporting & Undermining"],
        "9: Graphs & Charts": ["9: Graphs & Charts"],
        "10: Paired Passages": ["10: Paired Passages"],
        "Appendix: Question Types": ["Appendix: Question Types"]
    }
};


// --- Date Formatting Helper ---
function formatDate(dateString) {
    if (!dateString || dateString === "N/A" || dateString === "Not Attempted") return dateString;
    try {
        const date = new Date(dateString + 'T00:00:00'); // Add T00:00:00 to ensure UTC interpretation and avoid timezone issues
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month}, ${year}`;
    } catch (e) {
        console.error("Error formatting date:", dateString, e);
        return dateString;
    }
}

// URLs for the Google Sheet CSV data
const CSV_URLS = {
    aggregatedScores: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSySYBO9YL3N4aUG3JEYZMQQIv9d1oSm3ba4Ty9Gt4SsGs2zmTS_k81rH3Qv41mZvClnayNcDpl_QbI/pub?gid=1890969747&single=true&output=csv',
    questionDetails: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRJl8XYak_fAzpuboA6GgOO-hEMd6rP_X9BD7ruZ-pSnIGKkd27uGmP2ZWeBcwSvSKsafObcXDOW080/pub?gid=822014112&single=true&output=csv'
};

/**
 * Fetches CSV data from a given URL and parses it using PapaParse.
 * @param {string} url - The URL of the CSV file.
 * @returns {Promise<Array<Object>>} A promise that resolves with an array of objects representing the CSV data.
 */
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
                        console.error(`PapaParse errors for ${url}:`, results.errors);
                        reject(results.errors);
                    }
                    console.log(`Successfully parsed ${results.data.length} rows from ${url}`);
                    // console.log(`Headers for ${url}:`, results.meta.fields); // Diagnostic log
                    resolve(results.data);
                }
            });
        });
    } catch (error) {
        console.error(`Could not fetch or parse CSV from ${url}:`, error);
        return [];
    }
}

/**
 * Main function to load and display dashboard data for a specific student.
 * @param {string} studentEmail - The email of the student to filter data for.
 */
async function loadAndDisplayData(studentEmail = null) {
    document.getElementById('studentNameDisplay').textContent = "Loading data...";

    try {
        // Fetch raw data only once per session
        if (ALL_AGGREGATED_SCORES_RAW.length === 0 || ALL_QUESTION_DETAILS_RAW.length === 0) {
            ALL_AGGREGATED_SCORES_RAW = await fetchCsvData(CSV_URLS.aggregatedScores);
            ALL_QUESTION_DETAILS_RAW = await fetchCsvData(CSV_URLS.questionDetails);
            ALL_UNIQUE_STUDENTS = getUniqueStudents(ALL_AGGREGATED_SCORES_RAW);
        }

        // Determine target student email
        let targetStudentGmailID = studentEmail;
        if (!targetStudentGmailID && ALL_UNIQUE_STUDENTS.length > 0) {
            const aisha = ALL_UNIQUE_STUDENTS.find(s => s.email.toLowerCase() === 'aisha.m@example.com');
            targetStudentGmailID = aisha ? aisha.email : ALL_UNIQUE_STUDENTS[0].email;
        }

        if (!targetStudentGmailID) {
            document.getElementById('studentNameDisplay').textContent = "No Student Data Found!";
            showEmailInputModal();
            return;
        }

        // Transform and populate current student data
        currentStudentData = transformRawData(
            ALL_AGGREGATED_SCORES_RAW,
            ALL_QUESTION_DETAILS_RAW,
            targetStudentGmailID
        );

        // Populate global ALL_DASHBOARD_QUESTIONS array for modal lookups
        ALL_DASHBOARD_QUESTIONS = [
            ...(currentStudentData.cbPracticeTests.flatMap(t => t.questions || [])),
            ...(Object.values(currentStudentData.eocQuizzes).flat().flatMap(q => q.questions || [])),
            ...(Object.values(currentStudentData.khanAcademy).flat().flatMap(q => q.questions || []))
        ];
        console.log("ALL_DASHBOARD_QUESTIONS populated with:", ALL_DASHBOARD_QUESTIONS.length, "questions from fetched data.");


        document.getElementById('studentNameDisplay').textContent = `Welcome! ${currentStudentData.studentName}`;

        populateOverview(currentStudentData);
        populatePracticeTestsTable(currentStudentData.cbPracticeTests);

        ['reading', 'writing', 'math'].forEach(subject => {
            populateEOCPractice(subject, currentStudentData.eocQuizzes[subject] || []);
            populateKhanAcademy(subject, currentStudentData.khanAcademy[subject] || []);
        });

        // Re-render the currently active main tab to ensure charts/tables refresh
        const activeMainTab = document.querySelector('.main-tab-button.active');
        if (activeMainTab) {
            switchMainTab(activeMainTab);
        }

        hideEmailInputModal();

    } catch (error) {
        console.error("Failed to load and display dashboard data:", error);
        document.getElementById('studentNameDisplay').textContent = "Data Loading Failed!";
        showEmailInputModal("Error loading data. Please try again.");
    }
}

/**
 * Extracts unique student emails and full names.
 */
function getUniqueStudents(aggregatedScoresData) {
    const studentsMap = new Map();
    aggregatedScoresData.forEach(row => {
        const email = row.StudentGmailID;
        const fullName = row.StudentFullName;
        if (email && fullName && !studentsMap.has(email)) {
            studentsMap.set(email, { email: email, fullName: fullName });
        }
    });
    return Array.from(studentsMap.values()).sort((a, b) => a.fullName.localeCompare(b.fullName));
}

// --- Email Input Modal Functions ---
function showEmailInputModal(errorMessage = '') {
    const modal = document.getElementById('emailInputModal');
    const errorDiv = document.getElementById('emailError');
    if (modal) {
        modal.style.display = 'flex'; // Use flex to center
        if (errorMessage) {
            errorDiv.textContent = errorMessage;
            errorDiv.classList.remove('hidden');
        } else {
            errorDiv.classList.add('hidden');
        }
    }
}

function hideEmailInputModal() {
    const modal = document.getElementById('emailInputModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function handleSubmitEmail() {
    const emailInput = document.getElementById('studentEmailInput');
    const enteredEmail = emailInput ? emailInput.value.trim() : '';
    const errorDiv = document.getElementById('emailError');

    if (!enteredEmail) {
        errorDiv.textContent = "Please enter an email ID.";
        errorDiv.classList.remove('hidden');
        return;
    }

    const foundStudent = ALL_UNIQUE_STUDENTS.find(s => s.email.toLowerCase() === enteredEmail.toLowerCase());

    if (foundStudent) {
        errorDiv.classList.add('hidden');
        loadAndDisplayData(foundStudent.email);
    } else {
        errorDiv.textContent = "Email ID not found in our records. Please check and try again.";
        errorDiv.classList.remove('hidden');
    }
}


/**
 * Transforms raw CSV data into the structured currentStudentData object.
 */
function transformRawData(aggregatedScoresData, questionDetailsData, targetStudentGmailID) {
    let transformedData = {
        studentName: "", // Will be set from data
        targetScore: 1400,
        latestScores: { total: 0, rw: 0, math: 0, avgEocKhan: 0 },
        timeSpent: { studentAvg: 0, studentUnit: "min / assessment", classAvg: 0, classUnit: "min / assessment"},
        scoreTrend: { labels: [], studentScores: [], classAvgScores: [] },
        overallSkillPerformance: { labels: [], studentAccuracy: [], classAvgAccuracy: [] },
        cbPracticeTests: [],
        eocQuizzes: { reading: [], writing: [], math: [] },
        khanAcademy: { reading: [], writing: [], math: [] },
        skills: { reading: [], writing: [], math: [] },
        chapters: window.dashboardData.SAT_CHAPTER_SKILL_MAPPING // Access static mapping via global object
    };

    const studentAggregatedScores = aggregatedScoresData.filter(row => row.StudentGmailID === targetStudentGmailID);
    const studentQuestionDetails = questionDetailsData.filter(row => row.StudentGmailID === targetStudentGmailID);

    // Set student name and target score
    if (studentAggregatedScores.length > 0) {
        transformedData.studentName = studentAggregatedScores[0]['StudentFullName'];
        transformedData.targetScore = studentAggregatedScores[0]['StudentTargetScore'];
    } else {
        transformedData.studentName = targetStudentGmailID; // Fallback to email if name not found
    }

    // Process CB Practice Tests
    const cbTests = studentAggregatedScores.filter(row =>
        row.AssessmentSource === 'Canvas CB Test' && (row.AssessmentName && (row.AssessmentName.startsWith('CB-T') || row.AssessmentName.startsWith('DG-T0')))
    ).sort((a, b) => {
        if (a.AttemptDate && b.AttemptDate) return new Date(a.AttemptDate) - new Date(b.AttemptDate);
        return a.AssessmentName.localeCompare(b.AssessmentName);
    });

    const allOfficialCBTNames = ["DG-T0", "CB-T1", "CB-T2", "CB-T3", "CB-T4", "CB-T5", "CB-T6", "CB-T7", "CB-T8", "CB-T9", "CB-T10"];

    allOfficialCBTNames.forEach(testNameRaw => {
        let normalizedTestName = testNameRaw;
        if (testNameRaw.startsWith('CB-T')) {
            normalizedTestName = testNameRaw.replace('CB-T', 'CB Test ').trim();
        } else if (testNameRaw === 'DG-T0') {
            normalizedTestName = 'CB Test 0';
        }

        const foundTest = cbTests.find(t =>
            t.AssessmentName && t.AssessmentName.trim().toLowerCase() === testNameRaw.toLowerCase()
        );

        if (foundTest) {
            const testQuestions = studentQuestionDetails.filter(q => {
                const qAssessmentNameLower = q.AssessmentName ? q.AssessmentName.trim().toLowerCase() : '';
                const foundTestNameLower = foundTest.AssessmentName ? foundTest.AssessmentName.trim().toLowerCase() : '';
                const altDGTestNameLower = 'cbdbq01';
                return (
                    qAssessmentNameLower.startsWith(foundTestNameLower) ||
                    (foundTestNameLower === 'dg-t0' && qAssessmentNameLower === altDGTestNameLower)
                );
            }).map(qRow => {
                let isCorrectBoolean = (typeof qRow.IsCorrect === 'boolean') ? qRow.IsCorrect :
                                       (typeof qRow.IsCorrect === 'string') ? (qRow.IsCorrect.toLowerCase() === 'true' || qRow.IsCorrect === '1') :
                                       (typeof qRow.IsCorrect === 'number') ? (qRow.IsCorrect === 1) : false;

                const correctAnswerText = !isCorrectBoolean && qRow.CorrectAnswerText ? qRow.CorrectAnswerText : 'N/A';
                let classCorrect = (qRow.PointsPossible_Question > 0 && qRow.ClassAveragePoints_Question !== null) ? Math.round((qRow.ClassAveragePoints_Question / qRow.PointsPossible_Question) * 100) : 0;

                return {
                    id: `<span class="math-inline">\{foundTest\.AssessmentName\.trim\(\)\}\-</span>{qRow.QuestionSequenceInQuiz}`,
                    subject: qRow.SAT_Skill_Tag && (qRow.SAT_Skill_Tag.includes("Math") ? "math" : qRow.SAT_Skill_Tag.includes("Reading") ? "reading" : qRow.SAT_Skill_Tag.includes("Writing") ? "writing" : "unknown"),
                    skill: qR<ctrl63>
