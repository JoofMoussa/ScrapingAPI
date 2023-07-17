// Fetch all medicaments from the API and display them in the HTML
fetch('/medicaments')
  .then(response => response.json())
  .then(medicaments => {
    const medicamentsContainer = document.getElementById('medicaments-container');

    medicaments.forEach(medicament => {
      const medicamentElement = document.createElement('div');
      medicamentElement.className = 'medicament';
      medicamentElement.innerHTML = `
        <h2>${medicament.nom_generique}</h2>
        <p><strong>Nom Standard:</strong> ${medicament.nom_standard}</p>
        <p><strong>Force:</strong> ${medicament.force}</p>
        <p><strong>Expiration:</strong> ${medicament.expiration}</p>
        <p><strong>Entreprise:</strong> ${medicament.entreprise}</p>
        <p><strong>Date de Production:</strong> ${medicament.date_production}</p>
      `;

      medicamentsContainer.appendChild(medicamentElement);
    });
  });

// Fetch all medicaments
fetch('/medicaments')
  .then(response => response.json())
  .then(data => {
    console.log(data); // Do something with the retrieved medicaments
  })
  .catch(error => {
    console.error('Error:', error);
  });

// Create a new medicament
const newMedicament = {
  nom_generique: 'Medicament 1',
  nom_standard: 'Standard 1',
  force: 'Force 1',
  expiration: '2023-12-31',
  entreprise: 'Company 1',
  date_production: '2023-01-01'
};

fetch('/medicaments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(newMedicament)
})
  .then(response => response.json())
  .then(data => {
    console.log(data); // Do something with the response after creating a new medicament
  })
  .catch(error => {
    console.error('Error:', error);
  });

// Update an existing medicament
const updatedMedicament = {
  nom_generique: 'Updated Medicament',
  nom_standard: 'Updated Standard',
  force: 'Updated Force',
  expiration: '2024-12-31',
  entreprise: 'Updated Company',
  date_production: '2024-01-01'
};

fetch('/medicaments/:id', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(updatedMedicament)
})
  .then(response => response.json())
  .then(data => {
    console.log(data); // Do something with the response after updating a medicament
  })
  .catch(error => {
    console.error('Error:', error);
  });

// Delete a medicament
fetch('/medicaments/:id', {
  method: 'DELETE'
})
  .then(response => response.json())
  .then(data => {
    console.log(data); // Do something with the response after deleting a medicament
  })
  .catch(error => {
    console.error('Error:', error);
  });
