const express = require('express');
const router = express.Router();
const { calculateInvestmentReturn } = require('../services/formulae');

router.get('/investment-calculation', (req, res) => {
    const { initialInvestment, periodicContribution, returnRate, timePeriod } = req.query;
    if (!initialInvestment || !periodicContribution || !returnRate || !timePeriod) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }
    const result = calculateInvestmentReturn(initialInvestment, periodicContribution, returnRate, timePeriod);
    res.json({ initialInvestment, periodicContribution, returnRate, timePeriod, futureValue: result });
});

module.exports = router;
