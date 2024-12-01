// formulae.js

module.exports = {

    //simple interest
    calculateSimpleInterest: (principal, rate, time) => (principal * rate * time) / 100,

    //compound interest
    calculateCompoundInterest: (principal, rate, time, n) =>
        (principal * Math.pow(1 + rate / (n * 100), n * time) - principal).toFixed(2),
    
    // salary caculate
    calculateNetSalary: (grossSalary, deductions, bonuses) =>
        (parseFloat(grossSalary) - parseFloat(deductions) + parseFloat(bonuses)).toFixed(2),

    // retirenment corpus
    calculateRetirementCorpus: (currentAge, retirementAge, savings, returnRate) => {
        const yearsToRetirement = retirementAge - currentAge;
        if (yearsToRetirement <= 0) {
            throw new Error('Retirement age must be greater than current age');
        }
        return (savings * Math.pow(1 + returnRate / 100, yearsToRetirement)).toFixed(2);
    },

    //invstment return
    calculateInvestmentReturn: (initialInvestment, periodicContribution, returnRate, timePeriod) => {
        const principalGrowth = initialInvestment * Math.pow(1 + returnRate / 100, timePeriod);
        const contributionsGrowth =
            periodicContribution *
            ((Math.pow(1 + returnRate / 100, timePeriod) - 1) / (returnRate / 100));
        return (principalGrowth + contributionsGrowth).toFixed(2);
    },
};
