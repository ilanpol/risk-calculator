document.addEventListener('DOMContentLoaded', function() {
    const riskForm = document.getElementById('riskForm');
    const resultsSection = document.getElementById('results');
    const printBtn = document.getElementById('printBtn');
    const newCalculationBtn = document.getElementById('newCalculationBtn');
    
    // הגדרות גלובליות לנתוני חברות
    let companyData = null;
    let dataPassword = 'YourSecretPassword123'; // סיסמה להצפנת הנתונים
    
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
    
    // פונקציות טיפול בנתוני חברה מוצפנים
    function decryptData(encryptedData, password) {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedData, password);
            const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
            if (!decryptedData) throw new Error('פענוח נכשל');
            return JSON.parse(decryptedData);
        } catch (error) {
            console.error('שגיאה בפענוח הנתונים:', error);
            return null;
        }
    }

    async function loadEncryptedData(password) {
        try {
            const response = await fetch('company_data.encrypted.json');
            if (!response.ok) throw new Error('שגיאה בטעינת הקובץ');
            
            const encryptedData = await response.text();
            const decryptedData = decryptData(encryptedData, password);
            
            if (!decryptedData || !decryptedData.companies) {
                alert('שגיאה בפענוח הנתונים. ייתכן שהסיסמה שגויה.');
                return false;
            }
            
            companyData = decr
