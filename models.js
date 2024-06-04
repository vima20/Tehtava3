const mongoose = require('mongoose');

const url = 'mongodb://<username>:<password>@<hostname>:<port>/<database>'; // Korvaa tietokannan tiedot

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB-virhe:'));
db.once('open', () => console.log('Yhteys MongoDB:hen avattu'));

const personSchema = new mongoose.Schema({
  name: String,
  phone: String
});

const Person = mongoose.model('Person', personSchema);

module.exports = {
  Person
};
