let resultDisplayed = false; // Flag to track if result has been displayed

function appendToDisplay(value) {
    const display = document.getElementById('display');

    // If "Error" is displayed, reset the display first
    if (display.value === 'Error') {
        clearDisplay();
    }

    if (resultDisplayed) {
        // If result was displayed, reset the display with the new value
        if (['+', '-', '*', '/', '%', '+/-', '(', ')', '.'].includes(value)) {
            display.value += value; // Append the new value to the result
        } else {
            clearDisplay(); // Clear display if other keys are pressed
            display.value = value; // Start with the new value
        }
        resultDisplayed = false; // Reset flag
    } else {
        display.value += value;
    }

    // Track the last entered value
    lastEnteredValue = value;
}

function clearDisplay() {
    const display = document.getElementById('display');
    display.value = '';
    lastEnteredValue = '';
    resultDisplayed = false; // Reset flag when clearing display
}

function deleteLastCharacter() {
    const display = document.getElementById('display');

    // If the display shows "Error", reset the display
    if (display.value === 'Error') {
        clearDisplay();
    } else if (resultDisplayed) {
        clearDisplay(); // Reset display after a result has been shown
    } else {
        display.value = display.value.slice(0, -1);
        lastEnteredValue = display.value.split(/[\+\-\*\/\(\)\%]/).pop();
    }
}

function evaluateExpression() {
    const display = document.getElementById('display');
    let expression = display.value;

    // Normalize the expression by handling consecutive arithmetic operators
    expression = normalizeExpression(expression);

    try {
        // Evaluate the cleaned expression
        display.value = eval(expression);
        resultDisplayed = true; // Set flag to true when result is displayed
    } catch (e) {
        display.value = 'Error';
        resultDisplayed = false; // Reset flag if error occurs
    }
}

function normalizeExpression(expression) {
    // Replace instances of '+-' with '-' and '--' with '+'
    expression = expression.replace(/\+\-/g, '-');
    expression = expression.replace(/\-\-/g, '+');

    // Remove this line to avoid issues with same operands on either side of the operator
    // expression = expression.replace(/(\d)([\+\*\/])\1/g, '$1$2'); // Remove duplicate operators

    return expression;
}


function toggleSign() {
    const display = document.getElementById('display');
    let expression = display.value;

    // Regular expression to find the last number or expression
    const regex = /(\(\-\d+\.?\d*\)|\d+\.?\d*|\.\d+)([^\d]|$)/g;
    let match;
    let lastNumber = '';
    let lastIndex = -1;

    // Find the last number or sub-expression in the string
    while ((match = regex.exec(expression)) !== null) {
        lastNumber = match[1];
        lastIndex = match.index;
    }

    if (lastNumber !== '') {
        const isNegative = lastNumber.startsWith('(-');
        let newNumber;

        if (isNegative) {
            // If already negative with brackets, remove the brackets and minus sign
            newNumber = lastNumber.slice(2, -1);
        } else {
            // Otherwise, add brackets and make it negative
            newNumber = `(-${lastNumber})`;
        }

        // Replace the last number or sub-expression with the toggled one
        display.value = expression.slice(0, lastIndex) + newNumber + expression.slice(lastIndex + lastNumber.length);
    }
}

