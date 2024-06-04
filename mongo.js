const mongoose = require('mongoose');
const url = 'mongodb://<username>:<password>@<hostname>:<port>/<database>'; // Korvaa tietokannan tiedot

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB-virhe:'));
db.once('open', async () => {
  console.log('Yhteys MongoDB:hen avattu');

  const args = process.argv.slice(2);
  const password = args[0];
  const name = args[1] ? args[1].replace(/'/g, '\\\'') : null;
  const phone = args[2];

  if (password !== '<your-password>') {
    console.error('Virheellinen salasana');
    process.exit(1);
  }

  if (name && phone) {
    const person = new Person({ name, phone });
    await person.save();
    console.log(`Lisätty ${name} numero ${phone} puhelinluetteloon`);
  } else {
    const people = await Person.find();
    console.log('Puhelinluettelo:');
    people.forEach(person => console.log(`${person.name} ${person.phone}`));
  }

  await mongoose.connection.close();
});

const Person = mongoose.model('Person', {
  name: String,
  phone: String
});