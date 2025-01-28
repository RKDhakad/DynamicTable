const table = document.getElementById('Data-Table');
const tableHead = table.querySelector('thead');
const tableBody = table.querySelector('tbody');
let frozenColumns = 0;

// Add filter row dynamically
const filterRow = document.createElement('tr');
for (let i = 0; i < 10; i++) {
    const filterCell = document.createElement('th');
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `Filter Col ${i + 1}`;
    input.oninput = function () {
        const columnIndex = i;
        const filterValue = input.value.toLowerCase();
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cell = row.children[columnIndex];
            if (cell.textContent.toLowerCase().includes(filterValue)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    };
    filterCell.appendChild(input);
    filterRow.appendChild(filterCell);
}
tableHead.appendChild(filterRow);

// Export to CSV function
function exportTableToCSV() {
    const rows = table.querySelectorAll('tr');
    let csvContent = '';
    rows.forEach(row => {
        const rowData = [];
        row.querySelectorAll('th, td').forEach(cell => {
            rowData.push(cell.textContent);
        });
        csvContent += rowData.join(',') + '\n';
    });
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'table.csv';
    link.click();
}

// Show/hide columns functionality
function toggleColumnPopup() {
    const popup = document.getElementById('columnPopup');
    popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
    const columnCheckboxes = document.getElementById('columnCheckboxes');
    columnCheckboxes.innerHTML = ''; // Clear previous checkboxes

    const columns = tableHead.querySelectorAll('th'); // Only the first row (thead)
    columns.forEach((column, index) => {
        // Check if the column has text content, exclude empty columns
        if (column.textContent.trim() !== "" && index >= frozenColumns) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = column.style.display !== 'none';
            checkbox.id = `col-${index}`;
            checkbox.onclick = function () {
                toggleColumnVisibility(index, checkbox.checked);
            };
            const label = document.createElement('label');
            label.setAttribute('for', checkbox.id);
            label.textContent = column.textContent;
            columnCheckboxes.appendChild(checkbox);
            columnCheckboxes.appendChild(label);
            columnCheckboxes.appendChild(document.createElement('br'));
        }
    });
}

// Apply column visibility
function applyColumnVisibility() {
    const columns = tableHead.querySelectorAll('th');
    columns.forEach((column, index) => {
        const checkbox = document.getElementById(`col-${index}`);
        if (checkbox && index >= frozenColumns) {
            column.style.display = checkbox.checked ? '' : 'none';
            table.querySelectorAll('td').forEach((cell, rowIndex) => {
                if (cell.cellIndex === index) {
                    cell.style.display = checkbox.checked ? '' : 'none';
                }
            });
        }
    });
}

// Freeze columns functionality
function toggleFreezePopup() {
    const popup = document.getElementById('freezePopup');
    popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
}

// Apply the freezing of columns based on the input number
function applyFreezeColumns() {
    const freezeCount = parseInt(document.getElementById('freezeCount').value);
    if (isNaN(freezeCount) || freezeCount < 1 || freezeCount > 10) {
        alert('Please enter a valid number between 1 and 10');
        return;
    }

    frozenColumns = freezeCount;

    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
        for (let i = 0; i < freezeCount; i++) {
            const cell = row.cells[i];
            cell.style.position = 'sticky';
            cell.style.left = `${i * 150}px`; // Assuming column width is 150px
            cell.style.backgroundColor = '#f4f4f4';
        }
    });

    toggleFreezePopup(); // Close popup after freezing columns
    toggleColumnPopup(); // Refresh hide/unhide popup to exclude frozen columns
}

// Unfreeze all columns
function unfreezeColumns() {
    frozenColumns = 0;
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
        Array.from(row.cells).forEach(cell => {
            cell.style.position = '';
            cell.style.left = '';
            cell.style.backgroundColor = '';
        });
    });

    toggleColumnPopup(); // Refresh hide/unhide popup after unfreezing
}
