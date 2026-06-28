// --- 1. ENGINE CONTROLLER ROUTER VIEW MODE ---
function switchMode(targetMode) {
    const stdView = document.getElementById('standard-view');
    const finView = document.getElementById('financial-view');
    const btnStd = document.getElementById('btn-standard');
    const btnFin = document.getElementById('btn-financial');

    if (targetMode === 'standard') {
        stdView.classList.remove('hidden');
        finView.classList.add('hidden');
        btnStd.classList.add('active');
        btnFin.classList.remove('active');
    } else {
        stdView.classList.add('hidden');
        finView.classList.remove('hidden');
        btnStd.classList.remove('active');
        btnFin.classList.add('active');
        adjustFormulaInputs(); // Populate default selection inputs instantly
    }
}

// --- 2. STANDARD MATH ENGINE MODULE ---
let currentExpression = "";
const outputDisplay = document.getElementById('calc-output');
const historyDisplay = document.getElementById('calc-history');

function appendNumber(num) {
    if (outputDisplay.textContent === "0" && num !== ".") {
        outputDisplay.textContent = num;
    } else {
        outputDisplay.textContent += num;
    }
    currentExpression += num;
}

function appendOperator(op) {
    const displayValue = outputDisplay.textContent;
    const lastChar = displayValue[displayValue.length - 1];
    
    if (['+', '-', '*', '/'].includes(lastChar)) {
        // Swap operations safely
        currentExpression = currentExpression.slice(0, -1) + op;
        outputDisplay.textContent = displayValue.slice(0, -1) + op;
    } else {
        currentExpression += op;
        outputDisplay.textContent += op;
    }
}

function clearDisplay() {
    currentExpression = "";
    outputDisplay.textContent = "0";
    historyDisplay.textContent = "";
}

function backspace() {
    const val = outputDisplay.textContent;
    if (val.length > 1) {
        outputDisplay.textContent = val.slice(0, -1);
        currentExpression = currentExpression.slice(0, -1);
    } else {
        outputDisplay.textContent = "0";
        currentExpression = "";
    }
}

function executeCalculation() {
    if (!currentExpression) return;
    try {
        // Evaluate native continuous calculation array elements
        let evaluationResult = eval(currentExpression);
        
        // Handle floating precision rounding cleanly
        if (evaluationResult % 1 !== 0) {
            evaluationResult = parseFloat(evaluationResult.toFixed(6));
        }
        
        historyDisplay.textContent = currentExpression + " =";
        outputDisplay.textContent = evaluationResult;
        currentExpression = evaluationResult.toString();
    } catch (err) {
        outputDisplay.textContent = "Syntax Error";
        currentExpression = "";
    }
}

// --- 3. FINANCIAL QUANTITATIVE FORMULAS SCHEMAS ---
const inputWorkspace = document.getElementById('dynamic-inputs');

function adjustFormulaInputs() {
    const selection = document.getElementById('formula-select').value;
    inputWorkspace.innerHTML = ""; // Wipe past UI blocks clear

    let htmlTemplate = "";

    if (selection === "simple-interest") {
        htmlTemplate = `
            <div class="input-block"><label>Principal Capital (P)</label><input type="number" id="fin-p" value="1000"></div>
            <div class="input-block"><label>Annual Interest Rate % (r)</label><input type="number" id="fin-r" value="5"></div>
            <div class="input-block"><label>Time Horizon in Years (t)</label><input type="number" id="fin-t" value="3"></div>
        `;
    } else if (selection === "compound-interest") {
        htmlTemplate = `
            <div class="input-block"><label>Principal Initial Capital (P)</label><input type="number" id="fin-p" value="1000"></div>
            <div class="input-block"><label>Annual Base Rate % (r)</label><input type="number" id="fin-r" value="6"></div>
            <div class="input-block"><label>Compounding Frequency per Year (n)</label><input type="number" id="fin-n" value="12"></div>
            <div class="input-block"><label>Total Duration in Years (t)</label><input type="number" id="fin-t" value="5"></div>
        `;
    } else if (selection === "npv") {
        htmlTemplate = `
            <div class="input-block"><label>Initial Outlay Investment (Negative value)</label><input type="number" id="fin-outlay" value="-5000"></div>
            <div class="input-block"><label>Discount Cost of Capital % (k)</label><input type="number" id="fin-rate" value="10"></div>
            <div class="input-block"><label>Cash Flows Array (Comma Separated values)</label><input type="text" id="fin-flows" value="2000, 2500, 3000"></div>
        `;
    } else if (selection === "irr") {
        htmlTemplate = `
            <div class="input-block"><label>Initial Outlay Investment (Negative value)</label><input type="number" id="fin-outlay" value="-4000"></div>
            <div class="input-block"><label>Cash Flows Array (Comma Separated values)</label><input type="text" id="fin-flows" value="1500, 1800, 2200"></div>
        `;
    } else if (selection === "annuity") {
        htmlTemplate = `
            <div class="input-block"><label>Target Present Value (PV)</label><input type="number" id="fin-pv" value="10000"></div>
            <div class="input-block"><label>Periodic Term Interest Rate % (r)</label><input type="number" id="fin-r" value="8"></div>
            <div class="input-block"><label>Total Payment Installments count (n)</label><input type="number" id="fin-n" value="12"></div>
        `;
    }

    inputWorkspace.innerHTML = htmlTemplate;
}

