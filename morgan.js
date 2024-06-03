import morgan from 'morgan';

// Morgan middleware configuration
const logger = morgan('tiny');

export default logger;
import express from 'express';
//import logger from './morgan'; // Ota morgan-tiedosto käyttöön

const app = express();

// Middleware for logging HTTP requests
app.use(logger);

// Example route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Server port
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
