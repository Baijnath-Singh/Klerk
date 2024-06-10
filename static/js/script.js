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
        'Karnataka': {
            'Bengaluru': {
                'Departments': {
                    'Agriculture': {
                        'Offices': {
                            'Agriculture St': {
                                address: 'No. 1, Agriculture St, Bengaluru',
                                contact: '0801234567',
                                clerks: [
                                    { name: 'Ravi Kumar', mobile: '9001234567', experience: '5 years', rating: '4.5/5' }
                                ]
                            },
                            'Agriculture Rd': {
                                address: 'No. 2, Agriculture Rd, Bengaluru',
                                contact: '0802345678',
                                clerks: [
                                    { name: 'Anita Sharma', mobile: '9002345678', experience: '3 years', rating: '4.0/5' }
                                ]
                            }
                        }
                    },
                    'Animal Husbandary and Fisheries': {
                        'Offices': {
                            'Fisheries St': {
                                address: 'No. 1, Fisheries St, Bengaluru',
                                contact: '0803456789',
                                clerks: [
                                    { name: 'Mohan Lal', mobile: '9003456789', experience: '4 years', rating: '4.2/5' }
                                ]
                            }
                        }
                    },
                    'Backward Class Welfare': {
                        'Offices': {
                            'Welfare St': {
                                address: 'No. 1, Welfare St, Bengaluru',
                                contact: '0804567890',
                                clerks: [
                                    { name: 'Geeta Devi', mobile: '9004567890', experience: '2 years', rating: '3.8/5' }
                                ]
                            }
                        }
                    },
                    'Commerce and Industries': {
                        'Offices': {
                            'Commerce St': {
                                address: 'No. 1, Commerce St, Bengaluru',
                                contact: '0805678901',
                                clerks: [
                                    { name: 'Vijay Patel', mobile: '9005678901', experience: '6 years', rating: '4.7/5' }
                                ]
                            }
                        }
                    },
                    'Co-operation': {
                        'Offices': {
                            'Cooperation St': {
                                address: 'No. 1, Cooperation St, Bengaluru',
                                contact: '0806789012',
                                clerks: [
                                    { name: 'Pooja Singh', mobile: '9006789012', experience: '5 years', rating: '4.3/5' }
                                ]
                            }
                        }
                    },
                    'Personnel and Administrative Reforms (DPAR)': {
                        'Offices': {
                            'DPAR St': {
                                address: 'No. 1, DPAR St, Bengaluru',
                                contact: '0807890123',
                                clerks: [
                                    { name: 'Ramesh Gupta', mobile: '9007890123', experience: '7 years', rating: '4.6/5' }
                                ]
                            }
                        }
                    },
                    'Administrative Reforms': {
                        'Offices': {
                            'Admin Reforms St': {
                                address: 'No. 1, Admin Reforms St, Bengaluru',
                                contact: '0808901234',
                                clerks: [
                                    { name: 'Suman Rao', mobile: '9008901234', experience: '8 years', rating: '4.8/5' }
                                ]
                            }
                        }
                    },
                    'e-Governance': {
                        'Offices': {
                            'e-Gov St': {
                                address: 'No. 1, e-Gov St, Bengaluru',
                                contact: '0809012345',
                                clerks: [
                                    { name: 'Neha Verma', mobile: '9009012345', experience: '9 years', rating: '4.9/5' }
                                ]
                            }
                        }
                    },
                    'Janaspandana': {
                        'Offices': {
                            'Jana St': {
                                address: 'No. 1, Jana St, Bengaluru',
                                contact: '0809123456',
                                clerks: [
                                    { name: 'Arun Kumar', mobile: '9009123456', experience: '10 years', rating: '5.0/5' }
                                ]
                            }
                        }
                    },
                    'Higher Education': {
                        'Offices': {
                            'Higher Edu St': {
                                address: 'No. 1, Higher Edu St, Bengaluru',
                                contact: '0809234567',
                                clerks: [
                                    { name: 'Kavita Menon', mobile: '9009234567', experience: '11 years', rating: '4.7/5' }
                                ]
                            }
                        }
                    },
                    'Primary and Secondary Education': {
                        'Offices': {
                            'Primary Edu St': {
                                address: 'No. 1, Primary Edu St, Bengaluru',
                                contact: '0809345678',
                                clerks: [
                                    { name: 'Ajay Mehta', mobile: '9009345678', experience: '12 years', rating: '4.8/5' }
                                ]
                            }
                        }
                    },
                    'Energy': {
                        'Offices': {
                            'Energy St': {
                                address: 'No. 1, Energy St, Bengaluru',
                                contact: '0809456789',
                                clerks: [
                                    { name: 'Sunita Rao', mobile: '9009456789', experience: '13 years', rating: '4.9/5' }
                                ]
                            }
                        }
                    },
                    'Finance': {
                        'Offices': {
                            'Finance St': {
                                address: 'No. 1, Finance St, Bengaluru',
                                contact: '0809567890',
                                clerks: [
                                    { name: 'Anil Kapoor', mobile: '9009567890', experience: '14 years', rating: '5.0/5' }
                                ]
                            }
                        }
                    },
                    'Food and Civil Supplies': {
                        'Offices': {
                            'Food St': {
                                address: 'No. 1, Food St, Bengaluru',
                                contact: '0809678901',
                                clerks: [
                                    { name: 'Jyoti Sharma', mobile: '9009678901', experience: '15 years', rating: '4.7/5' }
                                ]
                            }
                        }
                    },
                    'Forest, Ecology and Environment': {
                        'Offices': {
                            'Forest St': {
                                address: 'No. 1, Forest St, Bengaluru',
                                contact: '0809789012',
                                clerks: [
                                    { name: 'Rahul Sen', mobile: '9009789012', experience: '16 years', rating: '4.8/5' }
                                ]
                            }
                        }
                    },
                    // Add other departments similarly for Bengaluru...
                }
            },
            'Mysore': {
                'Departments': {
                    'Agriculture': {
                        'Offices': {
                            'Agriculture St': {
                                address: 'No. 1, Agriculture St, Mysore',
                                contact: '0821234567',
                                clerks: [
                                    { name: 'Suresh Babu', mobile: '9011234567', experience: '5 years', rating: '4.5/5' }
                                ]
                            },
                            'Agriculture Rd': {
                                address: 'No. 2, Agriculture Rd, Mysore',
                                contact: '0822345678',
                                clerks: [
                                    { name: 'Radha Nair', mobile: '9012345678', experience: '3 years', rating: '4.0/5' }
                                ]
                            }
                        }
                    },
                    'Animal Husbandary and Fisheries': {
                        'Offices': {
                            'Fisheries St': {
                                address: 'No. 1, Fisheries St, Mysore',
                                contact: '0823456789',
                                clerks: [
                                    { name: 'Mukesh Verma', mobile: '9013456789', experience: '4 years', rating: '4.2/5' }
                                ]
                            }
                        }
                    },
                    'Backward Class Welfare': {
                        'Offices': {
                            'Welfare St': {
                                address: 'No. 1, Welfare St, Mysore',
                                contact: '0824567890',
                                clerks: [
                                    { name: 'Meena Gupta', mobile: '9014567890', experience: '2 years', rating: '3.8/5' }
                                ]
                            }
                        }
                    },
                    'Commerce and Industries': {
                        'Offices': {
                            'Commerce St': {
                                address: 'No. 1, Commerce St, Mysore',
                                contact: '0825678901',
                                clerks: [
                                    { name: 'Nitin Rao', mobile: '9015678901', experience: '6 years', rating: '4.7/5' }
                                ]
                            }
                        }
                    },
                    'Co-operation': {
                        'Offices': {
                            'Cooperation St': {
                                address: 'No. 1, Cooperation St, Mysore',
                                contact: '0826789012',
                                clerks: [
                                    { name: 'Priya Singh', mobile: '9016789012', experience: '5 years', rating: '4.3/5' }
                                ]
                            }
                        }
                    },
                    'Personnel and Administrative Reforms (DPAR)': {
                        'Offices': {
                            'DPAR St': {
                                address: 'No. 1, DPAR St, Mysore',
                                contact: '0827890123',
                                clerks: [
                                    { name: 'Ravi Patel', mobile: '9017890123', experience: '7 years', rating: '4.6/5' }
                                ]
                            }
                        }
                    },
                    'Administrative Reforms': {
                        'Offices': {
                            'Admin Reforms St': {
                                address: 'No. 1, Admin Reforms St, Mysore',
                                contact: '0828901234',
                                clerks: [
                                    { name: 'Sakshi Rao', mobile: '9018901234', experience: '8 years', rating: '4.8/5' }
                                ]
                            }
                        }
                    },
                    'e-Governance': {
                        'Offices': {
                            'e-Gov St': {
                                address: 'No. 1, e-Gov St, Mysore',
                                contact: '0829012345',
                                clerks: [
                                    { name: 'Naveen Gupta', mobile: '9019012345', experience: '9 years', rating: '4.9/5' }
                                ]
                            }
                        }
                    },
                    'Janaspandana': {
                        'Offices': {
                            'Jana St': {
                                address: 'No. 1, Jana St, Mysore',
                                contact: '0829123456',
                                clerks: [
                                    { name: 'Arjun Kumar', mobile: '9019123456', experience: '10 years', rating: '5.0/5' }
                                ]
                            }
                        }
                    },
                    'Higher Education': {
                        'Offices': {
                            'Higher Edu St': {
                                address: 'No. 1, Higher Edu St, Mysore',
                                contact: '0829234567',
                                clerks: [
                                    { name: 'Kalpana Menon', mobile: '9019234567', experience: '11 years', rating: '4.7/5' }
                                ]
                            }
                        }
                    },
                    'Primary and Secondary Education': {
                        'Offices': {
                            'Primary Edu St': {
                                address: 'No. 1, Primary Edu St, Mysore',
                                contact: '0829345678',
                                clerks: [
                                    { name: 'Amit Mehta', mobile: '9019345678', experience: '12 years', rating: '4.8/5' }
                                ]
                            }
                        }
                    },
                    'Energy': {
                        'Offices': {
                            'Energy St': {
                                address: 'No. 1, Energy St, Mysore',
                                contact: '0829456789',
                                clerks: [
                                    { name: 'Sunil Rao', mobile: '9019456789', experience: '13 years', rating: '4.9/5' }
                                ]
                            }
                        }
                    },
                    'Finance': {
                        'Offices': {
                            'Finance St': {
                                address: 'No. 1, Finance St, Mysore',
                                contact: '0829567890',
                                clerks: [
                                    { name: 'Anil Kumar', mobile: '9019567890', experience: '14 years', rating: '5.0/5' }
                                ]
                            }
                        }
                    },
                    'Food and Civil Supplies': {
                        'Offices': {
                            'Food St': {
                                address: 'No. 1, Food St, Mysore',
                                contact: '0829678901',
                                clerks: [
                                    { name: 'Jaya Sharma', mobile: '9019678901', experience: '15 years', rating: '4.7/5' }
                                ]
                            }
                        }
                    },
                    'Forest, Ecology and Environment': {
                        'Offices': {
                            'Forest St': {
                                address: 'No. 1, Forest St, Mysore',
                                contact: '0829789012',
                                clerks: [
                                    { name: 'Rahul Nair', mobile: '9019789012', experience: '16 years', rating: '4.8/5' }
                                ]
                            }
                        }
                    },
                    // Add other departments similarly for Mysore...
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

    const selectedOffice = this.options[this.selectedIndex].value;
    const officeAddress = data[countrySelect.value][stateSelect.value][citySelect.value]['Departments'][departmentSelect.value]['Offices'][selectedOffice]['address'];
    
    document.getElementById('officeAddress').textContent = officeAddress;

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