function processFinancialFormula() {
    const formulaType = document.getElementById('formula-select').value;
    const finalResultDisplay = document.getElementById('financial-output');
    let calculationResult = 0;

    if (formulaType === "simple-interest") {
        const p = parseFloat(document.getElementById('fin-p').value);
        const r = parseFloat(document.getElementById('fin-r').value) / 100;
        const t = parseFloat(document.getElementById('fin-t').value);
        const interestEarned = p * r * t;
        calculationResult = `Interest: ${interestEarned.toFixed(2)}\nTotal Value: ${(p + interestEarned).toFixed(2)}`;
        
    } else if (formulaType === "compound-interest") {
        const p = parseFloat(document.getElementById('fin-p').value);
        const r = parseFloat(document.getElementById('fin-r').value) / 100;
        const n = parseFloat(document.getElementById('fin-n').value);
        const t = parseFloat(document.getElementById('fin-t').value);
        const accumulatedAmount = p * Math.pow((1 + (r / n)), (n * t));
        calculationResult = `Accumulated: ${accumulatedAmount.toFixed(2)}`;

    } else if (formulaType === "npv") {
        const outlay = parseFloat(document.getElementById('fin-outlay').value);
        const rate = parseFloat(document.getElementById('fin-rate').value) / 100;
        const flows = document.getElementById('fin-flows').value.split(',').map(Number);
        
        let npvAccumulator = outlay;
        for (let i = 0; i < flows.length; i++) {
            npvAccumulator += flows[i] / Math.pow((1 + rate), i + 1);
        }
        calculationResult = `NPV Result: ${npvAccumulator.toFixed(2)} FCFA`;

    } else if (formulaType === "irr") {
        const outlay = parseFloat(document.getElementById('fin-outlay').value);
        const flows = document.getElementById('fin-flows').value.split(',').map(Number);
        const allFlows = [outlay, ...flows];
        
        // Approximate IRR calculation using Newton-Raphson method
        let guessRate = 0.1; 
        for (let loop = 0; loop < 100; loop++) {
            let npvValue = 0;
            let derivativeValue = 0;
            for (let t = 0; t < allFlows.length; t++) {
                npvValue += allFlows[t] / Math.pow(1 + guessRate, t);
                derivativeValue -= (t * allFlows[t]) / Math.pow(1 + guessRate, t + 1);
            }
            let nextRate = guessRate - (npvValue / derivativeValue);
            if (Math.abs(nextRate - guessRate) < 0.0001) {
                guessRate = nextRate;
                break;
            }
            guessRate = nextRate;
        }
        calculationResult = `Approx IRR: ${(guessRate * 100).toFixed(2)}%`;

    } else if (formulaType === "annuity") {
        const pv = parseFloat(document.getElementById('fin-pv').value);
        const r = parseFloat(document.getElementById('fin-r').value) / 100;
        const n = parseFloat(document.getElementById('fin-n').value);
        
        const pmtValue = (pv * r) / (1 - Math.pow(1 + r, -n));
        calculationResult = `Payment (PMT): ${pmtValue.toFixed(2)} per period`;
    }

    finalResultDisplay.innerText = calculationResult;
}
