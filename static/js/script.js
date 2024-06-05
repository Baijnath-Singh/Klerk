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

// Find Clerk button logic
const findClerkButton = document.getElementById('findClerkButton');
const clerkInfoContainer = document.getElementById('clerkInfoContainer');

findClerkButton.addEventListener('click', function() {
    mainContainer.classList.add('d-none');
    clerkInfoContainer.classList.remove('d-none');
    loadCountryOptions();
});

function loadCountryOptions() {
    const countrySelect = document.getElementById('countrySelect');
    countrySelect.innerHTML = '<option value="">Select Country</option>';
    const countries = ['India']; // For now, we only include India
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
    });
}

// Logic to populate state, city, department, office, and clerk options dynamically
const countrySelect = document.getElementById('countrySelect');
const stateSelect = document.getElementById('stateSelect');
const citySelect = document.getElementById('citySelect');
const departmentSelect = document.getElementById('departmentSelect');
const officeSelect = document.getElementById('officeSelect');
const clerkSelect = document.getElementById('clerkSelect');

const data = {
    'India': {
        'Maharashtra': {
            'Mumbai': {
                'Departments': {
                    'Finance': {
                        'Offices': {
                            'Office 1': {
                                address: '123 Finance St, Mumbai',
                                contact: '9876543210',
                                clerks: [
                                    { name: 'John Doe', mobile: '1234567890', experience: '5 years', rating: '4.5/5' },
                                    { name: 'Jane Doe', mobile: '0987654321', experience: '3 years', rating: '4.0/5' }
                                ]
                            },
                            'Office 2': {
                                address: '456 Business Rd, Mumbai',
                                contact: '8765432109',
                                clerks: [
                                    { name: 'Jim Beam', mobile: '2345678901', experience: '4 years', rating: '4.2/5' },
                                    { name: 'Jack Daniels', mobile: '3456789012', experience: '2 years', rating: '3.8/5' }
                                ]
                            }
                        }
                    }
                }
            },
            'Pune': {
                'Departments': {
                    'IT': {
                        'Offices': {
                            'Office 1': {
                                address: '789 Tech Ave, Pune',
                                contact: '7654321098',
                                clerks: [
                                    { name: 'Alice Wonderland', mobile: '4567890123', experience: '6 years', rating: '4.7/5' },
                                    { name: 'Bob Builder', mobile: '5678901234', experience: '5 years', rating: '4.3/5' }
                                ]
                            }
                        }
                    }
                }
            }
        }
    }
};

countrySelect.addEventListener('change', function() {
    stateSelect.innerHTML = '<option value="">Select State</option>';
    stateSelect.disabled = !this.value;
    citySelect.innerHTML = '<option value="">Select City</option>';
    citySelect.disabled = true;
    departmentSelect.innerHTML = '<option value="">Select Department</option>';
    departmentSelect.disabled = true;
    officeSelect.innerHTML = '<option value="">Select Office</option>';
    officeSelect.disabled = true;
    clerkSelect.innerHTML = '<option value="">Select Clerk</option>';
    clerkSelect.disabled = true;

    if (this.value) {
        const states = Object.keys(data[this.value]);
        states.forEach(state => {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            stateSelect.appendChild(option);
        });
    }
});

stateSelect.addEventListener('change', function() {
    citySelect.innerHTML = '<option value="">Select City</option>';
    citySelect.disabled = !this.value;
    departmentSelect.innerHTML = '<option value="">Select Department</option>';
    departmentSelect.disabled = true;
    officeSelect.innerHTML = '<option value="">Select Office</option>';
    officeSelect.disabled = true;
    clerkSelect.innerHTML = '<option value="">Select Clerk</option>';
    clerkSelect.disabled = true;

    if (this.value) {
        const cities = Object.keys(data[countrySelect.value][this.value]);
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }
});

citySelect.addEventListener('change', function() {
    departmentSelect.innerHTML = '<option value="">Select Department</option>';
    departmentSelect.disabled = !this.value;
    officeSelect.innerHTML = '<option value="">Select Office</option>';
    officeSelect.disabled = true;
    clerkSelect.innerHTML = '<option value="">Select Clerk</option>';
    clerkSelect.disabled = true;

    if (this.value) {
        const departments = Object.keys(data[countrySelect.value][stateSelect.value][this.value]['Departments']);
        departments.forEach(department => {
            const option = document.createElement('option');
            option.value = department;
            option.textContent = department;
            departmentSelect.appendChild(option);
        });
    }
});

departmentSelect.addEventListener('change', function() {
    officeSelect.innerHTML = '<option value="">Select Office</option>';
    officeSelect.disabled = !this.value;
    clerkSelect.innerHTML = '<option value="">Select Clerk</option>';
    clerkSelect.disabled = true;

    if (this.value) {
        const offices = Object.keys(data[countrySelect.value][stateSelect.value][citySelect.value]['Departments'][this.value]['Offices']);
        offices.forEach(office => {
            const option = document.createElement('option');
            option.value = office;
            option.textContent = office;
            officeSelect.appendChild(option);
        });
    }
});

officeSelect.addEventListener('change', function() {
    clerkSelect.innerHTML = '<option value="">Select Clerk</option>';
    clerkSelect.disabled = !this.value;

    if (this.value) {
        const clerks = data[countrySelect.value][stateSelect.value][citySelect.value]['Departments'][departmentSelect.value]['Offices'][this.value]['clerks'];
        clerks.forEach(clerk => {
            const option = document.createElement('option');
            option.value = clerk.name;
            option.textContent = `${clerk.name} (${clerk.mobile})`;
            option.dataset.experience = clerk.experience;
            option.dataset.rating = clerk.rating;
            clerkSelect.appendChild(option);
        });
    }
});

// Back button logic for clerk form
const clerkFormBackButton = document.getElementById('clerkFormBackButton');
clerkFormBackButton.addEventListener('click', function() {
    clerkInfoContainer.classList.add('d-none');
    mainContainer.classList.remove('d-none');
});

// Clerk form submit logic
const findClerkSubmit = document.getElementById('findClerkSubmit');
findClerkSubmit.addEventListener('click', function() {
    const selectedClerk = clerkSelect.options[clerkSelect.selectedIndex];
    const clerkInfo = `
        Name: ${selectedClerk.value}
        Mobile: ${selectedClerk.textContent}
        Experience: ${selectedClerk.dataset.experience}
        Rating: ${selectedClerk.dataset.rating}
    `;
    document.getElementById('clerkOutputText').value = clerkInfo;
});
