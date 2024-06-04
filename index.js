import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose'; // Import for Mongoose database connection

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

// Error handling middleware (place this before route handlers)
const errorHandler = (err, req, res, next) => {
  console.error(err); // Log the error to the console

  const statusCode = err.statusCode || 500; // Set the status code based on the error or default to 500
  const errorMessage = err.message || 'Internal Server Error'; // Set the error message

  res.status(statusCode).json({
    message: errorMessage,
  });
};

// GET all persons (using Mongoose)
app.get('/api/persons', async (req, res, next) => {
  try {
    const people = await Person.find();
    res.json(people);
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
});

// GET a single person by id (using Mongoose)
app.get('/api/persons/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const person = await Person.findById(id);

    if (person) {
      res.json(person);
    } else {
      res.status(404).end(); // No need for next here, 404 is a valid response
    }
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
});

// DELETE a person by id (using Mongoose)
app.delete('/api/persons/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    await Person.findByIdAndDelete(id);
    res.status(204).end(); // No content to return
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
});

// POST a new person (using Mongoose)
app.post('/api/persons', async (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'Name or number is missing' });
  }

  // You can uncomment this check if you want to prevent duplicate names
  // const existingPerson = await Person.find({ name: body.name });
  // if (existingPerson.length > 0) {
  //   return res.status(400).json({ error: 'Name must be unique' });
  // }

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });

  try {
    const savedPerson = await newPerson.save();
    res.json(savedPerson);
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
});

// GET info page
app.get('/info', async (req, res, next) => {
  try {
    const count = await Person.countDocuments();
    const currentTime = new Date();
    res.send(`
      <div>
        <p>Phonebook has info for <span class="math-inline">\{count\} people</p\>
<p\></span>{currentTime}</p>
      </div>
    `);
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
});

// Register the error handling middleware after all other middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3001; // Use
