import express from 'express';
const app = express();

// Puhelinnumerotiedot kovakoodattuna taulukkona
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

// Palauttaa kaikki puhelinnumerotiedot
app.get('/api/persons', (req, res) => {
  res.json(persons);
});

// Palauttaa yksittäisen puhelinnumerotiedon id:n perusteella
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).json({ error: 'Person not found' });
  }
});

// Palauttaa tietoja puhelinluettelosta ja nykyisen kellonajan
app.get('/info', (req, res) => {
  const numberOfPersons = persons.length;
  const currentTime = new Date();
  
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
