<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Analytics Hub (The SAT Hub Theme)</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js"></script>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f0f2f5;
            color: #333333;
        }
        .sathub-header {
            background-color: #2a5266;
            color: #f0f0f0;
        }
        .sathub-header-title {
            color: #ffd700;
        }
        .main-tab-button {
            transition: all 0.3s ease;
            color: #4b5563;
        }
        .main-tab-button.active {
            border-bottom-width: 2px;
            border-color: #2a5266; 
            color: #2a5266;     
            font-weight: 600;
        }
        .main-tab-button:not(.active):hover {
            color: #2a5266; 
        }
        .sub-tab-button {
            padding: 0.5rem 1rem;
            border-radius: 0.375rem;
            transition: background-color 0.3s ease, color 0.3s ease;
            font-size: 0.875rem;
            margin-right: 0.5rem; 
            color: #4b5563; 
            background-color: #f3f4f6; 
        }
        .sub-tab-button.active {
            background-color: #2a5266; 
            color: #ffffff; 
        }
        .sub-tab-button:not(.active):hover {
            background-color: #e5e7eb; 
        }
        .themed-card {
            background-color: #ffffff;
            border-radius: 0.5rem; 
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); 
            border: 1px solid #28a745;
            border-left-width: 8px; 
            border-left-color: #ffd700; 
            overflow: hidden; 
            margin-bottom: 1.5rem; 
        }
        .themed-card-title-strip {
            background-color: #2a5266; 
            color: #ffd700;           
            padding: 0.75rem 1.25rem; 
            font-size: 1.125rem; 
            font-weight: 600; 
        }
        .themed-card-body {
            padding: 1.25rem; 
        }
        .score-card { 
            background-color: #ffffff;
            border-radius: 0.5rem; 
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); 
            padding: 1.25rem; 
            border: 1px solid #28a745; 
            border-left-width: 8px; 
            border-left-color: #ffd700; 
        }
        .score-card .score-value {
            color: #2a5266; 
        }
        .table th, .table td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid #e0e0e0; }
        .table th { background-color: #f8f9fa; font-weight: 600; color: #2d3b45; }
        .table tbody tr:last-child td { border-bottom: 0; }
        .table tbody tr.clickable-row:hover { background-color: #e7f3fe; cursor: pointer; }
        .progress-bar-container { background-color: #e0e0e0; border-radius: 0.25rem; overflow: hidden; height: 1rem; }
        .progress-bar { height: 100%; text-align: center; color: white; font-size: 0.75rem; line-height: 1rem; transition: width 0.5s ease-in-out; }
        .performance-good { background-color: #28a745; } 
        .performance-average { background-color: #ffc107; } 
        .performance-poor { background-color: #dc3545; } 
        .text-good { color: #198754; } 
        .text-poor { color: #bb2d3b; }
        .arrow-up { color: #198754; }
        .arrow-down { color: #bb2d3b; }
        .mobile-nav-link.active {
            background-color: #2a5266;
            color: #ffd700;
            font-weight: 600;
        }
        .modal { display: none; position: fixed; z-index: 100; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.6); }
        .modal-content { background-color: #fefefe; margin: 5% auto; padding: 0; border: 1px solid #cccccc; width: 90%; max-width: 50rem; border-radius: 8px; position: relative; overflow:hidden; box-shadow: 0 5px 15px rgba(0,0,0,0.3); transition: max-width 0.3s ease-in-out; }
        .modal-content.modal-large { max-width: 64rem; }
        .modal-header { background-color: #2a5266; color: #ffd700; padding: 1rem 1.25rem; font-size: 1.25rem; font-weight: 600; display: flex; justify-content: space-between; align-items: center; }
        .modal-body-content { padding: 1.25rem; max-height: calc(90vh - 100px); overflow-y: auto; }
        .close-button { color: #ffd700; font-size: 28px; font-weight: bold; cursor: pointer; }
        .improvement-item { display: block; padding: 0.5rem 0.75rem; border-radius: 0.375rem; transition: background-color 0.2s ease-in-out; cursor: pointer; }
        .improvement-item:hover { background-color: #f0f9ff; }
        .improvement-item .source { font-size: 0.75rem; color: #6b7280; }
        .pacing-slower { background-color: #fee2e2; color: #991b1b; }
        .pacing-faster { background-color: #dbeafe; color: #1e40af; }
        .pacing-on-pace { background-color: #f3f4f6; color: #374151; }
        .pacing-badge { display: inline-block; padding: 0.125rem 0.5rem; font-size: 0.75rem; font-weight: 500; border-radius: 0.375rem; }
        .question-list-scroll { max-height: 250px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 0.375rem; padding: 0.5rem; }
        .question-list-item { padding: 0.75rem; border-bottom: 1px solid #e2e8f0; cursor: pointer; }
        .question-list-item:last-child { border-bottom: none; }
        .question-list-item:hover { background-color: #f7fafc; }
        .question-list-item .explanation { display: none; margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px dashed #cbd5e0; font-size: 0.875rem; color: #4a5568; }
        .result-icon { font-size: 1.25rem; }
    </style>
</head>
<body class="antialiased">

    <header class="sathub-header p-4 shadow-md">
        <div class="container mx-auto flex flex-wrap items-center justify-between">
            <div class="flex items-center">
                <img src="https://placehold.co/128x128/ffffff/2a5266?text=LOGO" alt="The SAT Hub Logo" class="h-12 md:h-16 w-auto mr-2 md:mr-3 rounded-md" onerror="this.onerror=null;this.src='https://placehold.co/128x128/ffffff/2a5266?text=LOGO';">
                <h1 class="sathub-header-title text-xl md:text-2xl font-bold">Analytics Hub</h1>
            </div>
            <div class="flex items-center space-x-4">
                <span id="studentNameDisplay" class="text-sm hidden sm:block">Welcome!</span>
                <button id="hamburgerButton" class="md:hidden text-f0f0f0 focus:outline-none">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                </button>
            </div>
        </div>
    </header>

    <nav class="bg-white shadow-sm sticky top-0 z-50">
        <div class="container mx-auto hidden md:flex">
            <button data-main-tab="overview" class="main-tab-button active py-3 px-4">Overview</button>
            <button data-main-tab="cb-practice-tests" class="main-tab-button py-3 px-4">CB Non-Adaptive Tests</button>
            <button data-main-tab="reading" class="main-tab-button py-3 px-4">Reading</button>
            <button data-main-tab="writing" class="main-tab-button py-3 px-4">Writing & Language</button>
            <button data-main-tab="math" class="main-tab-button py-3 px-4">Math</button>
        </div>
        <div id="mobileMenu" class="hidden md:hidden absolute top-full left-0 right-0 bg-white shadow-xl z-40">
            <a href="#" data-main-tab="overview" class="mobile-nav-link block py-3 px-4 text-gray-700 hover:bg-gray-100">Overview</a>
            <a href="#" data-main-tab="cb-practice-tests" class="mobile-nav-link block py-3 px-4 text-gray-700 hover:bg-gray-100">CB Non-Adaptive Tests</a>
            <a href="#" data-main-tab="reading" class="mobile-nav-link block py-3 px-4 text-gray-700 hover:bg-gray-100">Reading</a>
            <a href="#" data-main-tab="writing" class="mobile-nav-link block py-3 px-4 text-gray-700 hover:bg-gray-100">Writing & Language</a>
            <a href="#" data-main-tab="math" class="mobile-nav-link block py-3 px-4 text-gray-700 hover:bg-gray-100">Math</a>
        </div>
    </nav>

    <main class="container mx-auto p-4 md:p-6">
        <div id="overview-content" class="main-tab-content space-y-6">
            <section class="themed-card">
                <div class="themed-card-title-strip">Performance Snapshot</div>
                <div id="overview-snapshot-cards" class="themed-card-body grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6"></div>
            </section>
            <section class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div class="themed-card chart-container">
                    <div class="themed-card-title-strip">Score Trend (CB Non-Adaptive Tests)</div>
                    <div class="themed-card-body"><canvas id="scoreTrendChart" height="250"></canvas></div>
                </div>
                <div class="themed-card chart-container">
                    <div class="themed-card-title-strip">Overall Skill Performance</div> 
                    <div class="themed-card-body"><canvas id="overallSkillChart" height="250"></canvas></div>
                </div>
            </section>
            <section class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div class="themed-card"><div class="themed-card-title-strip">Identified Strengths</div><div id="overviewStrengthsContainer" class="themed-card-body"></div></div>
                <div class="themed-card"><div class="themed-card-title-strip">Areas for Improvement</div><div id="overviewImprovementsContainer" class="themed-card-body"></div></div>
                <div class="themed-card"><div class="themed-card-title-strip">Time Spent (Portal Usage)</div><div class="themed-card-body" id="timeSpentOverview"></div></div>
            </section>
            <section class="themed-card">
                <div class="themed-card-title-strip">My Improvement Hub</div>
                <div class="themed-card-body" id="improvement-hub-content"></div>
            </section>
        </div>

        <div id="cb-practice-tests-content" class="main-tab-content hidden"><section class="themed-card"><div class="themed-card-title-strip">CB Non-Adaptive Tests</div><div class="themed-card-body overflow-x-auto"><table class="min-w-full table"><thead id="cb-practice-tests-thead"></thead><tbody id="cb-practice-tests-table-body"></tbody></table></div></section></div>
        
        <div id="reading-content" class="main-tab-content hidden space-y-6">
            <div class="flex flex-wrap space-x-2 mb-4 border-b pb-2"><button data-sub-tab="reading-eoc" class="sub-tab-button active">EOC Practice</button><button data-sub-tab="reading-khan" class="sub-tab-button">Khan Academy Practice</button><button data-sub-tab="reading-skills" class="sub-tab-button">Skills</button></div>
            <div id="reading-eoc-content" class="sub-tab-content-panel"><section class="themed-card"><div class="themed-card-title-strip">Reading EOC Practice</div><div class="themed-card-body overflow-x-auto"><table class="min-w-full table"><thead id="reading-eoc-thead"></thead><tbody id="reading-eoc-tbody"></tbody></table></div></section></div>
            <div id="reading-khan-content" class="sub-tab-content-panel hidden"><section class="themed-card"><div class="themed-card-title-strip">Khan Academy Practice - Reading</div><div class="themed-card-body" id="reading-khan-data"></div></section></div>
            <div id="reading-skills-content" class="sub-tab-content-panel hidden"><section class="themed-card"><div class="themed-card-title-strip">Reading Skills</div><div class="themed-card-body space-y-3" id="reading-skills-data"></div></section></div>
        </div>

        <div id="writing-content" class="main-tab-content hidden space-y-6">
            <div class="flex flex-wrap space-x-2 mb-4 border-b pb-2"><button data-sub-tab="writing-eoc" class="sub-tab-button active">EOC Practice</button><button data-sub-tab="writing-khan" class="sub-tab-button">Khan Academy Practice</button><button data-sub-tab="writing-skills" class="sub-tab-button">Skills</button></div>
            <div id="writing-eoc-content" class="sub-tab-content-panel"><section class="themed-card"><div class="themed-card-title-strip">Writing & Language EOC Practice</div><div class="themed-card-body overflow-x-auto"><table class="min-w-full table"><thead id="writing-eoc-thead"></thead><tbody id="writing-eoc-tbody"></tbody></table></div></section></div>
            <div id="writing-khan-content" class="sub-tab-content-panel hidden"><section class="themed-card"><div class="themed-card-title-strip">Khan Academy Practice - Writing & Language</div><div class="themed-card-body" id="writing-khan-data"></div></section></div>
            <div id="writing-skills-content" class="sub-tab-content-panel hidden"><section class="themed-card"><div class="themed-card-title-strip">Writing & Language Skills</div><div class="themed-card-body space-y-3" id="writing-skills-data"></div></section></div>
        </div>

        <div id="math-content" class="main-tab-content hidden space-y-6">
            <div class="flex flex-wrap space-x-2 mb-4 border-b pb-2"><button data-sub-tab="math-eoc" class="sub-tab-button active">EOC Practice</button><button data-sub-tab="math-khan" class="sub-tab-button">Khan Academy Practice</button><button data-sub-tab="math-skills" class="sub-tab-button">Skills</button></div>
            <div id="math-eoc-content" class="sub-tab-content-panel"><section class="themed-card"><div class="themed-card-title-strip">Math EOC Practice</div><div class="themed-card-body overflow-x-auto"><table class="min-w-full table"><thead id="math-eoc-thead"></thead><tbody id="math-eoc-tbody"></tbody></table></div></section></div>
            <div id="math-khan-content" class="sub-tab-content-panel hidden"><section class="themed-card"><div class="themed-card-title-strip">Khan Academy Practice - Math</div><div class="themed-card-body" id="math-khan-data"></div></section></div>
            <div id="math-skills-content" class="sub-tab-content-panel hidden"><section class="themed-card"><div class="themed-card-title-strip">Math Skills</div><div class="themed-card-body space-y-3" id="math-skills-data"></div></section></div>
        </div>
    </main>

    <footer class="bg-gray-100 border-t border-gray-200 mt-8">
        <div class="container mx-auto py-4 px-6 text-center text-gray-600 text-sm">
            &copy; <span id="currentYear"></span> The SAT Hub. All Rights Reserved.
        </div>
    </footer>

    <div id="detailModal" class="modal">
        <div id="modal-content-sizer" class="modal-content">
            <div class="modal-header">
                <h2 id="modalTitle" class="text-xl font-semibold"></h2>
                <span class="close-button" onclick="closeModal()">&times;</span>
            </div>
            <div class="modal-body-content">
                <div id="modal-test-view" class="hidden space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="flex flex-col items-center"><p class="font-semibold text-center mb-2">Question Breakdown</p><div class="w-full h-48"><canvas id="modalDonutChart"></canvas></div></div>
                        <div class="flex flex-col items-center"><p class="font-semibold text-center mb-2">Score Trend</p><div class="w-full h-48"><canvas id="modalLineChart"></canvas></div></div>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800">Question List</h3>
                        <div id="modal-question-list" class="question-list-scroll mt-2"></div>
                    </div>
                    <div id="modal-pacing-analysis-container">
                        <h3 class="text-lg font-semibold text-gray-800 border-t pt-4">Full Pacing Analysis</h3>
                        <div class="overflow-x-auto mt-2">
                            <table class="min-w-full table"><thead><tr><th>Q#</th><th>Your Time</th><th>Class Avg</th><th>Pacing</th><th>Result</th></tr></thead><tbody id="pacing-analysis-table-body"></tbody></table>
                        </div>
                    </div>
                </div>
                <div id="modal-question-view" class="hidden space-y-4">
                    <div><h3 class="text-lg font-semibold text-gray-800">Question</h3><p id="question-stem" class="mt-1 text-gray-700"></p></div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div>
                            <h4 class="font-semibold text-center mb-2">Class Performance</h4>
                            <div class="w-full h-40"><canvas id="question-donut-chart"></canvas></div>
                        </div>
                        <div id="question-pacing-info" class="text-center"></div>
                    </div>
                    <div><h3 class="text-lg font-semibold text-gray-800">Explanation</h3><p id="question-explanation" class="mt-1 text-gray-600 text-sm bg-gray-50 p-3 rounded-md"></p></div>
                </div>
            </div>
        </div>
    </div>

<script>
document.addEventListener('DOMContentLoaded', function () {
    // --- DATA STORE (Placeholders to be filled by fetched data) ---
    let currentStudentData = {
        name: "Loading...",
        targetScore: 0,
        latestScores: { total: 0, rw: 0, math: 0 },
        scoreTrend: { labels: [], studentScores: [], classAvgScores: [] },
        overallSkillPerformance: { labels: [], studentAccuracy: [], classAvgAccuracy: [] },
        allQuestions: [],
        cbPracticeTests: [],
        eocQuizzes: { reading: [], writing: [], math: [] },
        khanAcademy: { reading: [], writing: [], math: [] },
        skills: { reading: [], writing: [], math: [] }
    };

    // --- CHART INSTANCES ---
    let modalDonutChartInstance, modalLineChartInstance, questionDonutChartInstance, scoreTrendChartInstance, overallSkillChartInstance;

    // --- INITIALIZATION ---
    function init() {
        document.getElementById('currentYear').textContent = new Date().getFullYear();
        document.getElementById('studentNameDisplay').textContent = `Welcome, ${currentStudentData.name}!`;
        setupEventListeners();
        loadAndProcessData(); // Main data loading function
    }

    // --- MOCK DATA FETCHING (Simulates fetching from CSV) ---
    async function loadAndProcessData() {
        // This is where you would use PapaParse to fetch from CSV URLs.
        // For now, we'll use our detailed dummy data to simulate a successful fetch.
        const fetchedData = getMockData(); 
        
        currentStudentData = fetchedData; // Replace placeholder with fetched data
        
        // Populate the UI with the new data
        document.getElementById('studentNameDisplay').textContent = `Welcome, ${currentStudentData.name}!`;
        const overviewTab = document.querySelector('.main-tab-button[data-main-tab="overview"]');
        switchTab(overviewTab); // Start by populating and showing the overview tab
    }
    
    // --- EVENT LISTENERS ---
    function setupEventListeners() {
        document.querySelectorAll('.main-tab-button, .mobile-nav-link').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                switchTab(tab);
            });
        });
        document.querySelectorAll('.sub-tab-button').forEach(subTab => {
            subTab.addEventListener('click', () => switchSubTab(subTab));
        });
        document.getElementById('hamburgerButton').addEventListener('click', () => {
            document.getElementById('mobileMenu').classList.toggle('hidden');
        });
    }

    // --- TAB SWITCHING LOGIC ---
    function switchTab(tabElement) {
        const targetTabName = tabElement.getAttribute('data-main-tab');
        document.querySelectorAll('.main-tab-button').forEach(t => t.classList.remove('active'));
        document.querySelector(`.main-tab-button[data-main-tab="${targetTabName}"]`)?.classList.add('active');
        document.querySelectorAll('.mobile-nav-link').forEach(link => link.classList.remove('active'));
        document.querySelector(`.mobile-nav-link[data-main-tab="${targetTabName}"]`)?.classList.add('active');
        document.getElementById('mobileMenu').classList.add('hidden');
        document.querySelectorAll('.main-tab-content').forEach(content => content.classList.add('hidden'));
        document.getElementById(targetTabName + '-content').classList.remove('hidden');

        // Populate content for the activated tab
        switch(targetTabName) {
            case 'overview': populateOverviewTab(); break;
            case 'cb-practice-tests': populatePracticeTestsTable(currentStudentData.cbPracticeTests); break;
            case 'reading': case 'writing': case 'math': populateSubjectTab(targetTabName); break;
        }
    }

    function switchSubTab(subTabElement) {
        const parentPanel = subTabElement.closest('.main-tab-content');
        parentPanel.querySelectorAll('.sub-tab-button').forEach(st => st.classList.remove('active'));
        subTabElement.classList.add('active');
        parentPanel.querySelectorAll('.sub-tab-content-panel').forEach(panel => panel.classList.add('hidden'));
        document.getElementById(subTabElement.getAttribute('data-sub-tab') + '-content')?.classList.remove('hidden');
    }

    // --- UI POPULATION FUNCTIONS ---
    function populateOverviewTab() {
        const snapshotContainer = document.getElementById('overview-snapshot-cards');
        snapshotContainer.innerHTML = `
            <div class="score-card"><h3 class="text-sm font-medium text-gray-600">Latest Total</h3><p class="text-3xl font-bold score-value">${currentStudentData.latestScores.total}</p></div>
            <div class="score-card"><h3 class="text-sm font-medium text-gray-600">Latest R&W</h3><p class="text-3xl font-bold score-value">${currentStudentData.latestScores.rw}</p></div>
            <div class="score-card"><h3 class="text-sm font-medium text-gray-600">Latest Math</h3><p class="text-3xl font-bold score-value">${currentStudentData.latestScores.math}</p></div>
            <div class="score-card"><h3 class="text-sm font-medium text-gray-600">Target Score</h3><p class="text-3xl font-bold" style="color: #8a3ffc;">${currentStudentData.targetScore}</p></div>
            <div class="score-card"><h3 class="text-sm font-medium text-gray-600">Avg EOC Score</h3><p class="text-3xl font-bold score-value">83%</p></div>`;

        if (scoreTrendChartInstance) scoreTrendChartInstance.destroy();
        scoreTrendChartInstance = new Chart(document.getElementById('scoreTrendChart').getContext('2d'), {type:'line', data:{labels:currentStudentData.scoreTrend.labels, datasets:[{label:'Your Score',data:currentStudentData.scoreTrend.studentScores, borderColor:'#2a5266'},{label:'Class Avg',data:currentStudentData.scoreTrend.classAvgScores, borderColor:'#9ca3af', borderDash:[5,5]}]}});
        
        if (overallSkillChartInstance) overallSkillChartInstance.destroy();
        overallSkillChartInstance = new Chart(document.getElementById('overallSkillChart').getContext('2d'), {type:'bar', data:{labels:currentStudentData.overallSkillPerformance.labels, datasets:[{label:'Your Accuracy',data:currentStudentData.overallSkillPerformance.studentAccuracy, backgroundColor:'#2a5266'},{label:'Class Avg',data:currentStudentData.overallSkillPerformance.classAvgAccuracy, backgroundColor:'#9ca3af'}]}});
        
        populateImprovementHub(currentStudentData.allQuestions);

        // Populate Strengths and Weaknesses
        const allSkills = Object.values(currentStudentData.skills).flat().filter(s => s.score !== null);
        const strengths = [...allSkills].sort((a,b) => b.score - a.score).slice(0, 3);
        const improvements = [...allSkills].sort((a,b) => a.score - b.score).slice(0, 3);
        document.getElementById('overviewStrengthsContainer').innerHTML = `<ul>${strengths.map(s => `<li>${s.name} (${s.score}%)</li>`).join('')}</ul>`;
        document.getElementById('overviewImprovementsContainer').innerHTML = `<ul>${improvements.map(s => `<li>${s.name} (${s.score}%)</li>`).join('')}</ul>`;
        document.getElementById('timeSpentOverview').innerHTML = `<p>Avg Time: 120 min/day</p>`; // Placeholder
    }

    function populateImprovementHub(allQuestions) {
        const container = document.getElementById('improvement-hub-content');
        const incorrectQs = allQuestions.filter(q => !q.isCorrect);
        if (incorrectQs.length === 0) { container.innerHTML = '<p class="text-center p-4 text-gray-500">Great job! No incorrect questions found to review.</p>'; return; }
        const qsBySkill = incorrectQs.reduce((acc, q) => { (acc[q.skill] = acc[q.skill] || []).push(q); return acc; }, {});
        container.innerHTML = Object.entries(qsBySkill).map(([skill, questions]) => `
            <div class="mb-4">
                <h4 class="text-md font-semibold text-gray-800 mb-2 border-b pb-1">${skill}</h4>
                ${questions.map(q => `<a href="#" class="improvement-item" onclick="event.preventDefault(); openModal('Question Analysis', { type: 'question_deep_dive', questionId: ${q.id} })">
                        <p>${q.text}</p><p class="source">From: ${q.source}</p></a>`).join('')}
            </div>`).join('');
    }
    
    function populatePracticeTestsTable(tests) {
        const tableBody = document.getElementById('cb-practice-tests-table-body');
        const tableHead = document.getElementById('cb-practice-tests-thead');
        if(tableHead) tableHead.innerHTML = `<tr><th>Test Name</th><th>Date</th><th>R&W</th><th>Math</th><th>Total</th></tr>`;
        tableBody.innerHTML = tests.map(test => {
            const isAttempted = test.date !== "Not Attempted";
            return `<tr class="${isAttempted ? 'clickable-row' : 'opacity-60'}" ${isAttempted ? `onclick="openModal('${test.name} Details', { type: 'cb_test', testName: '${test.name}' })"` : ''}>
                <td>${test.name}</td><td>${test.date}</td><td>${test.rw}</td><td>${test.math}</td><td>${test.total}</td></tr>`;
        }).join('');
    }

    function populateSubjectTab(subject) {
        const eocTbody = document.getElementById(`${subject}-eoc-tbody`);
        eocTbody.innerHTML = (currentStudentData.eocQuizzes[subject] || []).map(item => `<tr class="clickable-row"><td>${item.name}</td><td>${item.latestScore}</td><td>${item.date}</td></tr>`).join('') || `<tr><td colspan="3" class="text-center p-4">No EOC data</td></tr>`;
        
        const khanContainer = document.getElementById(`${subject}-khan-data`);
        khanContainer.innerHTML = (currentStudentData.khanAcademy[subject] || []).map(item => `<p class="p-2 border-b clickable-row">${item.name}: ${item.score} (${item.date})</p>`).join('') || '<p class="p-2 text-center">No Khan Academy data</p>';
        
        const skillsContainer = document.getElementById(`${subject}-skills-data`);
        skillsContainer.innerHTML = (currentStudentData.skills[subject] || []).map(skill => {
            const perfClass = skill.score >= 85 ? 'performance-good' : skill.score >= 70 ? 'performance-average' : 'performance-poor';
            return `<div class="p-2"><div class="flex justify-between items-center mb-1"><span class="font-medium">${skill.name}</span><span>${skill.score}%</span></div>
                <div class="progress-bar-container"><div class="progress-bar ${perfClass}" style="width: ${skill.score}%"></div></div>
                <p class="text-xs text-gray-500 mt-1">Class Avg: ${skill.classAvg}%</p></div>`;
        }).join('') || '<p class="text-center p-4">No skill data</p>';
        
        const firstSubTab = document.querySelector(`#${subject}-content .sub-tab-button`);
        if(firstSubTab) switchSubTab(firstSubTab);
    }

    // --- MODAL LOGIC ---
    window.openModal = function(title, details) {
        const modalSizer = document.getElementById('modal-content-sizer');
        document.getElementById('modalTitle').textContent = title;
        const testView = document.getElementById('modal-test-view');
        const questionView = document.getElementById('modal-question-view');
        testView.classList.add('hidden');
        questionView.classList.add('hidden');
        modalSizer.classList.remove('modal-large');

        if (details.type === 'cb_test') {
            modalSizer.classList.add('modal-large');
            testView.classList.remove('hidden');
            const test = currentStudentData.cbPracticeTests.find(t => t.name === details.testName);
            const testQuestions = currentStudentData.allQuestions.filter(q => test.questionIds.includes(q.id));
            renderTestView(test, testQuestions);
        } else if (details.type === 'question_deep_dive') {
            questionView.classList.remove('hidden');
            const question = currentStudentData.allQuestions.find(q => q.id === details.questionId);
            renderQuestionView(question);
        }
        document.getElementById('detailModal').style.display = 'block';
    };

    function renderTestView(test, questions) {
        const listContainer = document.getElementById('modal-question-list');
        listContainer.innerHTML = questions.map(q => `
            <div class="question-list-item" onclick="this.querySelector('.explanation').style.display = this.querySelector('.explanation').style.display === 'block' ? 'none' : 'block'">
                <div class="flex justify-between items-center"><p><strong>Q${q.qNum}:</strong> ${q.text.substring(0, 70)}...</p>
                    <span class="result-icon ${q.isCorrect ? 'text-good' : 'text-poor'}">${q.isCorrect ? '✔' : '✖'}</span></div>
                <div class="explanation"><p><strong>Explanation:</strong> ${q.explanation}</p></div></div>`).join('');
        
        const pacingBody = document.getElementById('pacing-analysis-table-body');
        pacingBody.innerHTML = questions.map(p => {
            const diff = p.yourTime - p.classAvgTime;
            const s = (diff > 15) ? {t: 'Slower', c: 'pacing-slower'} : (diff < -15) ? {t: 'Faster', c: 'pacing-faster'} : {t: 'On Pace', c: 'pacing-on-pace'};
            return `<tr><td>${p.qNum}</td><td>${p.yourTime}s</td><td>${p.classAvgTime}s</td><td><span class="pacing-badge ${s.c}">${s.t}</span></td><td class="${p.isCorrect ? 'text-good' : 'text-poor'} font-semibold">${p.isCorrect ? 'Correct' : 'Incorrect'}</td></tr>`;
        }).join('');

        if(modalDonutChartInstance) modalDonutChartInstance.destroy();
        const correct = questions.filter(q => q.isCorrect).length;
        modalDonutChartInstance = new Chart(document.getElementById('modalDonutChart').getContext('2d'), {type:'doughnut', data:{labels:['Correct','Incorrect'], datasets:[{data:[correct, questions.length - correct], backgroundColor:['#22c55e', '#ef4444']}]}});
        
        if(modalLineChartInstance) modalLineChartInstance.destroy();
        modalLineChartInstance = new Chart(document.getElementById('modalLineChart').getContext('2d'), {type:'line', data:{labels:currentStudentData.scoreTrend.labels, datasets:[{label:'Score', data:currentStudentData.scoreTrend.studentScores, borderColor: '#2a5266'}]}});
    }
    
    function renderQuestionView(question) {
        document.getElementById('question-stem').textContent = question.text;
        document.getElementById('question-explanation').textContent = question.explanation;
        const pacingContainer = document.getElementById('question-pacing-info');
        const diff = question.yourTime - question.classAvgTime;
        const s = (diff > 15) ? {t: 'Slower', c: 'pacing-slower'} : (diff < -15) ? {t: 'Faster', c: 'pacing-faster'} : {t: 'On Pace', c: 'pacing-on-pace'};
        pacingContainer.innerHTML = `<span class="${question.isCorrect ? 'text-good' : 'text-poor'} text-3xl">${question.isCorrect ? '✔' : '✖'}</span><p class="font-semibold mt-2">${question.isCorrect ? 'Correct' : 'Incorrect'}</p>
            <p class="mt-4">Your Time: <strong>${question.yourTime}s</strong> | Class Avg: <strong>${question.classAvgTime}s</strong></p>
            <div class="mt-2"><span class="pacing-badge ${s.c}">${s.t}</span></div>`;

        if (questionDonutChartInstance) questionDonutChartInstance.destroy();
        questionDonutChartInstance = new Chart(document.getElementById('question-donut-chart').getContext('2d'), { type: 'doughnut', data: { labels: ['Class Correct', 'Class Incorrect'], datasets: [{ data: [question.classCorrectPercent, 100 - question.classCorrectPercent], backgroundColor: ['#22c55e', '#ef4444'], hoverOffset: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, cutout: '60%' } });
    }
    
    window.closeModal = function() {
        document.getElementById('detailModal').style.display = 'none';
    };
    
    // --- MOCK DATA FUNCTION ---
    function getMockData() {
        return {
            name: "Alex Johnson",
            targetScore: 1400,
            latestScores: { total: 1250, rw: 620, math: 630 },
            scoreTrend: { labels: ['Diag', 'Test 1', 'Test 2'], studentScores: [1130, 1220, 1250], classAvgScores: [1050, 1150, 1180] },
            overallSkillPerformance: { labels: ['Reading', 'Writing', 'Math'], studentAccuracy: [78, 82, 75], classAvgAccuracy: [75, 79, 72] },
            allQuestions: [
                { id: 1, source: "Official Practice Test 2", qNum: 1, text: "If a circle has a radius of 5, what is its area?", skill: "Geometry", subject: 'math', isCorrect: false, explanation: "The formula for the area of a circle is πr². With a radius (r) of 5, the area is π * 5² = 25π.", classCorrectPercent: 72, yourTime: 95, classAvgTime: 70 },
                { id: 2, source: "Official Practice Test 2", qNum: 2, text: "Which choice provides the best evidence for the answer to the previous question?", skill: "Command of Evidence", subject: 'reading', isCorrect: false, explanation: "Lines 25-28 directly state the main finding...", classCorrectPercent: 65, yourTime: 110, classAvgTime: 80 },
                { id: 3, source: "Official Practice Test 2", qNum: 3, text: "What is the meaning of 'ubiquitous' in line 24?", skill: "Words in Context", subject: 'reading', isCorrect: true, explanation: "The context suggests the phenomenon was widespread...", classCorrectPercent: 88, yourTime: 45, classAvgTime: 50 },
                { id: 4, source: "Khan: Verb Tense", qNum: 1, text: "The committee _______ deliberating for three days before it reached a decision.", skill: "Transitions", subject: 'writing', isCorrect: false, explanation: "'for three days' indicates a duration...", classCorrectPercent: 78, yourTime: 35, classAvgTime: 30 },
            ],
            cbPracticeTests: [
                 { name: "Diagnostic Test", date: "2024-03-01", rw: "550", math: "580", total: "1130", questionIds: []},
                 { name: "Official Practice Test 2", date: "2024-05-15", rw: "620", math: "630", total: "1250", questionIds: [1, 2, 3] },
                 { name: "Official Practice Test 3", date: "Not Attempted", rw: "-", math: "-", total: "-", questionIds: []},
            ],
            eocQuizzes: {
                reading: [ { name: "Vocabulary in Context", latestScore: "85% (17/20)", date: "2024-05-01" } ],
                writing: [ { name: "Transitions", latestScore: "90% (9/10)", date: "2024-05-03" } ],
                math: [ { name: "Exponents & Radicals", latestScore: "75% (15/20)", date: "2024-05-05" } ]
            },
            khanAcademy: {
                reading: [{ name: "Main Idea Practice 1", score: "8/10", date: "2024-05-10" }],
                writing: [{ name: "Verb Tense Advanced", score: "12/15", date: "2024-05-11" }],
                math: []
            },
            skills: {
                reading: [ { name: "Words in Context", score: 92, classAvg: 80 }, { name: "Command of Evidence", score: 60, classAvg: 65 } ],
                writing: [ { name: "Boundaries", score: 65, classAvg: 70 }, { name: "Transitions", score: 75, classAvg: 72 } ],
                math: [ { name: "Geometry", score: 90, classAvg: 85 }, { name: "Advanced Math", score: 65, classAvg: 72 } ]
            }
        };
    }
    
    // --- START THE APP ---
    init();
});
</script>
</body>
</html>
