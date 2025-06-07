// Ensure strict mode for better error detection
'use strict';

// Global data objects (initialized once, or re-initialized if explicitly needed by refresh)
window.dashboardData = window.dashboardData || {
    currentStudent: {
        name: "Loading Data...",
        targetScore: 1400,
        latestScores: { total: 0, rw: 0, math: 0, avgEocKhan: 0 },
        timeSpent: { studentAvg: 0, studentUnit: "min / day", classAvg: 0, classUnit: "min / day"},
        scoreTrend: { labels: [], studentScores: [], classAvgScores: [] },
        overallSkillPerformance: { labels: [], studentAccuracy: [], classAvgAccuracy: [] },
        cbPracticeTests: [],
        eocQuizzes: { reading: [], writing: [], math: [] },
        khanAcademy: { reading: [], writing: [], math: [] },
        skills: { reading: [], writing: [] , math: [] }, // Added math to skills initialization for consistency
    },
    ALL_DASHBOARD_QUESTIONS: [],
    ALL_AGGREGATED_SCORES_RAW: [],
    ALL_QUESTION_DETAILS_RAW: [],
    ALL_UNIQUE_STUDENTS: [],
    // Static mappings, remain constant
    SAT_CHAPTER_SKILL_MAPPING: {
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
        writing: { // Changed from Array to Object for consistency with Math if skill keys are needed
            "1: Transitions": ["1: Transitions"], // Changed to object for consistency
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

/**
 * Orchestrates the fetching and processing of all data sources.
 * This is the main function to call when refreshing or initially loading data.
 * @param {string} studentEmail - The email of the student to filter data for.
 */
async function loadAndDisplayData(studentEmail = null) {
    console.log("Loading and displaying data...");
    document.getElementById('studentNameDisplay').textContent = "Loading data...";

    try {
        // Fetch raw data only once when the app first loads
        if (window.dashboardData.ALL_AGGREGATED_SCORES_RAW.length === 0 || window.dashboardData.ALL_QUESTION_DETAILS_RAW.length === 0) {
            window.dashboardData.ALL_AGGREGATED_SCORES_RAW = await fetchCsvData(CSV_URLS.aggregatedScores);
            window.dashboardData.ALL_QUESTION_DETAILS_RAW = await fetchCsvData(CSV_URLS.questionDetails);
            window.dashboardData.ALL_UNIQUE_STUDENTS = getUniqueStudents(window.dashboardData.ALL_AGGREGATED_SCORES_RAW);
        }

        // Determine which student's data to display
        let targetStudentGmailID = studentEmail;
        if (!targetStudentGmailID && window.dashboardData.ALL_UNIQUE_STUDENTS.length > 0) {
            // If no email is provided (initial load without modal input), try to use 'aisha.m@example.com' if available
            // or default to the first student found
            const aisha = window.dashboardData.ALL_UNIQUE_STUDENTS.find(s => s.email.toLowerCase() === 'aisha.m@example.com');
            targetStudentGmailID = aisha ? aisha.email : window.dashboardData.ALL_UNIQUE_STUDENTS[0].email;
        }

        if (!targetStudentGmailID) {
            console.warn("No student data available to display.");
            document.getElementById('studentNameDisplay').textContent = "No Student Data Found!";
            showEmailInputModal(); // Show modal if no student is found
            return;
        }

        const transformedData = transformRawData(window.dashboardData.ALL_AGGREGATED_SCORES_RAW, window.dashboardData.ALL_QUESTION_DETAILS_RAW, targetStudentGmailID);
        window.dashboardData.currentStudent = transformedData; // Update global current student data

        // Populate ALL_DASHBOARD_QUESTIONS with ALL questions from the current student
        window.dashboardData.ALL_DASHBOARD_QUESTIONS = [
            ...(window.dashboardData.currentStudent.cbPracticeTests.flatMap(t => t.questions || [])),
            ...(Object.values(window.dashboardData.currentStudent.eocQuizzes).flat().flatMap(q => q.questions || [])),
            ...(Object.values(window.dashboardData.currentStudent.khanAcademy).flat().flatMap(q => q.questions || []))
        ];
        console.log("ALL_DASHBOARD_QUESTIONS populated with:", window.dashboardData.ALL_DASHBOARD_QUESTIONS.length, "questions from fetched data.");


        document.getElementById('studentNameDisplay').textContent = `Welcome! ${window.dashboardData.currentStudent.studentName}`;

        populateOverview(window.dashboardData.currentStudent);
        populatePracticeTestsTable(window.dashboardData.currentStudent.cbPracticeTests);

        ['reading', 'writing', 'math'].forEach(subject => {
            populateEOCPractice(subject, window.dashboardData.currentStudent.eocQuizzes[subject] || []);
            populateKhanAcademy(subject, window.dashboardData.currentStudent.khanAcademy[subject] || []);
        });

        // Re-render active tab content to ensure charts/tables refresh with new data
        const activeMainTab = document.querySelector('.main-tab-button.active');
        if (activeMainTab) {
            switchMainTab(activeMainTab); // Re-use existing switch function
        }
        console.log("Dashboard data loaded and displayed successfully.");

        hideEmailInputModal(); // Hide modal once data is loaded

    } catch (error) {
        console.error("Failed to load and display dashboard data:", error);
        document.getElementById('studentNameDisplay').textContent = "Data Loading Failed!";
        showEmailInputModal("Error loading data. Please try again."); // Show modal on error
    }
}

/**
 * Extracts unique student emails and full names from aggregated scores.
 * @param {Array<Object>} aggregatedScoresData - The raw aggregated scores data.
 * @returns {Array<Object>} An array of objects, each with { email, fullName }.
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

/**
 * Displays the email input modal.
 * @param {string} errorMessage - Optional error message to display.
 */
function showEmailInputModal(errorMessage = '') {
    const modal = document.getElementById('emailInputModal');
    const errorDiv = document.getElementById('emailError');
    if (modal) {
        modal.style.display = 'block';
        if (errorMessage) {
            errorDiv.textContent = errorMessage;
            errorDiv.classList.remove('hidden');
        } else {
            errorDiv.classList.add('hidden');
        }
    }
}

/**
 * Hides the email input modal.
 */
function hideEmailInputModal() {
    const modal = document.getElementById('emailInputModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * Handles the submission of the email input.
 */
function handleSubmitEmail() {
    const emailInput = document.getElementById('studentEmailInput');
    const enteredEmail = emailInput ? emailInput.value.trim() : '';
    const errorDiv = document.getElementById('emailError');

    if (!enteredEmail) {
        errorDiv.textContent = "Please enter an email ID.";
        errorDiv.classList.remove('hidden');
        return;
    }

    const foundStudent = window.dashboardData.ALL_UNIQUE_STUDENTS.find(s => s.email.toLowerCase() === enteredEmail.toLowerCase());

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
 * @param {Array<Object>} aggregatedScoresData - All raw aggregated scores data.
 * @param {Array<Object>} questionDetailsData - All raw question details data.
 * @param {string} targetStudentGmailID - The email of the student to filter data for.
 * @returns {Object} The transformed currentStudentData object.
 */
function transformRawData(aggregatedScoresData, questionDetailsData, targetStudentGmailID) {
    console.log("Starting data transformation...");
    console.log("Targeting data for student:", targetStudentGmailID);

    const studentAggregatedScores = aggregatedScoresData.filter(row => row.StudentGmailID === targetStudentGmailID);
    const studentQuestionDetails = questionDetailsData.filter(row => row.StudentGmailID === targetStudentGmailID);

    // --- DIAGNOSTIC LOGS START ---
    console.log("Aggregated Scores for target student:", studentAggregatedScores);
    console.log("Question Details for target student:", studentQuestionDetails);

    const uniqueAssessmentNamesInQuestions = [...new Set(studentQuestionDetails.map(row => row.AssessmentName))];
    console.log("Unique AssessmentNames in studentQuestionDetails:", uniqueAssessmentNamesInQuestions);
    // --- DIAGNOSTIC LOGS END ---


    let transformedData = {
        studentName: studentAggregatedScores.length > 0 ? studentAggregatedScores[0]['StudentFullName'] : "Unknown Student",
        targetScore: studentAggregatedScores.length > 0 ? studentAggregatedScores[0]['StudentTargetScore'] : 1400,
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
        chapters: window.dashboardData.SAT_CHAPTER_SKILL_MAPPING // Access static mapping via global object
    };

    // --- Process CB Practice Tests from Aggregated Scores ---
    const cbTests = studentAggregatedScores.filter(row =>
        row.AssessmentSource === 'Canvas CB Test' && (row.AssessmentName && (row.AssessmentName.startsWith('CB-T') || row.AssessmentName.startsWith('DG-T0')))
    );
    cbTests.sort((a, b) => {
        if (a.AttemptDate && b.AttemptDate) return new Date(a.AttemptDate) - new Date(b.AttemptDate);
        return a.AssessmentName.localeCompare(b.AssessmentName);
    });

    const allOfficialCBTNames = [
        "DG-T0", "CB-T1", "CB-T2", "CB-T3", "CB-T4", "CB-T5", "CB-T6", "CB-T7", "CB-T8", "CB-T9", "CB-T10"
    ];

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
            console.log(`Attempting to find questions for CB Test: ${foundTest.AssessmentName}`);

            const testQuestions = studentQuestionDetails.filter(q => {
                const qAssessmentNameLower = q.AssessmentName ? q.AssessmentName.trim().toLowerCase() : '';
                const foundTestNameLower = foundTest.AssessmentName ? foundTest.AssessmentName.trim().toLowerCase() : '';
                const altDGTestNameLower = 'cbdbq01';

                return (
                    qAssessmentNameLower.startsWith(foundTestNameLower) ||
                    (foundTestNameLower === 'dg-t0' && qAssessmentNameLower === altDGTestNameLower)
                );
            }).map(qRow => {
                let isCorrectBoolean = false;
                if (typeof qRow.IsCorrect === 'boolean') {
                    isCorrectBoolean = qRow.IsCorrect;
                } else if (typeof qRow.IsCorrect === 'string') {
                    isCorrectBoolean = qRow.IsCorrect.toLowerCase() === 'true' || qRow.IsCorrect === '1';
                } else if (typeof qRow.IsCorrect === 'number') {
                    isCorrectBoolean = qRow.IsCorrect === 1;
                }

                const correctAnswerText = !isCorrectBoolean && qRow.CorrectAnswerText ? qRow.CorrectAnswerText : 'N/A';

                let classCorrect = 0;
                if (qRow.PointsPossible_Question > 0 && qRow.ClassAveragePoints_Question !== null) {
                    classCorrect = Math.round((qRow.ClassAveragePoints_Question / qRow.PointsPossible_Question) * 100);
                }


                return {
                    id: `${foundTest.AssessmentName.trim()}-${qRow.QuestionSequenceInQuiz}`,
                    subject: qRow.SAT_Skill_Tag && (qRow.SAT_Skill_Tag.includes("Math") ? "math" : qRow.SAT_Skill_Tag.includes("Reading") ? "reading" : qRow.SAT_Skill_Tag.includes("Writing") ? "writing" : "unknown"),
                    skill: qRow.SAT_Skill_Tag,
                    difficulty: qRow.Difficulty,
                    yourAnswer: qRow.StudentAnswer,
                    correctAnswer: correctAnswerText,
                    isCorrect: isCorrectBoolean,
                    explanation: "Explanation will go here if available from another source",
                    yourTime: qRow.TimeSpentOnQuestion_Seconds,
                    classAvgTime: qRow.ClassAverageTime_Seconds,
                    classPerformance: {
                        correct: classCorrect,
                        incorrect: 100 - classCorrect,
                        unanswered: 0
                    },
                    source: foundTest.AssessmentSource,
                    text: qRow.QuestionText_fromMetadata
                };
            });

            if (testQuestions.length === 0) {
                console.warn(`No section-level questions found for base test "${foundTest.AssessmentName}" in studentQuestionDetails.`);
            } else {
                console.log(`${testQuestions.length} section-level questions found for base test "${foundTest.AssessmentName}".`);
            }

            const classAvgTotalScore = studentAggregatedScores.find(s => s.AssessmentName && s.AssessmentName.trim().toLowerCase() === foundTest.AssessmentName.trim().toLowerCase())?.ClassAverageScore_Normalized;


            transformedData.cbPracticeTests.push({
                name: normalizedTestName,
                date: foundTest.AttemptDate,
                rw: foundTest.ScaledScore_RW || "-",
                math: foundTest.ScaledScore_Math || "-",
                total: foundTest.ScaledScore_Total || "-",
                classAvgTotal: classAvgTotalScore,
                questions: testQuestions
            });
        } else {
            transformedData.cbPracticeTests.push({
                name: normalizedTestName,
                date: "Not Attempted",
                rw: "-",
                math: "-",
                total: "-",
                classAvgTotal: null,
                questions: []
            });
        }
    });

    // --- Populate Score Trend (from CB Tests) ---
    transformedData.scoreTrend.labels = transformedData.cbPracticeTests
        .filter(t => t.date !== "Not Attempted" && t.total !== "-")
        .map(t => t.name);
    transformedData.scoreTrend.studentScores = transformedData.cbPracticeTests
        .filter(t => t.date !== "Not Attempted" && t.total !== "-")
        .map(t => t.total);
    transformedData.scoreTrend.classAvgScores = transformedData.cbPracticeTests
        .filter(t => t.date !== "Not Attempted" && t.total !== "-")
        .map(t => t.classAvgTotal || null);


    // --- Calculate Overall Scores and Latest Scores ---
    const latestTest = transformedData.cbPracticeTests.filter(t => t.date !== "Not Attempted" && t.total !== "-").sort((a,b) => new Date(b.date) - new Date(a.date))[0];
    if (latestTest) {
        transformedData.latestScores.total = latestTest.total;
        transformedData.latestScores.rw = latestTest.rw;
        transformedData.latestScores.math = latestTest.math;
    }

    // --- Process EOC Quizzes and Khan Academy ---
    const questionsGroupedByAssessment = {};
    studentQuestionDetails.forEach(qRow => {
        const assessmentName = qRow.AssessmentName ? qRow.AssessmentName.trim() : null;
        const assessmentSource = qRow.AssessmentSource ? qRow.AssessmentSource.trim() : null;

        if (!assessmentName || !assessmentSource) return;

        if (!questionsGroupedByAssessment[assessmentSource]) {
            questionsGroupedByAssessment[assessmentSource] = {};
        }
        if (!questionsGroupedByAssessment[assessmentSource][assessmentName]) {
            questionsGroupedByAssessment[assessmentSource][assessmentName] = [];
        }
        questionsGroupedByAssessment[assessmentSource][assessmentName].push(qRow);
    });

    // Process EOC Assessments from aggregated scores
    const eocAggregatedAssessments = studentAggregatedScores.filter(row => row.AssessmentSource === 'Canvas EOC Practice');

    eocAggregatedAssessments.forEach(aggQuiz => {
        const quizName = aggQuiz.AssessmentName.trim();
        const quizSource = aggQuiz.AssessmentSource.trim();
        const subjectCategoryEOC = quizName.toLowerCase().includes('r-eoc') ? 'reading' :
                                   quizName.toLowerCase().includes('w-eoc') ? 'writing' :
                                   quizName.toLowerCase().includes('m-eoc') ? 'math' : 'unknown';

        console.log(`Processing EOC quiz from aggregated: "${quizName}" (Source: "${quizSource}")`);

        // FIX: Match quiz questions using startsWith or includes based on the quiz name
        // This is crucial for matching 'R-EOC-C8' with 'R-EOC-C8-Q1' etc.
        const questionsForQuiz = Object.values(questionsGroupedByAssessment[quizSource] || {})
            .flatMap(questionsArray => questionsArray.filter(qRow =>
                qRow.AssessmentName && qRow.AssessmentName.trim().toLowerCase().startsWith(quizName.toLowerCase())
            ))
            .map(qRow => {
                let isCorrectBoolean = false;
                if (typeof qRow.IsCorrect === 'boolean') {
                    isCorrectBoolean = qRow.IsCorrect;
                } else if (typeof qRow.IsCorrect === 'string') {
                    isCorrectBoolean = qRow.IsCorrect.toLowerCase() === 'true' || qRow.IsCorrect === '1';
                } else if (typeof qRow.IsCorrect === 'number') {
                    isCorrectBoolean = qRow.IsCorrect === 1;
                }
                const correctAnswerText = !isCorrectBoolean && qRow.CorrectAnswerText ? qRow.CorrectAnswerText : 'N/A';
                let classCorrect = 0;
                if (qRow.PointsPossible_Question > 0 && qRow.ClassAveragePoints_Question !== null) {
                    classCorrect = Math.round((qRow.ClassAveragePoints_Question / qRow.PointsPossible_Question) * 100);
                }

                return {
                    id: `${qRow.AssessmentName.trim()}-${qRow.QuestionSequenceInQuiz}`, // Use the actual detailed assessment name for question ID
                    subject: qRow.SAT_Skill_Tag && (qRow.SAT_Skill_Tag.includes("Math") ? "math" : qRow.SAT_Skill_Tag.includes("Reading") ? "reading" : qRow.SAT_Skill_Tag.includes("Writing") ? "writing" : "unknown"),
                    skill: qRow.SAT_Skill_Tag,
                    difficulty: qRow.Difficulty,
                    yourAnswer: qRow.StudentAnswer,
                    correctAnswer: correctAnswerText,
                    isCorrect: isCorrectBoolean,
                    explanation: "Explanation will go here if available",
                    yourTime: qRow.TimeSpentOnQuestion_Seconds,
                    classAvgTime: qRow.ClassAverageTime_Seconds,
                    classPerformance: {
                        correct: classCorrect,
                        incorrect: 100 - classCorrect,
                        unanswered: 0
                    },
                    source: quizSource,
                    text: qRow.QuestionText_fromMetadata
                };
            });

        if(questionsForQuiz.length === 0){
            console.warn(`No question details found for EOC quiz "${quizName}" in studentQuestionDetails.`);
        } else {
            console.log(`${questionsForQuiz.length} questions found for EOC quiz "${quizName}".`);
        }

        if (transformedData.eocQuizzes[subjectCategoryEOC]) {
            transformedData.eocQuizzes[subjectCategoryEOC].push({
                name: quizName,
                date: aggQuiz.AttemptDate || "N/A",
                latestScore: aggQuiz.Score_Percentage !== null ? `${aggQuiz.Score_Percentage}% (${aggQuiz.Score_Raw_Combined}/${aggQuiz.PointsPossible_Combined})` : "N/A",
                classAvgScore: aggQuiz.ClassAverageScore_Normalized,
                questions: questionsForQuiz
            });
        }
    });

    // Process Khan Academy Assessments from aggregated scores
    const khanAggregatedAssessments = studentAggregatedScores.filter(row => row.AssessmentSource === 'Khan Academy Practice');

    khanAggregatedAssessments.forEach(aggQuiz => {
        const quizName = aggQuiz.AssessmentName.trim();
        const quizSource = aggQuiz.AssessmentSource.trim();
        const khanSubject = quizName.toLowerCase().includes('reading') ? 'reading' :
                            quizName.toLowerCase().includes('writing') || quizName.toLowerCase().includes('grammar') ? 'writing' :
                            quizName.toLowerCase().includes('math') || quizName.toLowerCase().includes('algebra') || quizName.toLowerCase().includes('geometry') ? 'math' : 'unknown';

        console.log(`Processing Khan Academy quiz from aggregated: "${quizName}" (Source: "${quizSource}")`);

        // FIX: Match quiz questions using startsWith or includes based on the quiz name
        const questionsForQuiz = Object.values(questionsGroupedByAssessment[quizSource] || {})
            .flatMap(questionsArray => questionsArray.filter(qRow =>
                qRow.AssessmentName && qRow.AssessmentName.trim().toLowerCase().includes(quizName.toLowerCase())
            ))
            .map(qRow => {
                 let isCorrectBoolean = false;
                if (typeof qRow.IsCorrect === 'boolean') {
                    isCorrectBoolean = qRow.IsCorrect;
                } else if (typeof qRow.IsCorrect === 'string') {
                    isCorrectBoolean = qRow.IsCorrect.toLowerCase() === 'true' || qRow.IsCorrect === '1';
                } else if (typeof qRow.IsCorrect === 'number') {
                    isCorrectBoolean = qRow.IsCorrect === 1;
                }
                const correctAnswerText = !isCorrectBoolean && qRow.CorrectAnswerText ? qRow.CorrectAnswerText : 'N/A';
                let classCorrect = 0;
                if (qRow.PointsPossible_Question > 0 && qRow.ClassAveragePoints_Question !== null) {
                    classCorrect = Math.round((qRow.ClassAveragePoints_Question / qRow.PointsPossible_Question) * 100);
                }
                return {
                    id: `${qRow.AssessmentName.trim()}-${qRow.QuestionSequenceInQuiz}`, // Use the actual detailed assessment name for question ID
                    subject: qRow.SAT_Skill_Tag && (qRow.SAT_Skill_Tag.includes("Math") ? "math" : qRow.SAT_Skill_Tag.includes("Reading") ? "reading" : qRow.SAT_Skill_Tag.includes("Writing") ? "writing" : "unknown"),
                    skill: qRow.SAT_Skill_Tag,
                    difficulty: qRow.Difficulty,
                    yourAnswer: qRow.StudentAnswer,
                    correctAnswer: correctAnswerText,
                    isCorrect: isCorrectBoolean,
                    explanation: "Explanation will go here if available",
                    yourTime: qRow.TimeSpentOnQuestion_Seconds,
                    classAvgTime: qRow.ClassAverageTime_Seconds,
                    classPerformance: {
                        correct: classCorrect,
                        incorrect: 100 - classCorrect,
                        unanswered: 0
                    },
                    source: quizSource,
                    text: qRow.QuestionText_fromMetadata
                };
            });

        if(questionsForQuiz.length === 0){
            console.warn(`No question details found for Khan Academy quiz "${quizName}" in studentQuestionDetails.`);
        } else {
            console.log(`${questionsForQuiz.length} questions found for Khan Academy quiz "${quizName}".`);
        }

        if (transformedData.khanAcademy[khanSubject]) {
            transformedData.khanAcademy[khanSubject].push({
                name: quizName,
                date: aggQuiz.AttemptDate || "N/A",
                latestScore: aggQuiz.Score_Percentage !== null ? `${aggQuiz.Score_Percentage}% (${aggQuiz.Score_Raw_Combined}/${aggQuiz.PointsPossible_Combined})` : "N/A",
                classAvgScore: aggQuiz.ClassAverageScore_Normalized,
                questions: questionsForQuiz
            });
        }
    });


    // --- Calculate Skill Performance (from all questions) ---
    const allStudentQuestionsForSkills = studentQuestionDetails;
    const skillScores = {};

    allStudentQuestionsForSkills.forEach(q => {
        const skill = q.SAT_Skill_Tag;
        if (!skill) return;

        let isCorrectBoolean = false;
        if (typeof q.IsCorrect === 'boolean') {
            isCorrectBoolean = q.IsCorrect;
        } else if (typeof q.IsCorrect === 'string') {
            isCorrectBoolean = q.IsCorrect.toLowerCase() === 'true' || q.IsCorrect === '1';
        } else if (typeof q.IsCorrect === 'number') {
            isCorrectBoolean = q.IsCorrect === 1;
        }

        if (!skillScores[skill]) {
            skillScores[skill] = { correctCount: 0, totalCount: 0, classSumPoints: 0, classTotalPossible: 0 };
        }
        skillScores[skill].totalCount++;
        if (isCorrectBoolean) {
            skillScores[skill].correctCount++;
        }
        if (q.ClassAveragePoints_Question !== null && q.PointsPossible_Question !== null && q.PointsPossible_Question > 0) {
            skillScores[skill].classSumPoints += q.ClassAveragePoints_Question;
            skillScores[skill].classTotalPossible += q.PointsPossible_Question;
        }
    });

    const subjects = ['reading', 'writing', 'math'];
    subjects.forEach(subject => {
        transformedData.skills[subject] = [];
    });

    for (const skillName in skillScores) {
        const scoreData = skillScores[skillName];
        const studentScore = scoreData.totalCount > 0 ? Math.round((scoreData.correctCount / scoreData.totalCount) * 100) : 0;
        const classAvgScore = scoreData.classTotalPossible > 0 ? Math.round((scoreData.classSumPoints / scoreData.classTotalPossible) * 100) : 0;

        let subjectCategory = 'unknown';
        if (skillName.includes('Reading')) subjectCategory = 'reading';
        else if (skillName.includes('Writing') || skillName.includes('Grammar') || skillName.includes('Punctuation')) subjectCategory = 'writing';
        else if (skillName.includes('Math') || skillName.includes('Algebra') || skillName.includes('Geometry')) subjectCategory = 'math';

        if (transformedData.skills[subjectCategory]) {
            transformedData.skills[subjectCategory].push({
                name: skillName,
                score: studentScore,
                classAvg: classAvgScore,
                attempted: scoreData.totalCount > 0
            });
        }
    }

    // --- Calculate OverallSkillPerformance (for overview chart) ---
    const overallSkillSubjects = subjects.filter(subject => transformedData.skills[subject].length > 0);
    transformedData.overallSkillPerformance.labels = [];
    transformedData.overallSkillPerformance.studentAccuracy = [];
    transformedData.overallSkillPerformance.classAvgAccuracy = [];

    overallSkillSubjects.forEach(subject => {
        const subjectSkills = transformedData.skills[subject].filter(s => s.attempted);
        if (subjectSkills.length > 0) {
            const totalStudentAccuracy = subjectSkills.reduce((sum, s) => sum + s.score, 0);
            const totalClassAccuracy = subjectSkills.reduce((sum, s) => sum + s.classAvg, 0);
            transformedData.overallSkillPerformance.labels.push(subject.charAt(0).toUpperCase() + subject.slice(1));
            transformedData.overallSkillPerformance.studentAccuracy.push(Math.round(totalStudentAccuracy / subjectSkills.length));
            transformedData.overallSkillPerformance.classAvgAccuracy.push(Math.round(totalClassAccuracy / subjectSkills.length));
        }
    });

    // --- Calculate Time Spent ---
    const totalStudentTimeSeconds = studentAggregatedScores.reduce((sum, row) => sum + (row.TimeSpent_Seconds || 0), 0);
    const totalClassTimeSeconds = aggregatedScoresData.reduce((sum, row) => sum + (row.ClassAverageTime_Seconds || 0), 0);

    transformedData.timeSpent.studentAvg = studentAggregatedScores.length > 0 ? Math.round(totalStudentTimeSeconds / studentAggregatedScores.length / 60) : 0;
    transformedData.timeSpent.classAvg = aggregatedScoresData.length > 0 ? Math.round(totalClassTimeSeconds / aggregatedScoresData.length / 60) : 0;
    transformedData.timeSpent.studentUnit = "min / assessment";
    transformedData.timeSpent.classUnit = "min / assessment";

    // --- Calculate Avg EOC/Khan Score ---
    const allEocKhanScores = Object.values(transformedData.eocQuizzes).flat().map(q => {
        const percentageMatch = String(q.latestScore).match(/(\d+)%/);
        return percentageMatch ? parseInt(percentageMatch[1]) : 0;
    }).filter(score => score > 0);

    const allKhanScores = Object.values(transformedData.khanAcademy).flat().map(q => {
        const percentageMatch = String(q.latestScore).match(/(\d+)%/);
        return percentageMatch ? parseInt(percentageMatch[1]) : 0;
    }).filter(score => score > 0);

    const combinedEocKhanScores = [...allEocKhanScores, ...allKhanScores];
    if (combinedEocKhanScores.length > 0) {
        transformedData.latestScores.avgEocKhan = Math.round(combinedEocKhanScores.reduce((sum, score) => sum + score, 0) / combinedEocKhanScores.length);
    } else {
        transformedData.latestScores.avgEocKhan = 0;
    }

    console.log("Transformed Data:", transformedData);
    return transformedData;
}

// --- Modals and Detailed View Functions ---

const modal = document.getElementById('detailModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');

/**
 * Opens the modal to show ALL incorrect questions for a specific skill,
 * triggered from the "Skills Hub" (by clicking a skill performance bar).
 * Questions are sorted by difficulty.
 * @param {string} skillName - The name of the skill to filter by.
 * @param {string} subject - The subject of the skill (e.g., 'reading').
 */
function openSkillIncorrectQuestionsModal(skillName, subject) {
    modalTitle.textContent = `Incorrect Questions for: ${skillName} (${subject.charAt(0).toUpperCase() + subject.slice(1)})`;

    const incorrectQuestions = window.dashboardData.ALL_DASHBOARD_QUESTIONS.filter(q =>
        q.skill === skillName && !q.isCorrect && q.subject === subject
    );

    const difficultyOrder = { "Hard": 1, "Medium": 2, "Easy": 3 };
    incorrectQuestions.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);

    if (incorrectQuestions.length === 0) {
        modalBody.innerHTML = `<p class="text-center p-5 text-gray-600">No incorrect questions found for "${skillName}" in ${subject}. This may be because you answered them correctly, or no questions for this skill were attempted/available.</p>`;
    } else {
        modalBody.innerHTML = incorrectQuestions.map((q, index) => renderQuestionAnalysisCard(q, `skill-${index}`, false)).join('');
    }
    modal.style.display = "block";
    renderDynamicCharts();
    addExplanationToggleListeners();
}

/**
 * Opens the modal to show ALL questions for a specific CB Practice Test,
 * and includes a pacing analysis table at the bottom.
 * @param {string} testName - The name of the test.
 */
function openTestQuestionsModal(testName) {
    modalTitle.textContent = `Reviewing Test: ${testName}`;
    const test = window.dashboardData.currentStudent.cbPracticeTests.find(t => t.name === testName);

    if (!test || !test.questions || test.questions.length === 0) {
        modalBody.innerHTML = `<p class="text-center p-5 text-gray-600">No questions found for ${testName}.</p>`;
        modal.style.display = "block";
        return;
    }

    let content = test.questions.map((q, index) => renderQuestionAnalysisCard(q, `test-${index}`, true)).join('');

    if (test.questions.some(q => q.yourTime !== undefined && q.classAvgTime !== undefined)) {
        content += `<h3 class="text-lg font-semibold text-gray-800 border-t pt-4 mt-6">Pacing Analysis</h3>`;
        content += `<div class="pacing-bar-chart-container"><canvas id="pacingBarChart"></canvas></div>`;

        const pacingRows = test.questions.map((p, index) => {
            const diff = (p.yourTime || 0) - (p.classAvgTime || 0); // Handle potential null/undefined
            const status = diff > 15 ? 'Slower' : diff < -15 ? 'Faster' : 'On Pace';
            const statusClass = `pacing-${status.toLowerCase().replace(' ', '-')}`;
            return `<tr><td>${index + 1}</td><td>${p.yourTime || 'N/A'}s</td><td>${p.classAvgTime || 'N/A'}s</td><td><span class="pacing-badge ${statusClass}">${status}</span></td><td class="${p.isCorrect ? 'text-good' : 'text-poor'} font-semibold">${p.isCorrect ? 'Correct' : 'Incorrect'}</td></tr>`;
        }).join('');
        content += `<div class="overflow-x-auto mt-4"><table class="min-w-full table"><thead><tr><th>Q#</th><th>Your Time</th><th>Class Avg</th><th>Pacing</th><th>Result</th></tr></thead><tbody>${pacingRows}</tbody></table></div>`;
    } else {
        content += `<p class="text-center p-4 text-gray-500">Pacing data not available for this test.</p>`;
    }

    modalBody.innerHTML = content;
    modal.style.display = "block";
    renderDynamicCharts();
    addExplanationToggleListeners();
    if (test.questions.some(q => q.yourTime !== undefined)) {
        renderPacingBarChart('pacingBarChart', test.questions);
    }
}

/**
 * Opens the modal to show ALL questions for a specific EOC Quiz.
 * Pacing data is NOT included for EOC quizzes.
 * @param {string} quizName - The name of the EOC quiz.
 * @param {string} subject - The subject of the EOC quiz.
 */
function openEOCQuizQuestionsModal(quizName, subject) {
    modalTitle.textContent = `Reviewing EOC Quiz: ${quizName} (${subject.charAt(0).toUpperCase() + subject.slice(1)})`;
    const quizzesForSubject = window.dashboardData.currentStudent.eocQuizzes[subject] || [];
    const quiz = quizzesForSubject.find(q => q.name === quizName);

    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
        modalBody.innerHTML = `<p class="text-center p-5 text-gray-600">No questions found for ${quizName}.</p>`;
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
 * Opens the modal to show ALL questions for a specific Khan Academy Quiz.
 * Pacing data is NOT included for Khan Academy quizzes.
 * @param {string} quizName - The name of the Khan Academy quiz.
 * @param {string} subject - The subject of the Khan Academy quiz.
 */
function openKhanAcademyQuizQuestionsModal(quizName, subject) {
    modalTitle.textContent = `Reviewing Khan Academy Quiz: ${quizName} (${subject.charAt(0).toUpperCase() + subject.slice(1)})`;
    const quizzesForSubject = window.dashboardData.currentStudent.khanAcademy[subject] || [];
    const quiz = quizzesForSubject.find(q => q.name === quizName);

    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
        modalBody.innerHTML = `<p class="text-center p-5 text-gray-600">No questions found for ${quizName}.</p>`;
        modal.style.display = "block";
        return;
    }

    let content = quiz.questions.map((q, index) => renderQuestionAnalysisCard(q, `khan-${index}`, false)).join('');

    modalBody.innerHTML = content;
    modal.style.display = "block";
    renderDynamicCharts();
    addExplanationToggleListeners();
}


/**
 * Closes the modal and cleans up any Chart.js instances to prevent memory leaks.
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
 * This function now includes class performance percentage, a mini donut,
 * and a toggle for explanation.
 * @param {object} q - The question object.
 * @param {string} uniqueIdPrefix - A unique prefix for element IDs within the card (e.g., 'skill-0', 'test-1').
 * @param {boolean} includePacing - Whether to show the pacing information for this question.
 * @returns {string} - The HTML string for the card.
 */
function renderQuestionAnalysisCard(q, uniqueIdPrefix, includePacing = false) {
    const resultText = q.isCorrect ? "Correct" : "Incorrect";
    const resultClass = q.isCorrect ? "text-good" : "text-poor";
    const sourceInfo = q.source ? `<span class="meta-item text-gray-500">Source: ${q.source}</span>` : '';
    const questionTextDisplay = q.text ? `<p class="mb-2 text-gray-800 font-medium">${q.text}</p>` : `<p class="mb-2 text-gray-800 font-medium">Question ID: ${q.id}</p>`;

    const pacingHtml = includePacing && q.yourTime !== undefined && q.classAvgTime !== undefined ?
        `<p class="text-center text-sm mt-2">Pacing: <strong>${q.yourTime}s</strong> (Class Avg: ${q.classAvgTime}s)</p>` : '';

    const classCorrectPercentage = q.classPerformance ? q.classPerformance.correct : 'N/A';
    const classIncorrectPercentage = q.classPerformance ? q.classPerformance.incorrect : 'N/A';
    const classUnansweredPercentage = q.classPerformance ? q.classPerformance.unanswered : 'N/A';


    const explanationHtml = q.explanation ? `
        <button class="toggle-explanation-btn" data-target="explanation-${uniqueIdPrefix}-${q.id}">Show Explanation</button>
        <div id="explanation-${uniqueIdPrefix}-${q.id}" class="answer-explanation">
            <p class="font-semibold text-sm">Explanation</p>
            <p class="text-sm">${q.explanation}</p>
        </div>
    ` : '';

    // Get relevant chapters for review based on skill
    const relevantChapters = getChaptersForSkill(q.skill, q.subject);
    const chapterReviewHtml = relevantChapters.length > 0 ? `
        <div class="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200 text-sm">
            <p class="font-semibold text-blue-800 mb-1">Review Chapters:</p>
            <ul class="list-disc list-inside text-blue-700">
                ${relevantChapters.map(chapter => `<li>${chapter}</li>`).join('')}
            </ul>
        </div>
    ` : '';

    return `
    <div class="question-analysis-card">
        <div class="question-analysis-header">
            <span class="font-semibold text-gray-700">${q.skill}</span>
            <span class="difficulty-badge difficulty-${q.difficulty}">${q.difficulty}</span>
            ${sourceInfo}
        </div>
        <div class="question-analysis-body">
            <div>
                ${questionTextDisplay}
                <p>Your Answer: <span class="font-semibold ${resultClass}">${q.yourAnswer}</span> <span class="font-bold">(${resultText})</span></p>
                ${!q.isCorrect && q.correctAnswer !== 'N/A' ? `<p>Correct Answer: <span class="font-semibold text-good">${q.correctAnswer}</span></p>` : ''}
                ${explanationHtml}
                ${chapterReviewHtml}
            </div>
            <div>
                <p class="text-center text-sm font-semibold mb-2">Class Performance: ${classCorrectPercentage}% Correct</p>
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
 * @param {string} skillName - The skill name.
 * @param {string} subject - The subject (e.g., 'math', 'reading', 'writing').
 * @returns {string[]} An array of chapter names.
 */
function getChaptersForSkill(skillName, subject) {
    const chapters = new Set();
    // Access static mapping via global object
    const skillMap = window.dashboardData.SAT_CHAPTER_SKILL_MAPPING[subject];

    if (skillMap) {
        for (const mappedSkill in skillMap) {
            if (skillName && mappedSkill && (skillName.toLowerCase().includes(mappedSkill.toLowerCase()) || mappedSkill.toLowerCase().includes(skillName.toLowerCase()))) {
                skillMap[mappedSkill].forEach(chapter => chapters.add(chapter));
            }
        }
    }
    return Array.from(chapters).sort();
}


/**
 * Renders dynamic Chart.js charts for canvases present in the modalBody.
 * This must be called *after* the HTML content with the canvas elements is in the DOM.
 */
function renderDynamicCharts() {
    const canvases = modalBody.querySelectorAll('canvas[id^="chart-"]');
    canvases.forEach(canvas => {
        const chartId = canvas.id;
        const existingChart = Chart.getChart(chartId);
        if (existingChart) {
            existingChart.destroy();
        }

        // FIX: Corrected the substring logic for qIdToMatch
        // The ID format is "chart-[uniqueIdPrefix]-[q.id]"
        // Example: "chart-test-0-DG-T0-Q1" where q.id is "DG-T0-Q1"
        // Example: "chart-skill-0-Punctuation (Commas)-Q1" where q.id is "Punctuation (Commas)-Q1"
        const firstHyphen = chartId.indexOf('-');
        const secondHyphen = chartId.indexOf('-', firstHyphen + 1);
        const qIdToMatch = chartId.substring(secondHyphen + 1);


        // Access ALL_DASHBOARD_QUESTIONS via global object
        const qData = window.dashboardData.ALL_DASHBOARD_QUESTIONS.find(q => q.id === qIdToMatch);


        if (qData && qData.classPerformance && (qData.classPerformance.correct + qData.classPerformance.incorrect + qData.classPerformance.unanswered > 0)) {
            const correct = qData.classPerformance.correct || 0;
            const incorrect = qData.classPerformance.incorrect || 0;
            const unanswered = qData.classPerformance.unanswered || 0;

            canvas.style.display = 'block';
            const existingNoDataMessage = canvas.parentNode.querySelector('.no-chart-data-message');
            if (existingNoDataMessage) existingNoDataMessage.remove();

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
                        legend: {
                            display: true,
                            position: 'bottom',
                            labels: {
                                boxWidth: 12,
                                font: {
                                    size: 10
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed !== null) {
                                        label += context.parsed + '%';
                                    }
                                    return label;
                                }
                            }
                        }
                    },
                    cutout: '60%',
                }
            });
        } else {
            const parentDiv = canvas.parentNode;
            canvas.style.display = 'none';
            if (!parentDiv.querySelector('.no-chart-data-message')) {
                parentDiv.innerHTML += '<p class="text-center text-gray-500 text-sm no-chart-data-message">No class performance data for this question.</p>';
            }
        }
    });
}

/**
 * Renders a bar chart for pacing analysis.
 * @param {string} canvasId - The ID of the canvas element.
 * @param {Array} questions - An array of question objects with pacing data.
 */
function renderPacingBarChart(canvasId, questions) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const existingChart = Chart.getChart(canvasId);
    if (existingChart) {
        existingChart.destroy();
    }

    const labels = questions.map((q, index) => `Q${index + 1}`);
    const yourTimes = questions.map(q => q.yourTime || 0);
    const classAvgTimes = questions.map(q => q.classAvgTime || 0);

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
                {
                    label: 'Your Time (s)',
                    data: yourTimes,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1,
                    barPercentage: 0.8,
                    categoryPercentage: 0.8
                },
                {
                    label: 'Class Avg Time (s)',
                    data: classAvgTimes,
                    backgroundColor: 'rgba(117, 117, 117, 0.5)',
                    borderColor: 'rgba(117, 117, 117, 0.8)',
                    borderWidth: 1,
                    type: 'line',
                    fill: false,
                    pointRadius: 3,
                    pointBackgroundColor: '#757575',
                    tension: 0.1,
                    hidden: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        title: function(context) {
                            return context[0].label;
                        },
                        label: function(context) {
                            if (context.dataset.label === 'Your Time (s)') {
                                const qIndex = context.dataIndex;
                                const difficulty = questions[qIndex].difficulty;
                                return `${context.dataset.label}: ${context.parsed.y}s (Difficulty: ${difficulty || 'N/A'})`;
                            }
                            return `${context.dataset.label}: ${context.parsed.y}s`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Question Number'
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Time (seconds)'
                    },
                    beginAtZero: true
                }
            }
        });
}


/**
 * Adds event listeners to "Show Explanation" buttons to toggle explanation visibility.
 * This needs to be called every time new content is loaded into the modalBody.
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
