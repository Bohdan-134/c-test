import { process } from './env.js'
import { saveLocalStorage, updateLocalStorage } from './storage.js'
import { uuidv4 } from './unique-uid.js'

// костыль для env в gulp, should to add webpack
const API_KEY = process.env.API_KEY || '361aed1da6aa007db558524d15e156e5'
const API_URL = process.env.API_URL || 'https://api.exchangeratesapi.io/v1/convert'

function addHistory({ amount, toCurrency, fromCurrency, id }) {
    const historyTable = document.querySelector('.tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
          <td class="align-middle">${amount} ${fromCurrency}</td>
          <td class="align-middle">${fromCurrency}</td>
          <td class="align-middle">${toCurrency}</td>
          <td>
            <button class="btn btn-delete-row">Delete</button>
          </td>
        `;

    newRow.querySelector('.btn-delete-row').addEventListener('click', function () {
        historyTable.removeChild(newRow);
        updateLocalStorage(id)
    });

    historyTable.appendChild(newRow);
}

async function handleSubmit(event) {
    event.preventDefault();

    const form = event.target;

    const { fromCurrency, toCurrency, amount } = form.elements;

    const fields = {
        fromCurrency: fromCurrency.value,
        toCurrency: toCurrency.value,
        amount: amount.value,
        id: uuidv4()
    }

    if (!Object.values(fields).every((value) => !!value)) {
        console.log("Заполните все поля")
        return;
    }

    form.reset()

    try {
        const response = await fetch(`${API_URL}?access_key=${API_KEY}&from=${fields.fromCurrency}&to=${fields.toCurrency}&amount=${fields.amount}`);

        // only for subscribe plan...
        const data = await response.json();

    } catch (error) {
        console.error('Произошла ошибка при выполнении запроса:', error);
    }

    addHistory(fields);

    saveLocalStorage(fields);
}

const form = document.getElementById('currencyConverterForm');

form.addEventListener('submit', handleSubmit);

document.addEventListener('DOMContentLoaded', function () {
    try {
        const historyData = JSON.parse(localStorage.getItem('history')) || [];

        historyData.forEach((row) => {
            addHistory(row)
        });

        debugger
    } catch (error) {
        console.error('Произошла ошибка при парсинге данных', error);
    }
});
