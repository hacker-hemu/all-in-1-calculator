const express = require('express');
const router = express.Router();
const { calculateRetirementCorpus } = require('../services/formulae');

router.get('/retirement-calculation', (req, res) => {
    const { currentAge, retirementAge, savings, returnRate } = req.query;
    if (!currentAge || !retirementAge || !savings || !returnRate) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }
    try {
        const result = calculateRetirementCorpus(currentAge, retirementAge, savings, returnRate);
        res.json({ currentAge, retirementAge, savings, returnRate, retirementCorpus: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
