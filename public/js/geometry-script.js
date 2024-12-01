document.addEventListener('DOMContentLoaded', function() {
    // Get modal and button elements
    
    // Save result as a text file (without clearing it)
    document.getElementById('save-btn').addEventListener('click', function() {
        let resultText = document.getElementById('result').textContent;
        
        if (resultText.trim() === "") {
            alert("No result to save!");
            return;
        }

        let blob = new Blob([resultText], { type: 'text/plain' });
        let link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'calculation_result.txt';
        link.click();
    });

    // Print result
    document.getElementById('print-btn').addEventListener('click', function() {
        window.print();
    });

    // Share result via Web Share API (for supported browsers)
    document.getElementById('share-btn').addEventListener('click', function() {
        let resultText = document.getElementById('result').textContent;
        
        if (navigator.share) {
            navigator.share({
                title: 'Scientific Calculator Result',
                text: `Here is the result: ${resultText}`,
                url: window.location.href
            })
            .then(() => console.log('Result shared successfully!'))
            .catch((error) => console.error('Error sharing result:', error));
        } else {
            alert('Your browser does not support the Web Share API.');
        }
    });
});


    // Save result as a text file (without clearing it)
    document.getElementById('save-btn').addEventListener('click', function() {
        let resultText = document.getElementById('result').textContent;
        
        if (resultText.trim() === "") {
            alert("No result to save!");
            return;
        }

        let blob = new Blob([resultText], { type: 'text/plain' });
        let link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'calculation_result.txt';
        link.click();
    });

    // Print result
    document.getElementById('print-btn').addEventListener('click', function() {
        window.print();
    });

    // Share result via Web Share API (for supported browsers)
    document.getElementById('share-btn').addEventListener('click', function() {
        let resultText = document.getElementById('result').textContent;
        
        if (navigator.share) {
            navigator.share({
                title: 'Scientific Calculator Result',
                text: `Here is the result: ${resultText}`,
                url: window.location.href
            })
            .then(() => console.log('Result shared successfully!'))
            .catch((error) => console.error('Error sharing result:', error));
        } else {
            alert('Your browser does not support the Web Share API.');
        }
    });
