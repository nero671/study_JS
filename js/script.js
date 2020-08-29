'use strict';

const start = document.getElementById('start');
const cansel = document.getElementById('cancel');
const incomeAdd = document.getElementsByTagName('button')[0];
const expensesAdd = document.getElementsByTagName('button')[1];
const depositCheck = document.querySelector('#deposit-check');
const additionalIncomeItem = document.querySelectorAll('.additional_income-item');
const budgetMonthValue = document.querySelector('.budget_month-value');
const budgetDayValue = document.getElementsByClassName('budget_day-value')[0];
const expensesMonthValue = document.getElementsByClassName('expenses_month-value')[0];
const additionalIncomeValue = document.getElementsByClassName('additional_income-value')[0];
const additionalExpensesValue = document.getElementsByClassName('additional_expenses-value')[0];
const incomePeriodValue = document.getElementsByClassName('income_period-value')[0];
const targetMonthValue = document.getElementsByClassName('target_month-value')[0];
const salaryAmount = document.querySelector('.salary-amount');
const incomeTitle = document.querySelector('.income-title');
const expensesTitle = document.querySelector('.expenses-title');
const additionalExpensesItem = document.querySelector('.additional_expenses-item');
const targetAmount = document.querySelector('.target-amount');
const periodSelect = document.querySelector('.period-select');
const periodAmount = document.querySelector('.period-amount');
const depositBank = document.querySelector('.deposit-bank');
const depositAmount = document.querySelector('.deposit-amount');
const depositPercent = document.querySelector('.deposit-percent');

let incomeItem = document.querySelectorAll('.income-items');
let expensesItems = document.querySelectorAll('.expenses-items');


let isNumber = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

let isString = function (str) {
  if (Number.isNaN(Number(str))) {
    return isNaN(str);
  }
} 

