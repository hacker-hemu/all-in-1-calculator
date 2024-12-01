const express = require('express');
const axios = require('axios');
const router = express.Router();

const API_KEY = 'a6eff1c86ba59568a76508bb'; // Replace with your actual API key
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair`; // Adjusted Base URL

router.get('/currency-conversion', async (req, res) => {
    const { amount, from, to } = req.query;


    if (!amount || !from || !to) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    try {
        // Construct full API endpoint for the conversion
        const url = `${BASE_URL}/${from}/${to}`;
        const response = await axios.get(url);

        if (response.data && response.data.conversion_rate) {
            const conversionRate = response.data.conversion_rate;
            const convertedAmount = (amount * conversionRate).toFixed(2);
            res.json({ convertedAmount, conversionRate });
        } else {
            res.status(500).json({ error: 'Failed to fetch conversion data.' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to fetch conversion rate.' });
    }
});

module.exports = router;
