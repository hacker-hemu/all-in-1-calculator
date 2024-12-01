
// Utility function to handle API requests
async function fetchData(apiUrl, params) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${apiUrl}?${query}`);
    return response.json();
}
//search  option
const search = () => {
    const searchbox = document.getElementById("search-item").value.toUpperCase();
    const sections = document.querySelectorAll(".container section");
    const headings = document.querySelectorAll(".container section h2");

    for (let i = 0; i < headings.length; i++) {
        const heading = headings[i];
        const textValue = heading.textContent || heading.innerHTML;

        if (textValue.toUpperCase().indexOf(searchbox) > -1) {
            sections[i].style.display = ""; // Show section
        } else {
            sections[i].style.display = "none"; // Hide section
        }
    }
};


// Simple Interest Calculator
document.getElementById('simpleInterestForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const params = {
        principal: document.getElementById('siPrincipal').value,
        rate: document.getElementById('siRate').value,
        time: document.getElementById('siTime').value,
    };

    try {   
        const result = await fetchData('/api/simple-interest', params);
        document.getElementById('simpleInterestResult').innerText = 
        `Simple Interest: ${result.simpleInterest}, Total Amount: ${parseFloat(result.totalAmount) }`;
        console.log(result.simpleInterest);
        console.log(result);

    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('result').innerText = 'Error calculating simple interest.';
    }
});

// Compound Interest Calculator
document.getElementById('compoundInterestForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const params = {
        principal: document.getElementById('ciPrincipal').value,
        rate: document.getElementById('ciRate').value,
        time: document.getElementById('ciTime').value,
        n: document.getElementById('ciCompounds').value,
    };
    const result = await fetchData('/api/compound-interest', params);
    console.log(result);
    console.log(result);
    document.getElementById('compoundInterestResult').innerText = 
        `Compound Interest: ${result.compoundInterest}, Total Amount: ${result.principal + result.compoundInterest}`;
});

// Currency Conversion Calculator
document.getElementById('currencyForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const params = {
        amount: document.getElementById('currencyAmount').value,
        from: document.getElementById('fromCurrency').value.toUpperCase(),
        to: document.getElementById('toCurrency').value.toUpperCase(),
    };
    console.log(params);
    const result = await fetchData('/api/currency-conversion', params);
    console.log(result);
    document.getElementById('currencyResult').innerText = 
        `Converted Amount: ${result.convertedAmount} ${params.to}`;
});

// Salary Calculation
document.getElementById('salaryForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const params = {
        grossSalary: document.getElementById('grossSalary').value,
        deductions: document.getElementById('deductions').value,
        bonuses: document.getElementById('bonuses').value,
    };
    console.log(params);
    const result = await fetchData('/api/salary-calculation', params);
    console.log(result);
    document.getElementById('salaryResult').innerText = `Net Salary: ${result.netSalary}`;
});

// Retirement Calculation
document.getElementById('retirementForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const params = {
        currentAge: document.getElementById('retirementAge').value,
        retirementAge: document.getElementById('retirementTargetAge').value,
        savings: document.getElementById('retirementSavings').value,
        returnRate: document.getElementById('retirementRate').value,
    };
    console.log(params);
    const result = await fetchData('/api/retirement-calculation', params);
    console.log(result);    
    document.getElementById('retirementResult').innerText = `Retirement Corpus: ${result.retirementCorpus}`;
});

// Investment Calculation
document.getElementById('investmentForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const params = {
        initialInvestment: document.getElementById('initialInvestment').value,
        periodicContribution: document.getElementById('periodicContribution').value,
        returnRate: document.getElementById('returnRate').value,
        timePeriod: document.getElementById('timePeriod').value,
    };
    console.log(params);
    const result = await fetchData('/api/investment-calculation', params);
    console.log(result);
    document.getElementById('investmentResult').innerText = 
        `Total Returns: ${result.futureValue}`;
});
