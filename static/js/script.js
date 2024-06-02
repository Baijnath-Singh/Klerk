document.getElementById('translatorForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    fetch('/translate', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.response_text) {
            displayOutput(data.response_text);
        } else {
            displayOutput('An error occurred.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        displayOutput('An error occurred.');
    });
});

document.getElementById('clearButton').addEventListener('click', function() {
    document.getElementById('translatorForm').reset();
    document.getElementById('outputText').value = '';
});

function displayOutput(text) {
    document.getElementById('outputText').value = text;
}

// Initialize with placeholder text
displayOutput('Translated content and responses will appear here.');
