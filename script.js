const form = document.getElementById('productForm');
const resultDiv = document.getElementById('result');
const profitAmount = document.getElementById('profitAmount');
const historyDiv = document.getElementById('history');
const filterSelect = document.getElementById('filter');
const showHistoryBtn = document.getElementById('showHistoryBtn');
const historyTable = document.getElementById('historyTable').getElementsByTagName('tbody')[0];  
const addDataBtn = document.getElementById('addDataBtn');

// Function to add calculation to local storage  
function addCalculationToStorage(productName, buyPrice, sellPrice, quantity, profit) {  
  let calculations = getCalculationsFromStorage();
  const today = new Date();
  const dateString = today.toISOString().slice(0, 10); // Format: YYYY-MM-DD
  
  calculations.push({  
    date: dateString,  
    product: productName,  
    buy: buyPrice,  
    sell: sellPrice,  
    quantity: quantity,  
    profit: profit  
  });  
  localStorage.setItem('calculations', JSON.stringify(calculations));  
}  

// Function to get calculations from local storage  
function getCalculationsFromStorage() {  
  const calculations = localStorage.getItem('calculations');
  return calculations ? JSON.parse(calculations) : [];  
}  

// Function to filter calculations based on selected period  
function filterCalculations(period) {  
  const calculations = getCalculationsFromStorage();
  const today = new Date();  
  const filteredCalculations = [];  
  
  switch (period) {  
    case 'daily':  
      const todayString = today.toISOString().slice(0, 10);
      filteredCalculations.push(...calculations.filter(calc => calc.date === todayString));  
      break;
    case 'weekly':  
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Go back to the beginning of the week (Sunday)
      for (let i = 0; i < 7; i++) {  
        const dateString = startOfWeek.toISOString().slice(0, 10);
        filteredCalculations.push(...calculations.filter(calc => calc.date === dateString));  
        startOfWeek.setDate(startOfWeek.getDate() + 1); // Move to the next day  
      }  
      break;
    case 'monthly':  
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);  
      filteredCalculations.push(...calculations.filter(calc => {  
        const calcDate = new Date(calc.date);  
        return calcDate >= startOfMonth && calcDate <= endOfMonth;  
      }));
      break;  
    case 'yearly':  
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      const endOfYear = new Date(today.getFullYear(), 11, 31);  
      filteredCalculations.push(...calculations.filter(calc => {  
        const calcDate = new Date(calc.date);  
        return calcDate >= startOfYear && calcDate <= endOfYear;  
      }));  
      break;  
  }  
  
  return filteredCalculations;  
}  

// Function to display calculation history in the table  
function displayHistory(calculations) {  
  historyTable.innerHTML = ''; // Clear previous table data
  
  if (calculations.length === 0) {  
    const noDataRow = historyTable.insertRow();
    const noDataCell = noDataRow.insertCell();  
    noDataCell.colSpan = 6;  
    noDataCell.textContent = 'No calculations found for this period.';
  } else {  
    calculations.forEach(calc => {  
      const row = historyTable.insertRow();  
      row.insertCell().textContent = calc.date;  
      row.insertCell().textContent = calc.product;  
      row.insertCell().textContent = calc.buy;  
      row.insertCell().textContent = calc.sell;  
      row.insertCell().textContent = calc.quantity;  
      row.insertCell().textContent = `${calc.profit.toFixed(2)} /=`;  // Change currency to "/="
    });
  }  
}  

// Form submit event listener  
form.addEventListener('submit', function(event) {  
  event.preventDefault();  
  
  // Get input values  
  const productName = document.getElementById('productName').value;  
  const buyPrice = parseFloat(document.getElementById('buyPrice').value);  
  const sellPrice = parseFloat(document.getElementById('sellPrice').value);  
  const quantity = parseInt(document.getElementById('quantity').value);  
  
  // Calculate profit  
  const totalBuyCost = buyPrice * quantity;  
  const totalSellRevenue = sellPrice * quantity;  
  const profit = totalSellRevenue - totalBuyCost;  
  
  // Display result  
  resultDiv.style.display = 'block';  
  profitAmount.textContent = `Profit for ${productName}: ${profit.toFixed(2)} /=`;  // Change currency to "/="
  
  // Change color based on profit or loss  
  if (profit >= 0) {  
    profitAmount.style.color = 'green';  
  } else {  
    profitAmount.style.color = 'red';  
  }  
  
  // Add calculation to local storage  
  addCalculationToStorage(productName, buyPrice, sellPrice, quantity, profit);
  
  // Hide the form and show the Add Data button  
  form.style.display = 'none';  
  addDataBtn.style.display = 'block';  
});

// Show history button event listener  
showHistoryBtn.addEventListener('click', function() {  
  const selectedPeriod = filterSelect.value;  
  const filteredCalculations = filterCalculations(selectedPeriod);  
  displayHistory(filteredCalculations);  
});

// Add Data button event listener  
addDataBtn.addEventListener('click', function() {  
  // Show the form and hide the Add Data button  
  form.style.display = 'block';  
  addDataBtn.style.display = 'none';  
  
  // Optionally reset the form fields  
  form.reset();  
});
