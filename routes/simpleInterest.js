const express = require('express');
const router = express.Router();
const { calculateSimpleInterest } = require('../services/formulae.js');

router.get('/simple-interest', (req, res) => {
    const { principal, rate, time } = req.query;
    
    // Validate inputs
    if (!principal || !rate || !time) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Calculate Simple Interest
    const simpleInterest = calculateSimpleInterest(principal, rate, time);
    
    // Calculate Total Amount (Principal + Simple Interest)
    const totalAmount = parseFloat(principal) + parseFloat(simpleInterest);

    // Return the result        
    res.json({simpleInterest: parseFloat(simpleInterest),
        totalAmount: totalAmount.toFixed(2),
    });
});

module.exports = router;
