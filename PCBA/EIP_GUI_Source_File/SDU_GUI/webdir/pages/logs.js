async function readLogFile() {    
    try {
        // Fetch the CSV file
        const response = await fetch('/log/log.csv'); // Adjust the path if necessary
        if (!response.ok) {
            throw new Error(`Failed to fetch log file: ${response.status}`);
        }

        // Read the file content as text
        const csvData = await response.text();

        // Split the CSV data into lines
        const lines = csvData.split('\n');

        // Extract the header row
        const headers = lines[0].split(',');

        // Iterate through each line (excluding the header)
        for (let i = lines.length - 1; i >= 1; i--){
            const line = lines[i].trim();
            if (line) {
                const values = line.split(',');
                const logEntry = {};

                // Map values to headers
                headers.forEach((header, index) => {
                    logEntry[header] = values[index];
                });

                // Append the log entry to the table
                const tbody = document.getElementById('tbodyAppLogs');
                const row = document.createElement('tr');
                headers.forEach(header => {
                    const cell = document.createElement('td');
                    cell.textContent = logEntry[header] || '';
                    row.appendChild(cell);
                });
                tbody.appendChild(row);
            }
        }
    } catch (error) {
        console.error('Error reading log file:', error);
    }
}

// Example usage
readLogFile();

$('#btnDownloadAppLogs').click(function () {
    // Get the table element
    const table = document.getElementById('applogsTable');

    // Initialize an array to store CSV rows
    const csvRows = [];

    // Extract table headers
    const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
    csvRows.push(headers.join(',')); // Join headers with semicolon for CSV format

    // Extract table rows
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const cells = Array.from(row.querySelectorAll('td')).map(td => td.textContent.trim());
        csvRows.push(cells.join(',')); // Join cells with semicolon for CSV format
    });

    // Create a CSV string
    const csvString = csvRows.join('\n');

    // Create a Blob object for the CSV data
    const blob = new Blob([csvString], { type: 'text/csv' });

    // Create a download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'applogs.csv'; // File name for the downloaded CSV
    link.click(); // Trigger the download
});