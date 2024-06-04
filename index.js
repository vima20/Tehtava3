import express from 'express'
import morgan from 'morgan';
import mongoose from 'mongoose' // Import for Mongoose database connection

const app = express();

app.use(express.json());
app.use(morgan('tiny'));

// Mongoose connection setup (replace placeholders with your actual credentials)
const url = 'mongodb://<username>:<password>@<hostname>:<port>/<database>';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB:', error));

// Define Person schema for MongoDB data
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

// GET all persons (using Mongoose)
app.get('/api/persons', async (req, res) => {
  try {
    const people = await Person.find();
    res.json(people);
  } catch (error) {
    console.error(error);
    res.status(500).end(); // Handle potential errors gracefully
  }
});

// GET a single person by id (using Mongoose)
app.get('/api/persons/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const person = await Person.findById(id);

    if (person) {
      res.json(person);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    console.error(error);
    res.status(500).end(); // Handle potential errors gracefully
  }
});

// DELETE a person by id (using Mongoose)
app.delete('/api/persons/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await Person.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).end(); // Handle potential errors gracefully
  }
});

// POST a new person (using Mongoose)
app.post('/api/persons', async (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'Name or number is missing' });
  }

  const existingPerson = await Person.find({ name: body.name });
  if (existingPerson.length > 0) {
    return res.status(400).json({ error: 'Name must be unique' });
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });

  try {
    const savedPerson = await newPerson.save();
    res.json(savedPerson);
  } catch (error) {
    console.error(error);
    res.status(500).end(); // Handle potential errors gracefully
  }
});

// GET info page
app.get('/info', async (req, res) => {
  try {
    const count = await Person.countDocuments();
    const currentTime = new Date();
    res.send(`
      <div>
        <p>Phonebook has info for ${count} people</p>
        <p>${currentTime}</p>
      </div>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).end(); // Handle potential errors gracefully
  }
});

const PORT = process.env.PORT || 3001; // Use environment variable for port if available
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
