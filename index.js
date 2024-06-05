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
      res.send(`
        <!DOCTYPE html>
        <html lang="fi">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Henkilö <span class="math-inline">\{person\.name\}</title\>
</head\>
<body\>
<h1\></span>{person.name}</h1>
          <p>Puhelinnumero: ${person.number}</p>
        </body>
        </html>
      `);
    } else {
      res.status(404).end(); // Person not found
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

// Update a person by id (using Mongoose)
app.put('/api/persons/:id', async (req, res, next) => {
  const id = req.params.id;
  const body = req.body;

  if (!body.number) {
    return res.status(400).json({ error: 'Number is missing' });
  }

  try {
    const updatedPerson = await Person.findByIdAndUpdate(id, body, { new: true }); // Return the updated document

    if (updatedPerson) {
      res.json(updatedPerson);
    } else {
      res.status(404).end(); // Person not found
    }
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
});
app.post('/api/persons', async (req, res, next) => {
  const { name, number } = req.body;

  try {
    // Validate name length
    if (name.length < 3) {
      throw new Error('Nimi on liian lyhyt. Se on oltava vähintään 3 merkkiä pitkä.');
    }

    const newPerson = new Person({ name, number });
    const savedPerson = await newPerson.save();
    res.json(savedPerson);
  } catch (error) {
    next(error); // Pass the error to the error handler middleware
  }
});

// GET info page
app.get('/info', async (req, res, next) => {
  try {
    // Fetch the number of documents in the Person collection
    const count = await Person.countDocuments();

    // Get the current date and time
    const currentTime = new Date();

    // Build the HTML response
    const htmlResponse = `
<!DOCTYPE html>
<html lang="fi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Info Page</title>
</head>
<body>
  <h1>Application Information</h1>
  <p>Number of people in the database: ${count}</p>
  <p>Current time: ${currentTime.toLocaleString('fi-FI')}</p>
</body>
</html>`;

    // Send the HTML response
    res.send(htmlResponse);
  } catch (error) {
    // Handle any errors during data retrieval
    console.error(error);
    next(error); // Pass the error to the next middleware
  }
});