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

// Terms and conditions acceptance logic
const acceptTermsCheckbox = document.getElementById('acceptTerms');
const acceptTermsButton = document.getElementById('acceptTermsButton');
const termsContainer = document.getElementById('terms-container');
const mainContainer = document.getElementById('main-container');

acceptTermsCheckbox.addEventListener('change', function() {
    acceptTermsButton.disabled = !this.checked;
});

acceptTermsButton.addEventListener('click', function() {
    if (acceptTermsCheckbox.checked) {
        termsContainer.classList.add('d-none');
        mainContainer.classList.remove('d-none');
    }
});
