const express = require('express');
const router = express.Router();
const { calculateNetSalary } = require('../services/formulae');

router.get('/salary-calculation', (req, res) => {
    const { grossSalary, deductions, bonuses } = req.query;
    if (!grossSalary || deductions === undefined || bonuses === undefined) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }    
    const result = calculateNetSalary(grossSalary, deductions, bonuses);
    res.json({ grossSalary, deductions, bonuses, netSalary: result });
});

module.exports = router;
