import express from 'express';
const app = express();

const persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
];

// Reitti /api/persons palauttaa puhelinluettelotiedot
app.get('/api/persons', (req, res) => {
  res.json(persons);
});

// Reitti /info palauttaa tietoja puhelinluettelosta ja nykyisen kellonajan
app.get('/info', (req, res) => {
  const numberOfPersons = persons.length;
  const currentTime = new Date().toString();
  
  const infoPage = `
    <div>
      <p>Phonebook has info for ${numberOfPersons} people</p>
      <p>${currentTime}</p>
    </div>
  `;

  res.send(infoPage);
});

// Määritetään palvelimen portti
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