class AppData {
  constructor() {
    this.income = {};
    this.incomeMonth = 0;
    this.addIncome = [];
    this.expenses = {};
    this.addExpenses = [];
    this.deposite = false;
    this.persentDeposite = 0;
    this.moneyDeposite = 0;
    this.budget = 0;
    this.budgetDay = 0;
    this.budgetMonth = 0;
    this.expensesMonth = 0; 
  }


start () {
  this.budget = +salaryAmount.value;
  console.log(salaryAmount.value);

  this.getExpInc();
  this.getExpensesMonth();
  this.getInfoDeposite();
  this.getAddExpenses();
  this.getAddIncome();
  this.getBudget();
  this.showResult();

  if (start) {
    start.style.display = 'none';
    cansel.style.display = 'block';
    this.blockInputs();
  }

};

blockInputs (disabled = true) {
  document.querySelectorAll('input[type=text]').forEach(item => {
    item.disabled = disabled;
    if (item.disabled = disabled) {
      expensesAdd.style.display = 'none';
      incomeAdd.style.display = 'none';
    } else {
      expensesAdd.style.display = 'block';
      incomeAdd.style.display = 'block';
    }
  });
};

reset () {
    this.income = {};
    this.incomeMonth = 0;
    this.addIncome = [];
    this.expenses = {};
    this.addExpenses = [];
    this.deposite = false;
    this.persentDeposite = 0;
    this.moneyDeposite = 0;
    this.budget = 0;
    this.budgetDay = 0;
    this.budgetMonth = 0;
    this.expensesMonth = 0;
    incomeItem = document.querySelectorAll('.income-items');
    expensesItems = document.querySelectorAll('.expenses-items');
    incomeItem.forEach((item, index) => {
      if (index !== 0) {
        item.remove();
      }
    });
    expensesItems.forEach((item, index) => {
      if (index !== 0) {
        item.remove();
      }
    });
    this.blockInputs(false);
    document.querySelectorAll('input[type=text]').forEach(item => {
      item.value = '';
    });
    periodSelect.value = document.querySelector('.period-amount').textContent = 1;
    start.style.display = 'block';
    cansel.style.display = 'none';

    depositCheck.checked = false;
    depositBank.style.display = 'none';
    depositAmount.style.display = 'none';
    depositPercent.style.display = 'none';
    depositBank.value = '';
    depositAmount.value = '';
  };
  showResult () {
    budgetMonthValue.value = this.budgetMonth;
    budgetDayValue.value = Math.round(this.budgetDay);
    expensesMonthValue.value = this.expensesMonth;
    additionalExpensesValue.value = this.addExpenses.join(', ');
    additionalIncomeValue.value = this.addIncome.join(', ');
    targetMonthValue.value = Math.ceil(this.getTargetMonth());
    incomePeriodValue.value = this.calcSaveMoney();
  };
  getExpInc () {
    const count = item => {
      const startStr = item.className.split('-')[0];
      const itemTitle = item.querySelector(`.${startStr}-title`).value;
      const itemAmount = item.querySelector(`.${startStr}-amount`).value;
      if (itemTitle !== '' && itemAmount !== '') {
        this[startStr][itemTitle] = +itemAmount;
      }
    }
    incomeItem.forEach(count);
    expensesItems.forEach(count);
    
    for(const key in this.income) {
      this.incomeMonth += this.income[key];
    }
  };
  addIncExpBlock () {
    const target = event.target;
    const startStr = target.parentNode.className;
    const cloneItem = document.querySelector(`.${startStr}-items`).cloneNode(true);
    cloneItem.querySelector(`.${startStr}-title`).value = '';
    cloneItem.querySelector(`.${startStr}-amount`).value = '';
    target.parentNode.insertBefore(cloneItem, target);
    if (document.querySelectorAll(`.${startStr}-items`).length === 3) {
      target.style.display = 'none';
    }
    onlyNumbers();
    onlyLetters();
  };
  getAddExpenses () {
    let addExpenses = additionalExpensesItem.value.split(',');
    addExpenses.forEach((item) => {
      item = item.trim();
      if (item !== '') {
        this.addExpenses.push(item);
      }
    });
  };
  getAddIncome () {
    additionalIncomeItem.forEach((item) => {
      let itemValue = item.value.trim();
      if (itemValue !== '') {
        this.addIncome.push(itemValue);
      }
    });
  };
  getExpensesMonth () {
    for (let key in this.expenses) {
      this.expensesMonth += +this.expenses[key];
    }
  };
  getBudget () {
    const monthDeposite = this.moneyDeposite * this.persentDeposite;
    this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth + monthDeposite;
    this.budgetDay = this.budgetMonth / 30;
  };
  getTargetMonth () {
    return targetAmount.value / this.budgetMonth;
  };
  getStatusIncome () {
    if (this.budgetDay >= 1200) {
      return ('У вас высокий доход!')
    } else if (this.budgetDay >= 600 && this.budgetDay < 1200) {
      return ('У вас средний доход!');
    } else if (this.budgetDay > 0 && this.budgetDay < 600) {
      return ('К сожалению уровень доход ниже среднего');
    } else if (this.budgetDay <= 0) {
      return ('Что-то пошло не так...');
    }
  };
  getInfoDeposite () {
    if (this.deposite) {
      this.persentDeposite = depositPercent.value;
      this.moneyDeposite = depositAmount.value;
    }
  };
  calcSaveMoney () {
    return this.budgetMonth * periodSelect.value;
  };
  changeRange (event) {
    const _this = this;
    let target = event.target;
    periodAmount.textContent = target.value;
    incomePeriodValue.value = appData.calcSaveMoney();
  };
  startBlock () {
    start.disabled = !salaryAmount
  };
  cahngePercent () {
    const valueSelect = this.value;
    if(valueSelect === 'other') {
      depositPercent.style.display = 'inline-block';
      depositPercent.disabled = false;
      depositPercent.value = '';
      depositPercent.addEventListener('change', () => {
        if (!isNumber(depositPercent.value) || depositPercent.value < 0 || depositPercent.value > 100) {
          start.disabled = true;
          alert('Введите корректный процент')
        } else {
          start.disabled = false;
        }
      });
    } else {
      depositPercent.value = valueSelect;
      depositPercent.disabled = true;
    }
  };
  depositeHandler () {
    if(depositCheck.checked) {
      depositBank.style.display = 'inline-block';
      depositAmount.style.display = 'inline-block';
      this.deposite = true;
      depositBank.addEventListener('change', this.cahngePercent);
    } else {
      depositBank.style.display = 'none';
      depositAmount.style.display = 'none';
      depositBank.value = '';
      depositAmount.value = '';
      depositPercent.value = '';
      this.deposite = false;
      depositBank.removeEventListener('change', this.cahngePercent);
    }
  };
  eventListeners () {
    start.addEventListener('click', this.start.bind(this));
    expensesAdd.addEventListener('click', this.addIncExpBlock);
    incomeAdd.addEventListener('click', this.addIncExpBlock);
    periodSelect.addEventListener('input', this.changeRange);
    salaryAmount.addEventListener('input', this.startBlock);
    cansel.addEventListener('click', this.reset.bind(this));
    depositCheck.addEventListener('change', this.depositeHandler.bind(this));
  };

};

const appData = new AppData();
appData.eventListeners();

console.log(appData);



let onlyLetters = function () {
  let lettersSym = document.querySelectorAll('[placeholder="Наименование"]');
  lettersSym.forEach(input => {
    input.addEventListener('keyup', function () {
      input.value = input.value.replace(/[\d]/g, '');
    })
  });
}

let onlyNumbers = function () {
  let numSym = document.querySelectorAll('[placeholder="Сумма"]');
  numSym.forEach(input => {
    input.addEventListener('keyup', function () {
      input.value = input.value.replace(/[^\+\d]/g, '');
    })
  });
}

onlyNumbers();
onlyLetters();

// appData.getInfoDeposite();
