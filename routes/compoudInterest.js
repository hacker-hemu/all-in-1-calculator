const express = require('express');
const router = express.Router();
const { calculateCompoundInterest } = require('../services/formulae');

router.get('/compound-interest', (req, res) => {
    const { principal, rate, time, n } = req.query;
    if (!principal || !rate || !time || !n) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }
    const result = calculateCompoundInterest(principal, rate, time, n);
    res.json({ principal, rate, time, n, compoundInterest: result });
});

module.exports = router;
