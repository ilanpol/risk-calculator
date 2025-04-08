document.addEventListener('DOMContentLoaded', function() {
    const riskForm = document.getElementById('riskForm');
    const resultsSection = document.getElementById('results');
    const printBtn = document.getElementById('printBtn');
    const newCalculationBtn = document.getElementById('newCalculationBtn');
    
    // משקולות המרכיבים
    const weights = {
        prevTransactions: 0.10,
        returnedChecks: 0.23,
        creditDays: 0.08,
        dnbScore: 0.05,
        industryScore: 0.05,
        industryComparison: 0.05,
        companyAge: 0.10,
        socioeconomicIndex: 0.03,
        alerts: 0.03,
        colleagueRecommendation: 0.05,
        drawerGuarantee: 0.03,
        ownerOrigin: 0.05,
        avgTransaction: 0.08,
        location: 0.05,
        arrangement: 0.02
    };
    
    // אירועים
    if (riskForm) {
        riskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateRiskScore();
        });
    }
    
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            window.print();
        });
    }
    
    if (newCalculationBtn) {
        newCalculationBtn.addEventListener('click', function() {
            resultsSection.classList.add('hidden');
            riskForm.reset();
            window.scrollTo(0, 0);
        });
    }
    
// קוד לטיפול בהעלאת תמונה והצגתה
const checkImageInput = document.getElementById('checkImage');
const imagePreview = document.getElementById('checkImagePreview');
const previewImg = document.getElementById('previewImg');

