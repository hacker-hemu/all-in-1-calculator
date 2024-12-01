document.addEventListener("DOMContentLoaded", function() {
    let display = document.getElementById("display");
    let resultText = document.getElementById("result");

    // Function to update the display when a button is pressed
    function updateDisplay(value) {
        display.value += value;
    }

    // Clear the display
    function clearDisplay() {
        display.value = '';
        resultText.textContent = ''; // Clear result as well
    }

    // Evaluate the expression in the display
    function evaluateExpression() {
        try {
            let expression = display.value;

            // Automatically add parentheses for trigonometric functions like sin, cos, tan, etc.
            expression = expression.replace(/(sin|cos|tan|sqrt|log|∛)(\d+\.?\d*)/g, function(match, p1, p2) {
                return p1 + '(' + p2 + ')'; // Add parentheses around the number
            });

            // Handle square root (sqrt) - replace 'sqrt(number)' with 'Math.sqrt(number)'
            expression = expression.replace(/sqrt\((\d+\.?\d*)\)/g, 'Math.sqrt($1)');

            // Handle sin, cos, tan with parentheses (angles in degrees)
            expression = expression.replace(/sin\((\d+\.?\d*)\)/g, function(match, p1) {
                return 'Math.sin(' + p1 + ' * Math.PI / 180)'; // Convert degrees to radians
            });
            expression = expression.replace(/cos\((\d+\.?\d*)\)/g, function(match, p1) {
                return 'Math.cos(' + p1 + ' * Math.PI / 180)'; // Convert degrees to radians
            });
            expression = expression.replace(/tan\((\d+\.?\d*)\)/g, function(match, p1) {
                return 'Math.tan(' + p1 + ' * Math.PI / 180)'; // Convert degrees to radians
            });

            // Handle logarithm (log) - replace 'log(number)' with 'Math.log(number)'
            expression = expression.replace(/log\((\d+\.?\d*)\)/g, 'Math.log($1)');

            // Handle cube root (∛) - replace '∛<number>' with 'Math.cbrt(number)'
            expression = expression.replace(/∛\((\d+\.?\d*)\)/g, 'Math.cbrt($1)');

            // Handle exponentiation (^) by converting to ** (ES6 operator)
            expression = expression.replace(/\^/g, '**');

            // Handle pi and e constants
            expression = expression.replace(/pi/g, 'Math.PI');
            expression = expression.replace(/e/g, 'Math.E');

            // Log the expression to debug if needed
            console.log("Expression after formatting:", expression);

            // Evaluate the expression
            let result = Function('return ' + expression)(); // Safer eval approach using Function constructor

            // Check if the result is a valid number
            if (isNaN(result) || result === Infinity || result === -Infinity) {
                display.value = 'Error';
                if (resultText) {
                    resultText.textContent = 'Error'; // Set result only if resultText exists
                }
            } else {
                display.value = result;
                if (resultText) {
                    resultText.textContent = result; // Set result only if resultText exists
                }
            }
        } catch (e) {
            // Log the error for debugging
            console.error("Error evaluating expression:", e); // Log the error
            display.value = 'Error';
            if (resultText) {
                resultText.textContent = 'Error'; // Set result only if resultText exists
            }
        }
    }

    // Handle button clicks
    let buttons = document.querySelectorAll('.button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            let value = e.target.value;

            if (value === 'C') {
                clearDisplay();
            } else if (value === '=') {
                evaluateExpression();
            } else {
                updateDisplay(value);
            }
        });
    });
});



    // Save result as a text file
    document.getElementById('save-btn').addEventListener('click', function() {
        let resultText = document.getElementById('result').textContent;
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

