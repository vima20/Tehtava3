import express from 'express';
const app = express();

let persons = [
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

// Middleware for parsing JSON bodies
app.use(express.json());

// GET route to fetch all persons
app.get('/api/persons', (req, res) => {
  res.json(persons);
});

// GET route to fetch a single person by id
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).json({ error: 'Person not found' });
  }
});

// DELETE route to remove a person by id
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);
  res.status(204).end();
});

// POST route to add a new person
app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'Name or number is missing' });
  }

  const existingPerson = persons.find(person => person.name === body.name);
  if (existingPerson) {
    return res.status(400).json({ error: 'Name must be unique' });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  res.json(person);
});

// Function to generate a unique id
const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map(person => person.id)) : 0;
  return maxId + 1;
};

// Route to show info about phonebook
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

// Server port
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