if (checkImageInput) {
    checkImageInput.addEventListener('change', function(event) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                imagePreview.classList.remove('hidden');
            };
            
            reader.readAsDataURL(file);
        }
    });
}
    
    // פונקציה ראשית לחישוב דירוג סיכון
    function calculateRiskScore() {
        // שליפת ערכים מהטופס
        const prevTransactions = parseInt(document.getElementById('prevTransactions').value) || 0;
        const returnedChecks = parseInt(document.getElementById('returnedChecks').value) || 0;
        const avgCreditDays = parseInt(document.getElementById('avgCreditDays').value) || 0;
        const creditDays = parseInt(document.getElementById('creditDays').value) || 0;
        const dnbScore = parseInt(document.getElementById('dnbScore').value) || 0;
        const industryScore = parseInt(document.getElementById('industryScore').value) || 0;
        const companyAge = parseInt(document.getElementById('companyAge').value) || 0;
        const socioeconomicIndex = parseInt(document.getElementById('socioeconomicIndex').value) || 0;
        const alerts = parseInt(document.getElementById('alerts').value) || 0;
        const colleagueRecommendation = document.getElementById('colleagueRecommendation').value;
        const drawerGuarantee = document.getElementById('drawerGuarantee').value;
        const arrangement = document.getElementById('arrangement').value;
        const checkAmount = parseFloat(document.getElementById('checkAmount').value) || 0;
        const avgTransaction = parseFloat(document.getElementById('avgTransaction').value) || 0;
        const sameLocation = document.getElementById('sameLocation').value;
        const ownerOrigin = parseInt(document.getElementById('ownerOrigin').value) || 5;
        
        // חישוב ערכים מנורמלים
        const normalizedValues = {
            prevTransactions: normalizePrevTransactions(prevTransactions, returnedChecks),
            returnedChecks: normalizeReturnedChecks(returnedChecks),
            creditDays: normalizeCreditDays(avgCreditDays, creditDays),
            dnbScore: normalizeDnbScore(dnbScore),
            industryScore: normalizeIndustryScore(industryScore),
            industryComparison: normalizeIndustryComparison(dnbScore, industryScore),
            companyAge: normalizeCompanyAge(companyAge),
            socioeconomicIndex: normalizeSocioeconomicIndex(socioeconomicIndex),
            alerts: normalizeAlerts(alerts),
            colleagueRecommendation: normalizeRecommendation(colleagueRecommendation),
            drawerGuarantee: normalizeGuarantee(drawerGuarantee),
            ownerOrigin: normalizeOwnerOrigin(ownerOrigin),
            avgTransaction: normalizeAvgTransaction(checkAmount, avgTransaction),
            location: normalizeLocation(sameLocation),
            arrangement: normalizeArrangement(arrangement)
        };
        
        // חישוב ציונים משוקללים
        const weightedScores = {};
        let totalScore = 0;
        
        for (const key in normalizedValues) {
            weightedScores[key] = normalizedValues[key] * weights[key] * 100;
            totalScore += weightedScores[key];
        }
        
        // הצגת התוצאות
        displayResults(normalizedValues, weightedScores, totalScore);
        
        // הצגת גרף
        createChart(weightedScores);
        
        // הצגת אזור התוצאות
        resultsSection.classList.remove('hidden');
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // פונקציות נרמול
    function normalizePrevTransactions(count, returns) {
        if (count >= 100) return 1;
        if (count >= 50) return 0.8;
        if (count >= 20) return 0.6;
        if (count >= 10) return 0.4;
        if (count >= 5) return 0.2;
        return 0.1;
    }
    
    function normalizeReturnedChecks(count) {
        return Math.max(0, 1 - count * 0.2);
    }
    
    function normalizeCreditDays(avg, current) {
        const deviation = current - avg;
        if (deviation <= 0) return 1;
        return Math.max(0, 1 - (deviation / 60));
    }
    
    function normalizeDnbScore(score) {
        if (score >= 30) return score / 100;
        return Math.max(0, (score / 100) - 0.3);
    }
    
    function normalizeIndustryScore(score) {
        if (score >= 32) return score / 100;
        return Math.max(0, (score / 100) - 0.3);
    }
    
    function normalizeIndustryComparison(companyScore, industryScore) {
        const diff = companyScore - industryScore;
        if (diff >= 0) return 1;
        return Math.max(0, 1 - Math.abs(diff) / 50);
    }
    
    function normalizeCompanyAge(age) {
        if (age >= 30) return 1;
        if (age >= 20) return 0.8;
        if (age >= 10) return 0.6;
        if (age >= 5) return 0.4;
        if (age >= 3) return 0.2;
        return 0.1;
    }
    
    function normalizeSocioeconomicIndex(index) {
        return index / 10;
    }
    
    function normalizeAlerts(count) {
        return Math.max(0, 1 - count * 0.2);
    }
    
    function normalizeRecommendation(value) {
        return value === 'yes' ? 1 : 0;
    }
    
    function normalizeGuarantee(value) {
        return value === 'yes' ? 1 : 0;
    }
    
    function normalizeOwnerOrigin(value) {
        return value / 10;
    }
    
    function normalizeAvgTransaction(current, avg) {
        if (avg === 0 || current <= avg) return 1;
        return Math.max(0, 1 - ((current / avg) - 1) * 0.5);
    }
    
    function normalizeLocation(sameLocation) {
        return sameLocation === 'yes' ? 1 : 0;
    }
    
    function normalizeArrangement(hasArrangement) {
        return hasArrangement === 'yes' ? 0 : 1;
    }
    
    // פונקציה להצגת התוצאות
    function displayResults(normalizedValues, weightedScores, totalScore) {
        document.getElementById('finalScore').textContent = totalScore.toFixed(1);
        document.getElementById('totalWeightedScore').textContent = totalScore.toFixed(1);
        
        // קביעת הדירוג
        let grade = '';
        let color = '';
        
        if (totalScore >= 90) { grade = 'AAA'; color = '#4CAF50'; }
        else if (totalScore >= 80) { grade = 'AA'; color = '#8BC34A'; }
        else if (totalScore >= 70) { grade = 'A'; color = '#CDDC39'; }
        else if (totalScore >= 60) { grade = 'BBB'; color = '#FFEB3B'; }
        else if (totalScore >= 50) { grade = 'BB'; color = '#FFC107'; }
        else if (totalScore >= 40) { grade = 'B'; color = '#FF9800'; }
        else if (totalScore >= 30) { grade = 'CCC'; color = '#FF5722'; }
        else { grade = 'D'; color = '#F44336'; }
        
        document.getElementById('scoreGrade').textContent = grade;
        document.getElementById('scoreGrade').style.backgroundColor = color;
        
        // מילוי טבלת הפירוט
        const tbody = document.getElementById('scoreDetailsBody');
        tbody.innerHTML = '';
        
        const components = [
            { key: 'prevTransactions', name: 'מספר עסקאות קודמות', rawValue: document.getElementById('prevTransactions').value },
            { key: 'returnedChecks', name: 'מספר חזרות שיקים', rawValue: document.getElementById('returnedChecks').value },
            { key: 'creditDays', name: 'חריגה מממוצע ימי אשראי', rawValue: (document.getElementById('creditDays').value - document.getElementById('avgCreditDays').value) + ' ימים' },
            { key: 'dnbScore', name: 'סקור D&B המושך', rawValue: document.getElementById('dnbScore').value },
            { key: 'industryScore', name: 'סקור D&B ענף', rawValue: document.getElementById('industryScore').value },
            { key: 'industryComparison', name: 'מסוכנת מהענף שלה', rawValue: document.getElementById('dnbScore').value < document.getElementById('industryScore').value ? 'כן' : 'לא' },
            { key: 'companyAge', name: 'שנות ותק', rawValue: document.getElementById('companyAge').value },
            { key: 'socioeconomicIndex', name: 'מדד סוציואקונומי', rawValue: document.getElementById('socioeconomicIndex').value },
            { key: 'alerts', name: 'מספר התרעות', rawValue: document.getElementById('alerts').value },
            { key: 'colleagueRecommendation', name: 'המלצת קולגות', rawValue: document.getElementById('colleagueRecommendation').value === 'yes' ? 'כן' : 'לא' },
            { key: 'drawerGuarantee', name: 'ערבות מושך', rawValue: document.getElementById('drawerGuarantee').value === 'yes' ? 'כן' : 'לא' },
            { key: 'ownerOrigin', name: 'מהיכן הבעלים', rawValue: document.getElementById('ownerOrigin').value },
            { key: 'avgTransaction', name: 'עסקה ממוצעת למושך', rawValue: document.getElementById('avgTransaction').value },
            { key: 'location', name: 'מיקום זהה', rawValue: document.getElementById('sameLocation').value === 'yes' ? 'כן' : 'לא' },
            { key: 'arrangement', name: 'היה הסדר עם המושך', rawValue: document.getElementById('arrangement').value === 'yes' ? 'כן' : 'לא' }
        ];
        
        components.forEach(component => {
            const row = document.createElement('tr');
            
            const nameCell = document.createElement('td');
            nameCell.textContent = component.name;
            
            const rawValueCell = document.createElement('td');
            rawValueCell.textContent = component.rawValue;
            
            const normalizedValueCell = document.createElement('td');
            normalizedValueCell.textContent = (normalizedValues[component.key] * 100).toFixed(1) + '%';
            
            const weightCell = document.createElement('td');
            weightCell.textContent = (weights[component.key] * 100) + '%';
            
            const weightedScoreCell = document.createElement('td');
            weightedScoreCell.textContent = weightedScores[component.key].toFixed(2);
            
            row.appendChild(nameCell);
            row.appendChild(rawValueCell);
            row.appendChild(normalizedValueCell);
            row.appendChild(weightCell);
            row.appendChild(weightedScoreCell);
            
            tbody.appendChild(row);
        });
    }
    
    // פונקציה ליצירת גרף
    function createChart(weightedScores) {
        if (!window.Chart) {
            console.error('Chart.js לא נטען');
            return;
        }
        
        const ctx = document.getElementById('scoreChart').getContext('2d');
        
        // המרת הנתונים למבנה הנדרש עבור Chart.js
        const labels = {
            prevTransactions: 'עסקאות',
            returnedChecks: 'חזרות',
            creditDays: 'אשראי',
            dnbScore: 'D&B',
            industryScore: 'ענף',
            industryComparison: 'מסוכנות',
            companyAge: 'ותק',
            socioeconomicIndex: 'סוציו',
            alerts: 'התרעות',
            colleagueRecommendation: 'המלצות',
            drawerGuarantee: 'ערבות',
            ownerOrigin: 'בעלים',
            avgTransaction: 'עסקה',
            location: 'מיקום',
            arrangement: 'הסדר'
        };
        
        const chartLabels = Object.keys(weightedScores).map(key => labels[key]);
        const chartData = Object.values(weightedScores);
        
        // אם כבר קיים גרף, יש להשמיד אותו
        if (window.myChart instanceof Chart) {
            window.myChart.destroy();
        }
        
        // יצירת גרף חדש
        window.myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartLabels,
                datasets: [{
                    label: 'ציון משוקלל',
                    data: chartData,
                    backgroundColor: '#8884d8',
                    borderColor: '#6a67a8',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 25
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
});
