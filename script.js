class Calculator {
    constructor() {
        this.previousOperand = '';
        this.currentOperand = '0';
        this.operation = undefined;
        this.updateDisplay();
    }

    clearAll() {
        this.previousOperand = '';
        this.currentOperand = '0';
        this.operation = undefined;
        this.updateDisplay();
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand = this.currentOperand.toString() + number;
        }
        this.updateDisplay();
    }

    toggleSign() {
        this.currentOperand = (parseFloat(this.currentOperand) * -1).toString();
        this.updateDisplay();
    }

    percentage() {
        this.currentOperand = (parseFloat(this.currentOperand) / 100).toString();
        this.updateDisplay();
    }

    setOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.calculate();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }

    calculate() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.currentOperand = 'Error';
                    this.previousOperand = '';
                    this.operation = undefined;
                    this.updateDisplay();
                    return;
                }
                computation = prev / current;
                break;
            case '^':
                computation = Math.pow(prev, current);
                break;
            default:
                return;
        }

        this.currentOperand = this.formatNumber(computation);
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    // Scientific Functions
    sin() {
        this.currentOperand = Math.sin(parseFloat(this.currentOperand) * Math.PI / 180).toString();
        this.updateDisplay();
    }

    cos() {
        this.currentOperand = Math.cos(parseFloat(this.currentOperand) * Math.PI / 180).toString();
        this.updateDisplay();
    }

    tan() {
        this.currentOperand = Math.tan(parseFloat(this.currentOperand) * Math.PI / 180).toString();
        this.updateDisplay();
    }

    sqrt() {
        const number = parseFloat(this.currentOperand);
        if (number < 0) {
            this.currentOperand = 'Error';
        } else {
            this.currentOperand = Math.sqrt(number).toString();
        }
        this.updateDisplay();
    }

    log() {
        const number = parseFloat(this.currentOperand);
        if (number <= 0) {
            this.currentOperand = 'Error';
        } else {
            this.currentOperand = Math.log10(number).toString();
        }
        this.updateDisplay();
    }

    ln() {
        const number = parseFloat(this.currentOperand);
        if (number <= 0) {
            this.currentOperand = 'Error';
        } else {
            this.currentOperand = Math.log(number).toString();
        }
        this.updateDisplay();
    }

    power() {
        this.setOperation('^');
    }

    pi() {
        this.currentOperand = Math.PI.toString();
        this.updateDisplay();
    }

    formatNumber(number) {
        if (isNaN(number)) return 'Error';
        
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        const currentOperandElement = document.querySelector('.current-operand');
        const previousOperandElement = document.querySelector('.previous-operand');

        currentOperandElement.textContent = this.currentOperand;
        
        if (this.operation != null) {
            previousOperandElement.textContent = 
                `${this.formatNumber(this.previousOperand)} ${this.operation}`;
        } else {
            previousOperandElement.textContent = '';
        }

        // Add scale animation
        currentOperandElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            currentOperandElement.style.transform = 'scale(1)';
        }, 100);
    }
}

// Add ripple effect to buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('div');
        ripple.classList.add('ripple');
        this.appendChild(ripple);

        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        setTimeout(() => {
            ripple.remove();
        }, 1000);
    });
});

// Add animation when updating display
function animateValue(element, start, end, duration) {
    if (start === end) return;
    const range = end - start;
    let current = start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = current;
        if (current === end) {
            clearInterval(timer);
        }
    }, stepTime);
}

// Initialize calculator
const calculator = new Calculator();

// Add keyboard support
document.addEventListener('keydown', event => {
    if (event.key >= '0' && event.key <= '9' || event.key === '.') {
        calculator.appendNumber(event.key);
    }
    if (event.key === '+') calculator.setOperation('+');
    if (event.key === '-') calculator.setOperation('-');
    if (event.key === '*') calculator.setOperation('×');
    if (event.key === '/') calculator.setOperation('÷');
    if (event.key === 'Enter' || event.key === '=') calculator.calculate();
    if (event.key === 'Escape') calculator.clearAll();
    if (event.key === 'Backspace') {
        calculator.currentOperand = calculator.currentOperand.toString().slice(0, -1);
        if (calculator.currentOperand === '') calculator.currentOperand = '0';
        calculator.updateDisplay();
    }
});
