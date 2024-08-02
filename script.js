// Add event listeners and load history on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check and apply dark mode preference
    const darkModeEnabled = localStorage.getItem('darkMode') === 'enabled';
    if (darkModeEnabled) {
        document.body.classList.add('dark-mode');
        document.getElementById('toggleDarkMode').innerText = 'Toggle Light Mode';
    }

    // Load API request history
    loadHistory();

    // Add event listener for dark mode toggle button
    document.getElementById('toggleDarkMode').addEventListener('click', toggleDarkMode);

    // Add event listener for fetch data button
    document.getElementById('fetchData').addEventListener('click', fetchData);

    // Add event listener for copy button
    document.getElementById('copyButton').addEventListener('click', copyData);

    // Add event listener for clear button
    document.getElementById('clear-url').addEventListener('click', clearUrl);
});

// Fetch data from API and display it
function fetchData() {
    const apiUrl = document.getElementById('apiUrl').value;
    const loadingSpinner = document.getElementById('loading-spinner');
    loadingSpinner.style.display = 'block'; // Show spinner

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            loadingSpinner.style.display = 'none'; // Hide spinner
            displayData(data);
            saveHistory(apiUrl, data);
        })
        .catch(error => {
            loadingSpinner.style.display = 'none'; // Hide spinner even if there's an error
            console.error('Fetching error: ', error);
            alert('Failed to fetch data from the API. Please check the URL and try again.');
        });
}

// Clear URL input field
function clearUrl() {
    document.getElementById('apiUrl').value = '';
    document.getElementById('output').innerHTML = ''; // Clear output div
}

// Copy data to clipboard
function copyData() {
    const outputDiv = document.getElementById('output');
    const text = outputDiv.innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert('Data copied to clipboard');
    }, () => {
        alert('Failed to copy data to clipboard');
    });
}

// Display fetched data and generate chart
function displayData(data) {
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = JSON.stringify(data, null, 2);

    // Generate and display the chart based on fetched data
    generateChart(data);
}

// Save API request history
function saveHistory(url, data) {
    const historyDiv = document.getElementById('history');

    const historyItem = document.createElement('div');
    historyItem.classList.add('history-item');
    historyItem.innerHTML = `
        <a href="${url}" target="_blank">${url}</a>
        <button class="delete-history">X</button>
        <pre>${JSON.stringify(data, null, 2)}</pre>
    `;

    // Add delete functionality to the history item
    historyItem.querySelector('.delete-history').addEventListener('click', () => {
        historyDiv.removeChild(historyItem);
        updateLocalStorage();
    });

    historyDiv.appendChild(historyItem);
    updateLocalStorage();
}

// Load API request history
function loadHistory() {
    const history = JSON.parse(localStorage.getItem('apiHistory')) || [];
    const historyDiv = document.getElementById('history');

    history.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.classList.add('history-item');
        historyItem.innerHTML = `
            <a href="${item.url}" target="_blank">${item.url}</a>
            <button class="delete-history">X</button>
            <pre>${JSON.stringify(item.data, null, 2)}</pre>
        `;

        // Add delete functionality to the history item
        historyItem.querySelector('.delete-history').addEventListener('click', () => {
            historyDiv.removeChild(historyItem);
            updateLocalStorage();
        });

        historyDiv.appendChild(historyItem);
    });
}

// Update local storage with API request history
function updateLocalStorage() {
    const historyDiv = document.getElementById('history');
    const historyItems = Array.from(historyDiv.querySelectorAll('.history-item')).map(item => ({
        url: item.querySelector('a').href,
        data: JSON.parse(item.querySelector('pre').innerText)
    }));

    localStorage.setItem('apiHistory', JSON.stringify(historyItems));
}

// Generate chart based on fetched data
function generateChart(data) {
    const ctx = document.getElementById('myChart').getContext('2d');
    const labels = Object.keys(data);
    const values = Object.values(data);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'API Data',
                data: values,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const darkModeEnabled = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', darkModeEnabled ? 'enabled' : 'disabled');
    document.getElementById('toggleDarkMode').innerText = darkModeEnabled ? 'Toggle Light Mode' : 'Toggle Dark Mode';
}
   