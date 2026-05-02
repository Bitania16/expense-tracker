// DOM Elements
const balanceEl = document.getElementById('balance-amount');
const incomeEl = document.getElementById('income-amount');
const expenseEl = document.getElementById('expense-amount');
const listEl = document.getElementById('list');
const formEl = document.getElementById('transaction-form');
const textEl = document.getElementById('text');
const amountEl = document.getElementById('amount');
const typeButtons = document.querySelectorAll('.type-button');
let selectedType = 'income';

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Add transaction
function addTransaction(e) {
    e.preventDefault();
    
    const text = textEl.value.trim();
    let amount = +amountEl.value;
    
    if (text === '' || isNaN(amount) || amount === 0) {
        alert('Please enter valid description and amount');
        return;
    }
    
    if (selectedType === 'expense' && amount > 0) {
        amount = -amount;
    }
    if (selectedType === 'income' && amount < 0) {
        amount = Math.abs(amount);
    }
    
    const transaction = {
        id: Date.now(),
        text,
        amount
    };
    
    transactions.push(transaction);
    
    updateLocalStorage();
    updateUI();
    
    textEl.value = '';
    amountEl.value = '';
}

// Remove transaction
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    updateUI();
}

// Update dashboard
function updateDashboard() {
    const amounts = transactions.map(transaction => transaction.amount);
    
    const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
    
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => acc + item, 0)
        .toFixed(2);
    
    const expense = amounts
        .filter(item => item < 0)
        .reduce((acc, item) => acc + item, 0)
        .toFixed(2);
    
    balanceEl.innerText = `Br ${total}`;
    incomeEl.innerText = `Br ${income}`;
    expenseEl.innerText = `Br ${Math.abs(expense)}`;
}

// Display transactions
function displayTransactions() {
    listEl.innerHTML = '';
    
    transactions.forEach(transaction => {
        const li = document.createElement('li');
        li.classList.add(transaction.amount > 0 ? 'income' : 'expense');
        
        li.innerHTML = `
            ${transaction.text} <span>${transaction.amount > 0 ? '+' : ''}Br ${Math.abs(transaction.amount)}</span>
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
        `;
        
        listEl.appendChild(li);
    });
}

// Update UI
function updateUI() {
    updateDashboard();
    displayTransactions();
}

// Update localStorage
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Event listeners
formEl.addEventListener('submit', addTransaction);
typeButtons.forEach(button => {
    button.addEventListener('click', () => {
        selectedType = button.dataset.type;
        typeButtons.forEach(btn => btn.classList.toggle('selected', btn === button));
    });
});

// Initialize app
updateUI();