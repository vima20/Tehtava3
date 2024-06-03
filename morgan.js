import express from 'express';
import morgan from 'morgan';

const app = express();

// Morganin konfigurointi siten, että se loggaa HTTP POST-pyyntöjen datan
app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body) // Lisätään tähän pyynnön body JSON-muodossa
  ].join(' ');
}));

// Middleware for parsing JSON bodies
app.use(express.json());

// POST route to add a new person
app.post('/api/persons', (req, res) => {
  // Tässä käsitellään POST-pyynnön loggaus
  console.log(req.body); // Tulostaa POST-pyynnön bodyn konsoliin

  // Muu sovelluskoodi täällä
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
